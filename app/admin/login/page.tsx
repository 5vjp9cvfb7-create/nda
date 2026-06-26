import { Suspense } from "react";
import { AdminLogin } from "@/components/admin/admin-login";

export const metadata = {
  title: "Admin Login"
};

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLogin />
    </Suspense>
  );
}
