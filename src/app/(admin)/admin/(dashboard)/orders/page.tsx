import Link from "next/link";
import { Suspense } from "react";
import { Pencil, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/utils";
import { numeric } from "@/lib/classes";
import {
  Button,
  Badge,
  Table,
  THead,
  TBody,
  Tr,
  Th,
  Td,
} from "@/components/ui";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import type { FilterField } from "@/components/admin/AdminFilterBar";
import DeleteOrderButton from "@/components/admin/DeleteOrderButton";
import { computeOrderProfit } from "@/lib/admin/profit";
import {
  karachiDayEndExclusiveIso,
  karachiDayStartIso,
} from "@/lib/admin/dates";
import { ADMIN_PAGE_SIZE, parsePage, parsePerPage } from "@/lib/admin/list-href";
import type { OrderWithItems } from "@/types/db";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function param(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : "";
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = param(sp.q).trim();
  const status = param(sp.status);
  const paymentStatus = param(sp.payment_status);
  const from = param(sp.from);
  const to = param(sp.to);
  const page = parsePage(param(sp.page));
  const perPage = parsePerPage(param(sp.perPage), ADMIN_PAGE_SIZE);

  const filters = {
    q,
    status,
    payment_status: paymentStatus,
    from,
    to,
  };

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_phone, total, status, payment_status, created_at, items:order_items(unit_price, unit_cost, quantity)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (status) query = query.eq("status", status);
  if (paymentStatus) query = query.eq("payment_status", paymentStatus);
  if (from) query = query.gte("created_at", karachiDayStartIso(from));
  if (to) query = query.lt("created_at", karachiDayEndExclusiveIso(to));
  if (q) {
    query = query.or(
      `order_number.ilike.%${q}%,customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%,customer_email.ilike.%${q}%`,
    );
  }

  const { data, count } = await query;
  const orders = (data ?? []) as unknown as OrderWithItems[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const filterFields = [
    {
      name: "q",
      label: "Search",
      placeholder: "Order #, name, phone",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Confirmed" },
        { value: "shipped", label: "Shipped" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
    {
      name: "payment_status",
      label: "Payment",
      type: "select",
      options: [
        { value: "unpaid", label: "Unpaid" },
        { value: "paid", label: "Paid" },
        { value: "refunded", label: "Refunded" },
      ],
    },
    { name: "from", label: "From", type: "date" },
    { name: "to", label: "To", type: "date" },
  ] satisfies FilterField[];

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-body text-xl font-normal text-white sm:text-2xl lg:text-3xl">
            Orders
          </h1>
          <p className="mt-1 text-xs text-white/50 sm:mt-1.5 sm:text-sm">
            Newest orders first. Open an order for full details.
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-2 sm:w-auto">
          <Suspense fallback={null}>
            <AdminFilterBar fields={filterFields} />
          </Suspense>
          <Button
            href="/admin/orders/new"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            className="whitespace-nowrap"
          >
            Create order
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-glass-border bg-glass-bg px-4 py-8 text-center text-sm text-white/60 sm:p-10">
          No orders match these filters.
        </div>
      ) : (
        <Table
          minWidth="min-w-[760px]"
          pagination={{
            page,
            totalPages,
            totalItems: total,
            perPage,
            pathname: "/admin/orders",
            query: filters,
          }}
        >
          <THead>
            <Tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Status</Th>
              <Th align="right">Total</Th>
              <Th align="right">Profit</Th>
              <Th align="right">Actions</Th>
            </Tr>
          </THead>
          <TBody>
            {orders.map((order) => {
              const profit = computeOrderProfit(order.items);
              return (
                <Tr key={order.id}>
                  <Td>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className={`font-medium text-gold hover:text-gold-light ${numeric}`}
                    >
                      {order.order_number}
                    </Link>
                    <p className="text-xs text-white/40">
                      {new Date(order.created_at).toLocaleString("en-PK", {
                        timeZone: "Asia/Karachi",
                      })}
                    </p>
                  </Td>
                  <Td>
                    <p className="text-white/80">{order.customer_name}</p>
                    <p className="text-xs text-white/40">
                      {order.customer_phone}
                    </p>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge tone="neutral">{order.status}</Badge>
                      <Badge
                        tone={
                          order.payment_status === "paid" ? "green" : "neutral"
                        }
                      >
                        {order.payment_status}
                      </Badge>
                    </div>
                  </Td>
                  <Td align="right" className={numeric}>
                    {formatPrice(Number(order.total))}
                  </Td>
                  <Td align="right" className={`text-gold ${numeric}`}>
                    {formatPrice(profit.profit)}
                  </Td>
                  <Td align="right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        href={`/admin/orders/${order.id}/edit`}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 px-0"
                        aria-label={`Edit ${order.order_number}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteOrderButton
                        id={order.id}
                        orderNumber={order.order_number}
                        variant="icon"
                      />
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </TBody>
        </Table>
      )}
    </div>
  );
}
