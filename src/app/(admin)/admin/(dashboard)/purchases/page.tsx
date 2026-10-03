import Link from "next/link";
import { Suspense } from "react";
import {
  Plus,
  Truck,
  FileText,
  CheckCircle2,
  Wallet,
} from "lucide-react";
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
  StatCard,
  StatGrid,
} from "@/components/ui";
import AdminFilterBar from "@/components/admin/AdminFilterBar";
import {
  karachiDayEndExclusiveIso,
  karachiDayStartIso,
} from "@/lib/admin/dates";
import { ADMIN_PAGE_SIZE, parsePage, parsePerPage } from "@/lib/admin/list-href";
import type { Purchase } from "@/types/db";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function param(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : "";
}

export default async function AdminPurchasesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = param(sp.q).trim();
  const status = param(sp.status);
  const from = param(sp.from);
  const to = param(sp.to);
  const page = parsePage(param(sp.page));
  const perPage = parsePerPage(param(sp.perPage), ADMIN_PAGE_SIZE);
  const filters = { q, status, from, to };

  const supabase = await createClient();

  const [
    { count: allCount },
    { count: draftCount },
    { count: confirmedCount },
    { data: confirmedSpendRows },
    listResult,
  ] = await Promise.all([
    supabase.from("purchases").select("id", { count: "exact", head: true }),
    supabase
      .from("purchases")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase
      .from("purchases")
      .select("id", { count: "exact", head: true })
      .eq("status", "confirmed"),
    supabase.from("purchases").select("subtotal").eq("status", "confirmed"),
    (async () => {
      let query = supabase
        .from("purchases")
        .select(
          "id, purchase_number, supplier_name, supplier_phone, status, subtotal, purchased_at, created_at",
          { count: "exact" },
        )
        .order("purchased_at", { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1);

      if (status) query = query.eq("status", status);
      if (from) query = query.gte("purchased_at", karachiDayStartIso(from));
      if (to) query = query.lt("purchased_at", karachiDayEndExclusiveIso(to));
      if (q) {
        query = query.or(
          `purchase_number.ilike.%${q}%,supplier_name.ilike.%${q}%,supplier_phone.ilike.%${q}%`,
        );
      }
      return query;
    })(),
  ]);

  const purchases = (listResult.data ?? []) as Purchase[];
  const total = listResult.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const confirmedSpend = (confirmedSpendRows ?? []).reduce(
    (sum, row) => sum + Number(row.subtotal),
    0,
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-body text-xl font-normal text-white sm:text-2xl lg:text-3xl">
            Purchases
          </h1>
          <p className="mt-1 text-xs text-white/50 sm:text-sm">
            Supplier bills and stock-in records.
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-2 sm:w-auto">
          <Suspense fallback={null}>
            <AdminFilterBar
              fields={[
                {
                  name: "q",
                  label: "Search",
                  placeholder: "Purchase #, supplier",
                },
                {
                  name: "status",
                  label: "Status",
                  type: "select",
                  options: [
                    { value: "draft", label: "Draft" },
                    { value: "confirmed", label: "Confirmed" },
                    { value: "cancelled", label: "Cancelled" },
                  ],
                },
                { name: "from", label: "From", type: "date" },
                { name: "to", label: "To", type: "date" },
              ]}
            />
          </Suspense>
          <Button
            href="/admin/purchases/new"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            className="whitespace-nowrap"
          >
            New purchase
          </Button>
        </div>
      </div>

      <StatGrid>
        <StatCard
          label="All purchases"
          value={String(allCount ?? 0)}
          icon={Truck}
        />
        <StatCard
          label="Draft"
          value={String(draftCount ?? 0)}
          icon={FileText}
        />
        <StatCard
          label="Confirmed"
          value={String(confirmedCount ?? 0)}
          icon={CheckCircle2}
        />
        <StatCard
          label="Confirmed spend"
          value={formatPrice(confirmedSpend)}
          icon={Wallet}
        />
      </StatGrid>

      {purchases.length === 0 ? (
        <div className="rounded-lg border border-glass-border bg-glass-bg px-4 py-8 text-center text-sm text-white/60 sm:p-10">
          No purchases match these filters.
        </div>
      ) : (
        <Table
          minWidth="min-w-[640px]"
          pagination={{
            page,
            totalPages,
            totalItems: total,
            perPage,
            pathname: "/admin/purchases",
            query: filters,
          }}
        >
          <THead>
            <Tr>
              <Th>Purchase</Th>
              <Th>Supplier</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th align="right">Total</Th>
            </Tr>
          </THead>
          <TBody>
            {purchases.map((purchase) => (
              <Tr key={purchase.id}>
                <Td>
                  <Link
                    href={`/admin/purchases/${purchase.id}`}
                    className={`font-medium text-gold hover:text-gold-light ${numeric}`}
                  >
                    {purchase.purchase_number}
                  </Link>
                </Td>
                <Td>
                  <p className="text-white/80">{purchase.supplier_name}</p>
                  {purchase.supplier_phone && (
                    <p className="text-xs text-white/40">
                      {purchase.supplier_phone}
                    </p>
                  )}
                </Td>
                <Td className="text-white/50">
                  {new Date(purchase.purchased_at).toLocaleDateString("en-PK")}
                </Td>
                <Td>
                  <Badge
                    tone={
                      purchase.status === "confirmed"
                        ? "green"
                        : purchase.status === "cancelled"
                          ? "red"
                          : "neutral"
                    }
                  >
                    {purchase.status}
                  </Badge>
                </Td>
                <Td align="right" className={numeric}>
                  {formatPrice(Number(purchase.subtotal))}
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
