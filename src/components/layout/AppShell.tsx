'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Cloud,
  CloudSun,
  LayoutDashboard,
  LucideIcon,
  MessageCircle,
  PlugZap,
  Server,
  ServerCog,
  UserCircle2,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useSessionStore } from "@/lib/auth/session";
import { Role } from "@/lib/auth/rbac";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Can } from "@/components/auth/Can";
import { BrandMark } from "@/components/layout/BrandMark";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
};

const nav: { label: string; items: NavItem[] }[] = [
  {
    label: "Core",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["admin", "operator", "executive", "observer"],
      },
      {
        label: "Enterprise systems",
        href: "/enterprise-systems",
        icon: Server,
        roles: ["admin", "operator", "executive", "observer"],
      },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Hybrids", href: "/hybrids", icon: CloudSun, roles: ["admin", "operator", "executive"] },
      { label: "Clouds", href: "/clouds", icon: Cloud, roles: ["admin", "operator", "executive"] },
      { label: "Agent management", href: "/agent-management", icon: UserCog, roles: ["admin", "operator"] },
      { label: "MCP Servers", href: "/mcp", icon: ServerCog, roles: ["admin", "operator"] },
      { label: "ChatOps", href: "/chatops", icon: MessageCircle, roles: ["admin", "operator"] },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Integrations", href: "/integrations", icon: PlugZap, roles: ["admin", "operator"] },
      { label: "User management", href: "/user-management", icon: UserCircle2, roles: ["admin", "operator"] },
    ],
  },
];

const breadcrumbsLabel: Record<string, string> = Object.fromEntries(
  nav.flatMap((group) => group.items.map((item) => [item.href, item.label])),
);

const roleBadgeVariant: Record<Role, "destructive" | "default" | "warning" | "outline"> = {
  admin: "destructive",
  operator: "default",
  executive: "warning",
  observer: "outline",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const logout = useSessionStore((state) => state.logout);
  const role = user?.role;
  const activeLabel = breadcrumbsLabel[pathname] ?? "Overview";

  const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, idx, arr) => ({
      href: "/" + arr.slice(0, idx + 1).join("/"),
      label: breadcrumbsLabel["/" + arr.slice(0, idx + 1).join("/")] ??
        segment.charAt(0).toUpperCase() + segment.slice(1),
    }));

  const filteredNav = nav
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !role || item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);

  const handleSignOut = () => {
    logout();
    toast.success("Signed out");
    router.replace("/login");
  };

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--text)]">
      <aside className="hidden w-64 flex-shrink-0 border-r border-[var(--border)] bg-[var(--surface)] px-6 py-6 lg:flex lg:flex-col">
        <Link href="/dashboard" className="block">
          <BrandMark />
        </Link>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Royal Cyber AIOps for Enterprise 
        </p>
        <nav className="mt-8 flex-1 space-y-6 text-sm">
          {filteredNav.map((group) => (
            <div key={group.label}>
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
                {group.label}
              </p>
              <div className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-none px-3 py-2 text-[var(--muted)] transition",
                        isActive && "bg-[var(--card-muted)] text-[var(--text)]",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="rounded-none border border-[var(--border)] bg-[var(--card-muted)] p-4 text-xs text-[var(--muted)]">
          <p className="font-semibold text-[var(--text)]">Proactive posture</p>
          <p className="mt-1">AI Agents watching 214 services continuously.</p>
          <Button variant="muted" className="mt-3 w-full">
            View runbooks
          </Button>
        </div>
      </aside>
      <main className="flex-1 bg-[var(--surface)] px-4 py-6 text-[var(--text)] sm:px-6 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
              {crumbs.map((crumb, idx) => (
                <span key={crumb.href}>
                  {crumb.label}
                  {idx < crumbs.length - 1 && " / "}
                </span>
              ))}
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-[var(--text)]">{activeLabel}</h1>
          </div>
          <div className="hidden flex-1 text-center text-sm text-[var(--muted)] md:block">
            Hi {firstName}, keeping services resilient today.
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right text-sm">
              <Link href="/account" className="font-semibold text-[var(--text)] transition hover:text-[var(--accent)]">
                {user?.email ?? "Unknown user"}
              </Link>
              {role && (
                <div className="mt-1 flex justify-end">
                  <Badge className="capitalize">
                    {role}
                  </Badge>
                </div>
              )}
            </div>
            <ThemeToggle />
            <Button variant="muted" onClick={handleSignOut}>
              Sign out
            </Button>
            <Can
              permission="run:automation"
              fallback={
                <Button variant="muted" disabled title="Requires Operator or Admin">
                  Create automation
                </Button>
              }
            >
              <Button variant="default">Create automation</Button>
            </Can>
          </div>
        </header>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
