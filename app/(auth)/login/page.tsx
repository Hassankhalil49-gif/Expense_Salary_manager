import { redirectIfAuthenticated } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return <LoginForm />;
}
