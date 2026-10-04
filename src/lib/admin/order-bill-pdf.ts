import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import { INVOICE_COPY, SITE } from "@/constants/site";
import {
  BANK_DETAILS,
  EASYPAISA_ACCOUNT_TITLE,
  EASYPAISA_NUMBER,
  JAZZCASH_ACCOUNT_TITLE,
  JAZZCASH_NUMBER,
  PAYMENT_QR,
  getPaymentOption,
} from "@/constants/payment";
import { formatPrice } from "@/utils";
import type { OrderWithItems } from "@/types/db";

const BRAND = { r: 27, g: 107, b: 71 } as const;
const MUTED = { r: 100, g: 100, b: 100 } as const;
const DARK = { r: 30, g: 30, b: 30 } as const;
const LIGHT_BG = { r: 205, g: 228, b: 214 } as const;
const TABLE_ALT = { r: 248, g: 250, b: 248 } as const;

function money(amount: number): string {
  return formatPrice(Number(amount));
}

/** Print-friendly site label (www.). Clickable link still uses https. */
function displayWeb(url: string): string {
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return host.startsWith("www.") ? host : `www.${host}`;
}

async function loadPublicDataUrl(publicPath: string): Promise<string | null> {
  try {
    if (typeof window === "undefined") {
      const { readFile } = await import("fs/promises");
      const { join } = await import("path");
      const relative = publicPath.replace(/^\//, "");
      const buf = await readFile(join(process.cwd(), "public", relative));
      const ext = relative.split(".").pop()?.toLowerCase();
      const mime =
        ext === "jpg" || ext === "jpeg"
          ? "image/jpeg"
          : ext === "webp"
            ? "image/webp"
            : "image/png";
      return `data:${mime};base64,${buf.toString("base64")}`;
    }

    const res = await fetch(publicPath);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read image"));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function qrDataUrl(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, {
    margin: 1,
    width: 220,
    errorCorrectionLevel: "M",
    color: { dark: "#1b1b1b", light: "#ffffff" },
  });
}

/** Prefer official QR image; fall back to generated text QR. */
async function resolvePaymentQr(
  imagePath: string | null | undefined,
  fallbackPayload: string,
): Promise<{ dataUrl: string; format: "JPEG" | "PNG" }> {
  if (imagePath) {
    const dataUrl = await loadPublicDataUrl(imagePath);
    if (dataUrl) {
      const format = dataUrl.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
      return { dataUrl, format };
    }
  }
  return { dataUrl: await qrDataUrl(fallbackPayload), format: "PNG" };
}

function invoiceFileName(order: OrderWithItems): string {
  return `${order.order_number}-invoice.pdf`;
}

/**
 * Client-facing invoice PDF.
 * Omits admin-only fields (order status, payment status, cost, profit).
 */
