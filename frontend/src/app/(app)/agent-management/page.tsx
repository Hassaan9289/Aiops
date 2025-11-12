'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";

const agents = [
  { name: "Agent Delta", zone: "US-East", version: "v4.3.1", status: "healthy" },
  { name: "Agent Echo", zone: "AP-South", version: "v4.2.0", status: "warning" },
  { name: "Agent Foxtrot", zone: "EU-Central", version: "v4.3.1", status: "healthy" },
];

const agentStatusVariant: Record<string, "success" | "warning"> = {
  healthy: "success",
  warning: "warning",
};

export default function AgentManagementPage() {
  return (
    <AuthGate>
      <RequireRole roles={["admin", "operator"]}>
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-title">Agent management</p>
              <p className="text-sm text-white/60">Lifecycle, versioning, and health of deployed agents.</p>
            </div>
            <Button variant="outline" className="px-4 py-2 text-sm">
              Deploy new agent
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                  <Badge variant={agentStatusVariant[agent.status]} className="capitalize">
                    {agent.status}
                  </Badge>
                </div>
                <p className="text-sm text-white/60">Zone: {agent.zone}</p>
                <p className="text-sm text-white/60">Version: {agent.version}</p>
              </Card>
            ))}
          </div>
        </section>
      </RequireRole>
    </AuthGate>
  );
}
