'use client';

import { BrandMark } from "@/components/layout/BrandMark";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { mockUsers } from "@/lib/auth/mockUsers";
import { Role } from "@/lib/auth/rbac";
import { useSessionStore } from "@/lib/auth/session";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="flex flex-1 flex-col gap-8 px-6 py-10 sm:px-8 lg:w-1/2 lg:px-12 lg:py-16">
        <div className="space-y-2">
          <BrandMark />
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Royal Cyber AIOps for Enterprise
          </p>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight">Log in to Royal Cyber</h1>
        </div>
        <Card className="max-w-2xl space-y-6 border border-[var(--border)] bg-[var(--surface)]/90 p-8 shadow-[0_25px_50px_rgba(15,23,42,0.12)] backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-sm">
              <label className="block font-semibold text-[var(--text)]">Email</label>
              <Input
                type="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2 text-sm">
              <label className="block font-semibold text-[var(--text)]">Password</label>
              <Input
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-[var(--muted)]">
                <Checkbox className="h-4 w-4 rounded-sm" />
                Remember this device
              </label>
              <Link href="/help/login" className="text-[#2563eb] transition hover:text-[#1d4ed8]">
                Forgot password?
              </Link>
            </div>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <Button type="submit" className="flex items-center justify-between gap-2 text-base font-semibold">
              <span>{loading ? "Continuing..." : "Continue"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Card>
        <details className="max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] p-4 text-sm">
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
      </div>
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-b from-[#fefefe] via-[#f2f5ff] to-[#e0e7ff] px-6 py-8 sm:px-8 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.3),transparent_45%),radial-gradient(circle_at_80%_5%,rgba(79,70,229,0.15),transparent_50%),radial-gradient(circle_at_50%_80%,rgba(56,189,248,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-[repeating-radial-gradient(circle,rgba(15,23,42,0.08)_0_1px,transparent_1px_6px)] opacity-60" />
        <div className="relative z-10 h-full w-full">
          <div className="absolute left-10 top-16 h-20 w-20 rounded-2xl border border-[#cbd5f5] bg-gradient-to-br from-[#f8fafc] to-transparent blur-sm" />
          <div className="absolute right-16 top-32 h-32 w-32 rounded-full border border-[#dbeafe] bg-[#e0e7ff]/70 blur-sm" />
          <div className="absolute left-24 bottom-14 h-40 w-1 rounded-full bg-gradient-to-b from-[#6366f1] to-transparent" />
          <div className="absolute right-28 bottom-10 h-32 w-1 rounded-full bg-gradient-to-b from-[#a855f7] to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cbd5f5]" />
          <div className="relative flex h-full flex-col items-center justify-center gap-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#6366f1]/80">ROYAL CYBER AIOPS</p>
            <h2 className="text-3xl font-semibold text-[var(--text)]">Actionable intelligence for every service</h2>
            <p className="max-w-xs text-sm text-[var(--muted)]">
              Continuous monitoring, anomaly detection, and automation prompts keep your estate resilient
              without the noise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