export async function buildOrderBillPdf(
  order: OrderWithItems,
): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 10;

  const payment = getPaymentOption(order.payment_method);
  const address = order.shipping_address;
  const created = new Date(order.created_at).toLocaleDateString("en-PK", {
    timeZone: "Asia/Karachi",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const bankQrPayload = [
    BANK_DETAILS.bankName,
    `Title: ${BANK_DETAILS.accountTitle}`,
    `Account: ${BANK_DETAILS.accountNumber}`,
    `IBAN: ${BANK_DETAILS.iban}`,
    `Amount: ${money(Number(order.total))}`,
    `Ref: ${order.order_number}`,
  ].join("\n");

  const jazzQrPayload = [
    "JazzCash",
    JAZZCASH_NUMBER,
    `Amount: ${money(Number(order.total))}`,
    `Ref: ${order.order_number}`,
  ].join("\n");

  const easyQrPayload = [
    "Easypaisa",
    EASYPAISA_ACCOUNT_TITLE,
    EASYPAISA_NUMBER,
    `Amount: ${money(Number(order.total))}`,
    `Ref: ${order.order_number}`,
  ].join("\n");

  const [logoData, bankQr, jazzQr, easyQr] = await Promise.all([
    loadPublicDataUrl("/bayt-logo-invoice.png"),
    resolvePaymentQr(PAYMENT_QR.meezan, bankQrPayload),
    resolvePaymentQr(PAYMENT_QR.jazzcash, jazzQrPayload),
    resolvePaymentQr(PAYMENT_QR.easypaisa, easyQrPayload),
  ]);

  // ── Header ──────────────────────────────────────────────────────────
  // Layout: [logo ≈ identity height] [identity] .... [invoice meta]
  const metaW = 70;
  const metaGap = 8;
  const metaX = pageWidth - margin - metaW;
  const labelColW = 30;
  const valueColW = metaW - labelColW - 2;

  // Measure identity text height first, then size logo to match
  const provisionalLogo = 40;
  const identityW = Math.max(
    40,
    metaX - (margin + provisionalLogo + 6) - metaGap,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  const nameLines = doc.splitTextToSize(SITE.name, identityW) as string[];
  const identityRows = [
    SITE.location,
    `E-mail: ${SITE.email}`,
    `Phone: ${SITE.phone}`,
    `Web: ${displayWeb(SITE.url)}`,
  ];
  let textBlockH = nameLines.length * 5.2 + 2;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  for (const row of identityRows) {
    const lines = doc.splitTextToSize(row, identityW) as string[];
    textBlockH += lines.length * 4 + 1.3;
  }

  const logoSize = logoData
    ? Math.min(44, Math.max(34, Math.round(textBlockH + 2)))
    : 0;
  const identityX = logoData ? margin + logoSize + 6 : margin;

  if (logoData) {
    doc.addImage(logoData, "PNG", margin, y, logoSize, logoSize);
  }

  let idY = y + 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
  doc.text(nameLines, identityX, idY);
  idY += nameLines.length * 5.2 + 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  for (const row of identityRows) {
    const lines = doc.splitTextToSize(row, identityW) as string[];
    doc.text(lines, identityX, idY);
    idY += lines.length * 4 + 1.3;
  }

  // Invoice meta — clear business labels, fixed label column alignment
  const metaRows: { label: string; value: string }[] = [
    { label: "Invoice Date", value: created },
    { label: "Invoice No.", value: order.order_number },
    {
      label: "Payment Method",
      value: payment?.label ?? order.payment_method,
    },
  ];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(DARK.r, DARK.g, DARK.b);
  let metaY = y + 6;
  doc.text("INVOICE", metaX + metaW, metaY, { align: "right" });
  metaY += 8;

  for (const row of metaRows) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(row.label, metaX, metaY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(DARK.r, DARK.g, DARK.b);
    const valueLines = doc.splitTextToSize(row.value, valueColW) as string[];
    doc.text(valueLines, metaX + metaW, metaY, { align: "right" });
    metaY += Math.max(5.8, valueLines.length * 3.8) + 1.8;
  }

  y = Math.max(y + logoSize, idY, metaY) + 4;

  doc.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
  doc.setLineWidth(0.65);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  // ── Customer / Delivery (previous two-panel style) ──────────────────
  const gap = 6;
  const colW = (contentWidth - gap) / 2;
  const col2X = margin + colW + gap;
  const sectionPadX = 3;
  const headerH = 7;
  const afterHeaderGap = 5;
  const rowH = 7;

  const drawSectionLabel = (label: string, x: number, top: number) => {
    doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
    doc.roundedRect(x, top, colW, headerH, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(label, x + sectionPadX, top + 4.7);
  };

  drawSectionLabel("CUSTOMER", margin, y);
  drawSectionLabel("DELIVERY", col2X, y);

  const bodyTop = y + headerH + afterHeaderGap;

  const writeLabeledRows = (
    x: number,
    startY: number,
    rows: { label: string; value: string }[],
  ) => {
    let cursor = startY;
    const innerW = colW - sectionPadX * 2;
    const labelW = 22;
    const valueMaxW = innerW - labelW;

    for (const row of rows) {
      const valueLines = doc.splitTextToSize(
        row.value || "—",
        valueMaxW,
      ) as string[];
      const blockH = Math.max(rowH, valueLines.length * 4.2 + 2);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
      doc.text(row.label, x + sectionPadX, cursor + 3.8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(DARK.r, DARK.g, DARK.b);
      doc.text(valueLines, x + colW - sectionPadX, cursor + 3.8, {
        align: "right",
      });

      cursor += blockH;
    }
    return cursor;
  };

  const customerRows = [
    { label: "Name", value: order.customer_name },
    { label: "Phone", value: order.customer_phone },
    {
      label: "Email",
      value: order.customer_email?.trim() || "—",
    },
  ];

  const deliveryRows = [
    {
      label: "Address",
      value: [address.line1, address.line2].filter(Boolean).join(", ") || "—",
    },
    { label: "City", value: address.city || "—" },
    { label: "Province", value: address.province || "—" },
    ...(address.postalCode
      ? [{ label: "Postal code", value: address.postalCode }]
      : []),
  ];

  const leftEnd = writeLabeledRows(margin, bodyTop, customerRows);
  const rightEnd = writeLabeledRows(col2X, bodyTop, deliveryRows);
  y = Math.max(leftEnd, rightEnd) + 5;

  // ── Line items ──────────────────────────────────────────────────────
  autoTable(doc, {
    startY: y,
    head: [["Item", "Qty", "Unit price", "Amount"]],
    body: order.items.map((item) => [
      item.product_name,
      String(item.quantity),
      money(Number(item.unit_price)),
      money(Number(item.unit_price) * item.quantity),
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: [30, 30, 30],
      halign: "left",
      valign: "middle",
      lineColor: [230, 230, 230],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [BRAND.r, BRAND.g, BRAND.b],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: [TABLE_ALT.r, TABLE_ALT.g, TABLE_ALT.b],
    },
    columnStyles: {
      0: { halign: "left" },
      1: { cellWidth: 18, halign: "center" },
      2: { cellWidth: 36, halign: "right" },
      3: { cellWidth: 36, halign: "right" },
    },
    margin: { left: margin, right: margin },
  });

  y =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? y + 20;
  y += 6;

  // ── Totals box (light background) ───────────────────────────────────
  const summary = [
    { label: "Subtotal", value: money(Number(order.subtotal)), bold: false },
    {
      label: "Shipping",
      value: money(Number(order.shipping_fee)),
      bold: false,
    },
    { label: "Total", value: money(Number(order.total)), bold: true },
  ];

  const boxW = 78;
  const boxX = pageWidth - margin - boxW;
  const rowStep = 7;
  const boxH = summary.length * rowStep + 8;

  doc.setFillColor(LIGHT_BG.r, LIGHT_BG.g, LIGHT_BG.b);
  doc.roundedRect(boxX, y, boxW, boxH, 1.5, 1.5, "F");
  doc.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
  doc.setLineWidth(0.35);
  doc.roundedRect(boxX, y, boxW, boxH, 1.5, 1.5, "S");

  let rowY = y + 6.5;
  for (const row of summary) {
    doc.setFont("helvetica", row.bold ? "bold" : "normal");
    doc.setFontSize(row.bold ? 11 : 9);
    doc.setTextColor(
      row.bold ? BRAND.r : 45,
      row.bold ? BRAND.g : 45,
      row.bold ? BRAND.b : 45,
    );
    doc.text(row.label, boxX + 4, rowY);
    doc.text(row.value, boxX + boxW - 4, rowY, { align: "right" });
    rowY += rowStep;
  }
  y += boxH + 6;

  if (order.notes?.trim()) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
    doc.text("NOTE", margin, y);
    y += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    const noteLines = doc.splitTextToSize(
      order.notes.trim(),
      contentWidth,
    ) as string[];
    doc.text(noteLines, margin, y);
    y += noteLines.length * 4.2 + 4;
  }

  // ── Footer (business order): pay instructions → terms block → thanks
  const qrSize = 26;
  const qrGap = 10;
  const termsPad = 3.5;
  const termsInnerW = contentWidth - termsPad * 2;
  const termLines = doc.splitTextToSize(
    INVOICE_COPY.terms,
    termsInnerW,
  ) as string[];
  const termsBodyH = termLines.length * 3.6;
  const termsBoxH = 5 + termsBodyH + termsPad * 2;
  const footerBlockH = 6 + qrSize + 16 + 5 + termsBoxH + 6 + 8 + 6;
  const pageBottom = pageHeight - 8;

  if (y + footerBlockH > pageBottom) {
    doc.addPage();
    y = 14;
  } else {
    y += 5;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(80, 40, 120);
  doc.text(INVOICE_COPY.payByQr, margin, y);
  y += 6;

  const qrRowW = qrSize * 3 + qrGap * 2;
  const qrStartX = margin + (contentWidth - qrRowW) / 2;
  const bankX = qrStartX;
  const jazzX = qrStartX + qrSize + qrGap;
  const easyX = qrStartX + (qrSize + qrGap) * 2;

  doc.addImage(bankQr.dataUrl, bankQr.format, bankX, y, qrSize, qrSize);
  doc.addImage(jazzQr.dataUrl, jazzQr.format, jazzX, y, qrSize, qrSize);
  doc.addImage(easyQr.dataUrl, easyQr.format, easyX, y, qrSize, qrSize);

  const labelY = y + qrSize + 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(DARK.r, DARK.g, DARK.b);
  doc.text(`Pay in ${BANK_DETAILS.bankName}`, bankX + qrSize / 2, labelY, {
    align: "center",
  });
  doc.text("Pay in JazzCash", jazzX + qrSize / 2, labelY, {
    align: "center",
  });
  doc.text("Pay in Easypaisa", easyX + qrSize / 2, labelY, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  const detailW = qrSize + qrGap - 2;
  const bankDetail = doc.splitTextToSize(
    BANK_DETAILS.accountTitle,
    detailW,
  ) as string[];
  doc.text(bankDetail, bankX + qrSize / 2, labelY + 3.5, { align: "center" });
  const jazzDetail = doc.splitTextToSize(
    JAZZCASH_ACCOUNT_TITLE,
    detailW,
  ) as string[];
  doc.text(jazzDetail, jazzX + qrSize / 2, labelY + 3.5, { align: "center" });
  const easyDetail = doc.splitTextToSize(
    `${EASYPAISA_ACCOUNT_TITLE}\n${EASYPAISA_NUMBER}`,
    detailW,
  ) as string[];
  doc.text(easyDetail, easyX + qrSize / 2, labelY + 3.5, { align: "center" });
  y =
    labelY +
    3.5 +
    Math.max(bankDetail.length, jazzDetail.length, easyDetail.length) * 3 +
    5;

  if (y + termsBoxH + 16 > pageBottom) {
    doc.addPage();
    y = 14;
  }

  // Terms in a bordered block (after payment — standard retail invoice flow)
  doc.setFillColor(248, 250, 248);
  doc.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, termsBoxH, 1.2, 1.2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
  doc.text("Terms & Conditions", margin + termsPad, y + termsPad + 3.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(70, 70, 70);
  doc.text(termLines, margin + termsPad, y + termsPad + 8);
  y += termsBoxH + 5;

  if (y + 16 > pageBottom) {
    doc.addPage();
    y = 14;
  }

  const thanksH = 8;
  doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
  doc.rect(margin, y, contentWidth, thanksH, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(INVOICE_COPY.thanks, pageWidth / 2, y + 5.2, { align: "center" });
  y += thanksH + 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
  const siteLabel = displayWeb(SITE.url);
  const siteW = doc.getTextWidth(siteLabel);
  doc.textWithLink(siteLabel, pageWidth / 2 - siteW / 2, y, {
    url: SITE.url,
  });

  return doc;
}

/** Build invoice as a File for Web Share / WhatsApp attach flows. */
export async function buildOrderBillPdfFile(
  order: OrderWithItems,
): Promise<File> {
  const doc = await buildOrderBillPdf(order);
  const blob = doc.output("blob");
  return new File([blob], invoiceFileName(order), {
    type: "application/pdf",
  });
}

export async function downloadOrderBillPdf(
  order: OrderWithItems,
): Promise<void> {
  const doc = await buildOrderBillPdf(order);
  doc.save(invoiceFileName(order));
}

export function triggerPdfFileDownload(file: File): void {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
