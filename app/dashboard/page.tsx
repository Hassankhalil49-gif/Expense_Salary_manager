import { DashboardView } from "@/components/dashboard/dashboard-view";
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data";
import { requireAuth } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await requireAuth();
  const data = await getDashboardData(user.id);

  return (
    <DashboardView
      user={{
        name: user.name ?? "User",
        email: user.email ?? "",
        image: user.image,
      }}
      data={data}
    />
  );
}
