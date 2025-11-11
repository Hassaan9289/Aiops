'use client';

import { useState } from "react";
import { z } from "zod";
import { useAIOpsStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";

const incidentSchema = z.object({
  serviceId: z.string(),
  title: z.string(),
  severity: z.union([
    z.literal("critical"),
    z.literal("high"),
    z.literal("medium"),
    z.literal("low"),
  ]),
});

const syncs = [
  { id: "metrics", label: "Metrics ingest", status: "green", last: "1m ago" },
  { id: "events", label: "Event bus", status: "green", last: "Live" },
  { id: "tickets", label: "ServiceNow sync", status: "amber", last: "9m ago" },
];

export default function AdminPage() {
  const injectAnomaly = useAIOpsStore((state) => state.injectAnomaly);
  const addIncident = useAIOpsStore((state) => state.addIncident);
  const services = useAIOpsStore((state) => state.services);
  const incidents = useAIOpsStore((state) => state.incidents);
  const [message, setMessage] = useState<string | null>(null);

  const handleInjectAnomaly = () => {
    injectAnomaly({
      serviceId: "svc-payments",
      metric: "Queue depth",
      value: 320,
      baseline: 80,
      severity: "high",
      confidence: 0.78,
      why: "Manual injection from admin panel.",
    });
    setMessage("Synthetic anomaly injected for Payments.");
  };

  const handleInjectIncident = () => {
    const payload = incidentSchema.parse({
      serviceId: services[0]?.id ?? "svc-payments",
      title: "Demo incident from Admin panel",
      severity: "medium",
    });
    addIncident({
      id: `DEMO-${incidents.length + 1}`,
      serviceId: payload.serviceId,
      title: payload.title,
      severity: payload.severity,
      detectedAt: new Date().toISOString(),
      status: "open",
      rootCause: "Synthetic",
      confidence: 0.4,
      impactedUsers: 120,
    });
    setMessage("Demo incident added to queue.");
  };

  return (
    <AuthGate>
      <RequireRole roles={["admin"]}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-4">
            <p className="section-title">Demo controls</p>
            <div className="flex gap-3">
              <Button onClick={handleInjectAnomaly}>Inject anomaly</Button>
              <Button variant="muted" onClick={handleInjectIncident}>
                Inject incident
              </Button>
            </div>
            {message && <p className="text-sm text-emerald-300">{message}</p>}
          </Card>
          <Card>
            <p className="section-title mb-4">Data sync health</p>
            <div className="space-y-3 text-sm">
              {syncs.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3">
                  <div>
                    <p className="font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-white/60">Last update {item.last}</p>
                  </div>
                  <span
                    className={`h-3 w-3 rounded-full ${
                      item.status === "green"
                        ? "bg-emerald-400"
                        : item.status === "amber"
                          ? "bg-amber-400"
                          : "bg-rose-400"
                    }`}
                  />
                </div>
              ))}
            </div>
          </Card>
          <Card className="lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="section-title">Model confidence</p>
                <p className="text-white/70">
                  RCA model monitoring: Monitor → Analyze → Automate → Optimize
                </p>
              </div>
              <span className="text-sm text-white/60">
                Last recalibrated {formatDate(new Date().toISOString())}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-6">
              {[
                { label: "Monitor", value: 0.92 },
                { label: "Analyze", value: 0.88 },
                { label: "Automate", value: 0.81 },
                { label: "Optimize", value: 0.76 },
              ].map((phase) => (
                <div key={phase.label} className="flex flex-col items-center text-sm">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-indigo-500/40 bg-white/5 text-2xl font-semibold text-white">
                    {(phase.value * 100).toFixed(0)}%
                  </div>
                  <p className="mt-2 text-white/70">{phase.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </RequireRole>
    </AuthGate>
  );
}
