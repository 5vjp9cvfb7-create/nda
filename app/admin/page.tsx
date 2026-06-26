import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AuthGuard } from "@/components/admin/auth-guard";

export const metadata = {
  title: "Admin Dashboard"
};

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminDashboard />
    </AuthGuard>
  );
}
