/**
 * Generate sample invoice PDFs for visual QA.
 * Usage: npx tsx scripts/test-invoice-pdf.ts
 */
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { buildOrderBillPdf } from "../src/lib/admin/order-bill-pdf";
import type { OrderWithItems } from "../src/types/db";

function sampleOrder(overrides: Partial<OrderWithItems> = {}): OrderWithItems {
  return {
    id: "test-order-1",
    order_number: "BAH-20261004-0042",
    user_id: null,
    customer_name: "Bilal Babu",
    customer_phone: "+92 300 1234567",
    customer_email: "bilal@example.com",
    shipping_address: {
      line1: "House 12, Street 4, Gulberg III",
      line2: "Near Liberty Market",
      city: "Lahore",
      province: "Punjab",
      postalCode: "54000",
    },
    payment_method: "jazzcash",
    payment_status: "unpaid",
    status: "confirmed",
    subtotal: 5250,
    shipping_fee: 250,
    total: 5500,
    notes: null,
    created_at: "2026-10-04T10:00:00.000Z",
    updated_at: "2026-10-04T10:00:00.000Z",
    items: [
      {
        id: "i1",
        order_id: "test-order-1",
        product_id: null,
        product_name: "Fire Steel Cup Medium",
        unit_price: 400,
        unit_cost: null,
        quantity: 10,
      },
      {
        id: "i2",
        order_id: "test-order-1",
        product_id: null,
        product_name: "Fire Steel Cup Small",
        unit_price: 350,
        unit_cost: null,
        quantity: 3,
      },
    ],
    ...overrides,
  };
}

async function main() {
  const outDir = join(process.cwd(), "tmp");
  await mkdir(outDir, { recursive: true });

  const cases: { name: string; order: OrderWithItems }[] = [
    { name: "short", order: sampleOrder() },
    {
      name: "long-address-notes",
      order: sampleOrder({
        order_number: "BAH-20261004-VERYLONG-ORDER-NUM-9999",
        customer_name: "Muhammad Abdul Rahman Al-Hashimi",
        shipping_address: {
          line1:
            "Plot 45-B, Block C, Commercial Area, DHA Phase 5 Extension",
          line2: "Opposite park, near main boulevard gate 3",
          city: "Lahore",
          province: "Punjab",
          postalCode: "54792",
        },
        notes: "Please call before delivery. Leave with guard if unavailable.",
        items: [
          ...sampleOrder().items,
          {
            id: "i3",
            order_id: "test-order-1",
            product_id: null,
            product_name: "Electronic Hijama Pump (Rechargeable)",
            unit_price: 3500,
            unit_cost: null,
            quantity: 1,
          },
          {
            id: "i4",
            order_id: "test-order-1",
            product_id: null,
            product_name: "Silicone Massage Cup Set (4pcs)",
            unit_price: 1350,
            unit_cost: null,
            quantity: 2,
          },
        ],
        subtotal: 11450,
        shipping_fee: 0,
        total: 11450,
      }),
    },
  ];

  for (const c of cases) {
    const doc = await buildOrderBillPdf(c.order);
    const path = join(outDir, `invoice-${c.name}.pdf`);
    await writeFile(path, Buffer.from(doc.output("arraybuffer")));
    console.log(`Wrote ${path} (${doc.getNumberOfPages()} page(s))`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
