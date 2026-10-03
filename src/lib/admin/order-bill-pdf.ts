import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { SITE } from "@/constants/site";
import { getPaymentOption } from "@/constants/payment";
import { formatPrice } from "@/utils";
import type { OrderWithItems } from "@/types/db";

const BRAND = { r: 27, g: 107, b: 71 } as const;

function money(amount: number): string {
  return formatPrice(Number(amount));
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch(SITE.logo.src);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read logo"));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Client-facing invoice PDF.
 * Omits admin-only fields (order status, payment status, cost, profit).
 */
export async function downloadOrderBillPdf(
  order: OrderWithItems,
): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  const payment = getPaymentOption(order.payment_method);
  const address = order.shipping_address;
  const created = new Date(order.created_at).toLocaleDateString("en-PK", {
    timeZone: "Asia/Karachi",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const logoData = await loadLogoDataUrl();
  if (logoData) {
    doc.addImage(logoData, "PNG", margin, y, 18, 18);
  }

  const headerLeft = logoData ? margin + 22 : margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
  doc.text(SITE.shortName, headerLeft, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);
  doc.text("Premium Hijama Equipment · Pakistan", headerLeft, y + 11);
  doc.text(`${SITE.phone} · ${SITE.location}`, headerLeft, y + 15.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text("INVOICE", pageWidth - margin, y + 6, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text(order.order_number, pageWidth - margin, y + 12, { align: "right" });
  doc.setTextColor(110, 110, 110);
  doc.text(created, pageWidth - margin, y + 17, { align: "right" });

  y = Math.max(y + 22, 36);

  doc.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  const gap = 6;
  const colW = (contentWidth - gap) / 2;
  const col2X = margin + colW + gap;
  const sectionPadX = 3;
  const rowH = 7;
  const headerH = 7;
  const afterHeaderGap = 6;

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

  /** Label on the left, value on the right — same row height for every field. */
  const writeLabeledRows = (
    x: number,
    startY: number,
    rows: { label: string; value: string }[],
  ) => {
    let cursor = startY;
    const innerW = colW - sectionPadX * 2;
    const valueMaxW = innerW * 0.62;

    for (const row of rows) {
      const valueLines = doc.splitTextToSize(row.value || "—", valueMaxW);
      const blockH = Math.max(rowH, valueLines.length * 4.2 + 2);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(110, 110, 110);
      doc.text(row.label, x + sectionPadX, cursor + 3.8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);
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
  y = Math.max(leftEnd, rightEnd) + 6;

  // Payment method — full width, same left label / right value pattern
  doc.setDrawColor(235, 235, 235);
  doc.setLineWidth(0.2);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text("Payment method", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(payment?.label ?? order.payment_method, pageWidth - margin, y, {
    align: "right",
  });
  y += 8;

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
      fillColor: [248, 250, 248],
    },
    columnStyles: {
      0: { halign: "left" },
      1: { cellWidth: 20, halign: "left" },
      2: { cellWidth: 38, halign: "left" },
      3: { cellWidth: 38, halign: "left" },
    },
    margin: { left: margin, right: margin },
  });

  const tableEnd =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? y + 20;

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
  let totalsY = tableEnd + 8;
  const boxH = summary.length * 7 + 8;

  doc.setFillColor(248, 250, 248);
  doc.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
  doc.setLineWidth(0.3);
  doc.roundedRect(boxX, totalsY, boxW, boxH, 1.5, 1.5, "FD");

  let rowY = totalsY + 6;
  for (const row of summary) {
    doc.setFont("helvetica", row.bold ? "bold" : "normal");
    doc.setFontSize(row.bold ? 11 : 9);
    doc.setTextColor(
      row.bold ? BRAND.r : 45,
      row.bold ? BRAND.g : 45,
      row.bold ? BRAND.b : 45,
    );
    doc.text(row.label, boxX + 4, rowY);
    doc.text(row.value, boxX + 30, rowY);
    rowY += 7;
  }

  totalsY += boxH + 8;

  if (order.notes?.trim()) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
    doc.text("NOTE", margin, totalsY);
    totalsY += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    const noteLines = doc.splitTextToSize(order.notes.trim(), contentWidth);
    doc.text(noteLines, margin, totalsY);
  }

  const footerY = pageHeight - 14;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Thank you for shopping with ${SITE.shortName}.`,
    margin,
    footerY,
  );
  doc.text(SITE.url.replace(/^https?:\/\//, ""), pageWidth - margin, footerY, {
    align: "right",
  });

  doc.save(`${order.order_number}-invoice.pdf`);
}
