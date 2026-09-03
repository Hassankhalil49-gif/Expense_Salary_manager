import { redirectIfAuthenticated } from "@/lib/auth/session";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return <RegisterForm />;
}
