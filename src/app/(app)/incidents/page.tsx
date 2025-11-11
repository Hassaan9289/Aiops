'use client';

import { useState } from "react";
import { Incident } from "@/lib/types";
import { useAIOpsStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IncidentTable } from "@/components/incidents/IncidentTable";
import { IncidentDrawer } from "@/components/incidents/IncidentDrawer";
import { TopologyCanvas } from "@/components/topology/TopologyCanvas";
import { formatDate } from "@/lib/format";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";

export default function IncidentsPage() {
  const incidents = useAIOpsStore((state) => state.incidents);
  const anomalies = useAIOpsStore((state) => state.anomalies);
  const timeline = useAIOpsStore((state) => state.timeline);
  const changeRisks = useAIOpsStore((state) => state.changeRisks);
  const topologyNodes = useAIOpsStore((state) => state.topologyNodes);
  const topologyEdges = useAIOpsStore((state) => state.topologyEdges);

  const [drawerIncident, setDrawerIncident] = useState<Incident | undefined>();
  const selectedId = drawerIncident?.id;

  return (
    <AuthGate>
      <RequireRole roles={["admin", "operator", "observer"]}>
        <div className="space-y-6">
          <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-title">Incident queue</p>
                  <p className="text-white/70">
                    Proactive monitoring → RCA → Automated remediation → Outcomes
                  </p>
                </div>
                <Button variant="muted">New incident</Button>
              </div>
              <div className="mt-4">
                <IncidentTable
                  incidents={incidents}
                  activeId={selectedId}
                  onSelect={(incident) => setDrawerIncident(incident)}
                />
              </div>
            </Card>
            <div className="space-y-6">
              <Card>
                <p className="section-title mb-3">Topology preview</p>
                <TopologyCanvas
                  nodes={topologyNodes}
                  edges={topologyEdges}
                  selectedId={drawerIncident?.serviceId}
                  height={260}
                />
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <p className="section-title">Change risk</p>
                  <span className="text-xs text-white/50">Recent deployments</span>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  {changeRisks.map((change) => (
                    <div
                      key={change.id}
                      className="rounded-2xl border border-white/5 bg-white/5 p-3"
                    >
                      <div className="flex items-center justify-between text-white">
                        <p className="font-semibold">{change.id}</p>
                        <span>{Math.round(change.riskScore * 100)}% risk</span>
                      </div>
                      <p className="text-white/70">{change.notes}</p>
                      <p className="text-xs text-white/50">
                        {change.owner} · {formatDate(change.deployedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>
          <IncidentDrawer
            incident={drawerIncident}
            anomalies={anomalies}
            events={timeline}
            onClose={() => setDrawerIncident(undefined)}
          />
        </div>
      </RequireRole>
    </AuthGate>
  );
}
