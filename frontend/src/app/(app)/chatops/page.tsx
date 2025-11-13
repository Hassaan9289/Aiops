'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";

const teamsChannel = {
  name: "Microsoft Teams",
  owner: "AI Ops Connector",
  status: "Active",
  updates: "Connect directly through Microsoft Teams for collaboration.",
  lastSynced: "Last synced 3m ago",
};

const statusVariant: Record<string, "success" | "default" | "warning" | "danger"> = {
  Active: "success",
};

export default function ChatOpsPage() {
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
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="space-y-3 border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{teamsChannel.name}</h3>
                <Badge variant={statusVariant[teamsChannel.status]}>{teamsChannel.status}</Badge>
              </div>
              <p className="text-sm text-white/50">Owner: {teamsChannel.owner}</p>
              <p className="text-sm text-white/60">{teamsChannel.updates}</p>
              <div className="flex items-center justify-between">
                <Button asChild variant="ghost" size="sm">
                  <a
                    href="https://teams.microsoft.com/l/app/f6405520-7907-4464-8f6e-9889e2fb7d8f"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open chat
                  </a>
                </Button>
                <p className="text-xs text-white/50">{teamsChannel.lastSynced}</p>
              </div>
            </Card>
            <Card className="space-y-3 border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Custom Web</h3>
                <Badge variant="default">Available</Badge>
              </div>
              <p className="text-sm text-white/50">Owner: AI Ops Webhook</p>
              <p className="text-sm text-white/60">
                Launch the public Custom Web experience for tailored collaboration.
              </p>
              <div className="flex items-center justify-between">
                <Button asChild variant="ghost" size="sm">
                  <a href="/customweb.html" target="_blank" rel="noreferrer">
                    Open chat
                  </a>
                </Button>
                <p className="text-xs text-white/50">Last synced 3m ago</p>
              </div>
            </Card>
          </div>
          <p className="text-xs text-white/50">
            Microsoft Teams is available for collaboration.
          </p>
        </section>
      </RequireRole>
    </AuthGate>
  );
}
