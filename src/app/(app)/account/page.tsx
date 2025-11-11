'use client';

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";
import { Role } from "@/lib/auth/rbac";
import { useSessionStore } from "@/lib/auth/session";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const badgeVariant: Record<Role, "destructive" | "default" | "warning" | "outline"> = {
  admin: "destructive",
  operator: "default",
  executive: "warning",
  observer: "outline",
};

export default function AccountPage() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const logout = useSessionStore((state) => state.logout);

  if (!user) return null;

  const handleSignOut = () => {
    logout();
    toast.success("Signed out");
    router.replace("/login");
  };

  return (
    <AuthGate>
      <RequireRole roles={["admin", "operator", "executive", "observer"]}>
        <div className="space-y-6">
          <Card className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-[var(--muted)]">Signed in as</p>
              <h2 className="mt-1 text-3xl font-semibold text-[var(--text)]">{user.name}</h2>
              <p className="text-sm text-[var(--muted)]">{user.email}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                Last login {user.lastLogin ? formatDate(user.lastLogin) : "just now"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <Badge variant={badgeVariant[user.role]} className="capitalize">
                {user.role}
              </Badge>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="muted" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </RequireRole>
    </AuthGate>
  );
}
