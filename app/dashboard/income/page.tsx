import { IncomePageClient } from "@/components/income/income-page-client";
import { getIncomePageData } from "@/lib/income/get-income-page-data";
import { requireAuth } from "@/lib/auth/session";

export default async function IncomePage() {
  const user = await requireAuth();
  const data = await getIncomePageData(user.id);

  return <IncomePageClient data={data} />;
}
