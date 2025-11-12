'use client';

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";

const users = [
  { name: "John Doe", role: "Admin", status: "Active", lastLogin: "2 hours ago" },
  { name: "Jane Smith", role: "Operator", status: "Active", lastLogin: "5 days ago" },
  { name: "Alice Johnson", role: "Observer", status: "Inactive", lastLogin: "1 month ago" },
  { name: "Bob Brown", role: "Operator", status: "Active", lastLogin: "Just now" },
];

const statusVariant = {
  Active: "success",
  Inactive: "outline",
};

const roleFilterOptions = ["All", "Admin", "Operator", "Observer"];

export default function UserManagementPage() {
  const activeUsers = useMemo(() => users.filter((user) => user.status === "Active"), []);

  return (
    <AuthGate>
      <RequireRole roles={["admin"]}>
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="section-title">User Management</p>
                <p className="text-sm text-white/60">All Users</p>
              </div>
              <div className="flex gap-3">
                {["All Users", "Add User", "Audit Logs"].map((tab) => (
                  <button
                    key={tab}
                    className={`rounded-full px-4 py-1 text-sm font-semibold ${
                      tab === "All Users" ? "bg-[var(--card)] text-[var(--text)]" : "text-white/60"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                {roleFilterOptions.map((role) => (
                  <option key={role} value={role.toLowerCase()}>
                    {role}
                  </option>
                ))}
              </select>
              <input
                type="search"
                placeholder="Search..."
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none focus:border-[var(--accent)]"
              />
              <Button variant="default" className="text-sm px-4 py-2">
                New User
              </Button>
            </div>
          </div>

          <Card className="rounded-none border border-white/10 bg-white/5 p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/5 text-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.name} className="border-t border-white/10 transition hover:bg-white/5">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-white">{user.name}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-white/60">{user.role}</td>
                      <td className="px-4 py-4">
                        <Badge variant={statusVariant[user.status] ?? "default"} className="rounded-full px-3">
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-white/60">{user.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <p className="text-xs text-white/50">
            Showing {activeUsers.length} active {activeUsers.length === 1 ? "user" : "users"}.
          </p>
        </section>
      </RequireRole>
    </AuthGate>
  );
}
