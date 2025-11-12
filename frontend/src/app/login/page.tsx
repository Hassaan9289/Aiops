'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockUsers } from "@/lib/auth/mockUsers";
import { useSessionStore } from "@/lib/auth/session";
import { Role } from "@/lib/auth/rbac";
import { toast } from "sonner";
import { BrandMark } from "@/components/layout/BrandMark";

const roleVariant: Record<Role, string> = {
  admin: "text-rose-400",
  operator: "text-indigo-400",
  executive: "text-amber-400",
  observer: "text-emerald-400",
};

export default function LoginPage() {
  const router = useRouter();
  const login = useSessionStore((state) => state.login);
  const user = useSessionStore((state) => state.user);
  const hydrated = useSessionStore((state) => state.hydrated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && user) {
      router.replace("/dashboard");
    }
  }, [hydrated, user, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.message ?? "Unable to sign in");
      toast.error(result.message ?? "Invalid credentials");
      return;
    }
    toast.success("Welcome back");
    router.replace("/dashboard");
  };

  const handlePrefill = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setPassword("Passw0rd!");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <Card className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <BrandMark />
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Royal Cyber AIOps for Enterprise</p>
          <h1 className="text-3xl font-semibold text-[var(--text)]">Sign in</h1>
          <p className="text-sm text-[var(--muted)]">
            Demo-only authentication. No credentials are saved on a server.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="space-y-1 text-sm text-[var(--text)]">
            Email
            <Input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="space-y-1 text-sm text-[var(--text)]">
            Password
            <Input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <details className="rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] p-4 text-sm">
          <summary className="flex cursor-pointer items-center justify-between text-[var(--text)]">
            Quick demo users
            <ChevronDown className="h-4 w-4" />
          </summary>
          <div className="mt-3 space-y-2">
            {mockUsers.map((user) => (
              <button
                type="button"
                key={user.email}
                onClick={() => handlePrefill(user.email)}
                className="flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-2 text-left transition hover:border-[var(--border)]"
              >
                <div>
                  <p className="font-semibold text-[var(--text)]">{user.name}</p>
                  <p className="text-xs text-[var(--muted)]">{user.email}</p>
                </div>
                <span className={`text-xs font-semibold uppercase ${roleVariant[user.role]}`}>
                  {user.role}
                </span>
              </button>
            ))}
            <p className="text-xs text-[var(--muted)]">
              Password for all users: <strong>Passw0rd!</strong> (demo only, not secure)
            </p>
          </div>
        </details>
      </Card>
    </div>
  );
}
