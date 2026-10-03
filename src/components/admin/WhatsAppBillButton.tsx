"use client";

import { useState } from "react";
import { FileDown, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { downloadOrderBillPdf } from "@/lib/admin/order-bill-pdf";
import { whatsappBillUrl } from "@/lib/admin/whatsapp-bill";
import type { OrderWithItems } from "@/types/db";

interface WhatsAppBillButtonProps {
  order: OrderWithItems;
  fullWidth?: boolean;
}

export default function WhatsAppBillButton({
  order,
  fullWidth,
}: WhatsAppBillButtonProps) {
  const [pdfBusy, setPdfBusy] = useState(false);
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
        disabled={pdfBusy}
      >
        Download PDF bill
      </Button>
      {waUrl ? (
        <Button
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          fullWidth={fullWidth}
          leftIcon={<MessageCircle className="h-4 w-4" />}
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
