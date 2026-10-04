"use client";

import { useState } from "react";
import { FileDown, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import {
  buildOrderBillPdfFile,
  downloadOrderBillPdf,
  triggerPdfFileDownload,
} from "@/lib/admin/order-bill-pdf";
import {
  buildWhatsAppBillMessage,
  whatsappBillUrl,
} from "@/lib/admin/whatsapp-bill";
import type { OrderWithItems } from "@/types/db";

interface WhatsAppBillButtonProps {
  order: OrderWithItems;
  fullWidth?: boolean;
}

function canSharePdfFile(file: File): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  );
}

export default function WhatsAppBillButton({
  order,
  fullWidth,
}: WhatsAppBillButtonProps) {
  const [pdfBusy, setPdfBusy] = useState(false);
  const [waBusy, setWaBusy] = useState(false);
  const waUrl = whatsappBillUrl(order);

  const onDownloadPdf = async () => {
    setPdfBusy(true);
    try {
      await downloadOrderBillPdf(order);
      toast.success("PDF invoice downloaded");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create PDF",
      );
    } finally {
      setPdfBusy(false);
    }
  };

  const onSendWhatsApp = async () => {
    if (!waUrl) return;
    setWaBusy(true);
    try {
      const file = await buildOrderBillPdfFile(order);
      const text = buildWhatsAppBillMessage(order);

      // Mobile (and some desktop browsers): native share sheet can send PDF + text to WhatsApp.
      // wa.me links cannot attach files — that is a WhatsApp Web/API limit.
      if (canSharePdfFile(file) && typeof navigator.share === "function") {
        try {
          await navigator.share({
            files: [file],
            title: `Invoice ${order.order_number}`,
            text,
          });
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
          // Fall through to download + chat link.
        }
      }

      triggerPdfFileDownload(file);
      window.open(waUrl, "_blank", "noopener,noreferrer");
      toast.message("PDF downloaded", {
        description:
          "Attach the invoice in WhatsApp (paperclip / +). The chat text is ready.",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not open WhatsApp",
      );
    } finally {
      setWaBusy(false);
    }
  };

  return (
    <div
      className={
        fullWidth ? "flex w-full flex-col gap-2" : "flex flex-wrap gap-2"
      }
    >
      <Button
        type="button"
        variant="subtle"
        fullWidth={fullWidth}
        leftIcon={<FileDown className="h-4 w-4" />}
        onClick={onDownloadPdf}
        loading={pdfBusy}
        disabled={pdfBusy || waBusy}
      >
        Download PDF bill
      </Button>
      {waUrl ? (
        <Button
          type="button"
          variant="primary"
          fullWidth={fullWidth}
          leftIcon={<MessageCircle className="h-4 w-4" />}
          onClick={onSendWhatsApp}
          loading={waBusy}
          disabled={waBusy || pdfBusy}
        >
          Send on WhatsApp
        </Button>
      ) : (
        <p className="rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Add a valid customer phone to open WhatsApp.
        </p>
      )}
    </div>
  );
}
