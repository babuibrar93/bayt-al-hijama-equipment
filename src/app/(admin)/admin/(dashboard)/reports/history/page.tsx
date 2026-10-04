import { redirect } from "next/navigation";
import { currentKarachiYearMonth } from "@/lib/admin/dates";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MonthlyHistoryRedirectPage({
  searchParams,
}: PageProps) {
  const sp = await searchParams;
  const { year: defaultYear } = currentKarachiYearMonth();
  const year =
    typeof sp.year === "string" && Number(sp.year)
      ? Number(sp.year)
      : defaultYear;
  redirect(`/admin/reports?year=${year}`);
}
