import Link from "next/link";
import { Wallet } from "lucide-react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-12">
      <div className="mb-8 flex flex-col items-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold tracking-tight">
            Salary & Expense Manager
          </span>
        </Link>
        <p className="text-sm text-muted-foreground">
          Manage your finances with confidence
        </p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
