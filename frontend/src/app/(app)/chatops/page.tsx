'use client';

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";

const channels = [
  { name: "Incident Response", owner: "AI Ops Bot", status: "Active", updates: "24 updates in last 6h" },
  { name: "Automation Desk", owner: "Ops Team", status: "Idle", updates: "No new messages" },
  { name: "Security Insights", owner: "SecOps", status: "Alerting", updates: "2 critical alerts" },
];

const statusVariant: Record<string, "success" | "default" | "warning" | "danger"> = {
  Active: "success",
  Idle: "default",
  Alerting: "warning",
};

export default function ChatOpsPage() {
  const onlineChannels = useMemo(() => channels.filter((channel) => channel.status !== "Idle"), []);

  return (
    <AuthGate>
      <RequireRole roles={["admin", "operator"]}>
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="section-title">ChatOps</p>
              <p className="text-sm text-white/60">Orchestrate conversations, tickets, and playbooks with automation.</p>
            </div>
            <Button variant="default" className="px-4 py-2 text-sm">
              Start new chat
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {channels.map((channel) => (
              <Card key={channel.name} className="space-y-3 border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{channel.name}</h3>
                  <Badge variant={statusVariant[channel.status]}>{channel.status}</Badge>
                </div>
                <p className="text-sm text-white/50">Owner: {channel.owner}</p>
                <p className="text-sm text-white/60">{channel.updates}</p>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm">
                    Open chat
                  </Button>
                  <p className="text-xs text-white/50">Last synced 3m ago</p>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-xs text-white/50">
            {onlineChannels.length} channels currently active.
          </p>
        </section>
      </RequireRole>
    </AuthGate>
  );
}
