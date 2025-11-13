'use client';

import { Activity, Bot } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAIOpsStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/KpiCard";
import { HealthPill } from "@/components/ui/HealthPill";
import { MiniList } from "@/components/ui/MiniList";
import { AiInsightCard } from "@/components/insights/AiInsightCard";
import ClosedIncidentDrawer from "@/components/incidents/ClosedIncidentDrawer";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";

type BackendIncident = {
  sys_id?: string;
  number?: string;
  short_description?: string;
  closed_at?: string | null;
  close_notes?: string;
  notify?: string;
  category?: string;
  u_ai_category?: string;
  [key: string]: any;
};

type BackendResponse = {
  totalIncidents: number;
  activeCount: number;
  incidentTypes: { type: string; count: number }[];
  incidents: BackendIncident[];
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center gap-1" role="status" aria-label="Loading">
    {[0, 1, 2].map((index) => (
      <span
        key={index}
        className="h-2.5 w-2.5 rounded-full bg-emerald-200 opacity-80 animate-pulse"
        style={{ animationDelay: `${index * 0.15}s` }}
      />
    ))}
  </div>
);

export default function DashboardPage() {
  const services = useAIOpsStore((state) => state.services);
  const anomalies = useAIOpsStore((state) => state.anomalies);
  const incidents = useAIOpsStore((state) => state.incidents);
  const aiInsights = useAIOpsStore((state) => state.insights);
  const runbooks = useAIOpsStore((state) => state.runbooks);

  const [backendData, setBackendData] = useState<BackendResponse | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [backendLoading, setBackendLoading] = useState(false);
  const [selectedClosedIncident, setSelectedClosedIncident] = useState<BackendIncident | null>(null);

  const topAnomalies = useMemo(() => anomalies.slice(0, 4), [anomalies]);

  const metrics = useMemo(() => {
    const openIncidents = incidents.filter((incident) => incident.status !== "resolved").length;
    const automationRate = Math.round(
      (runbooks.filter((runbook) => runbook.trigger === "auto").length / runbooks.length) * 100,
    );
    return {
      incidents: openIncidents,
      mttr: "49m",
      automation: `${automationRate}%`,
      savings: "$1.26M",
    };
  }, [incidents, runbooks]);

useEffect(() => {
    let isActive = true;
    setBackendLoading(true);
    setBackendError(null);

    fetch("http://localhost:8000/incidents", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Fetch failed with status ${res.status}`);
        }
        const payload = (await res.json()) as BackendResponse;
        if (isActive) {
          setBackendData(payload);
        }
      })
      .catch((err) => {
        if (isActive) {
          setBackendError(err?.message ?? "Unable to load incidents");
        }
      })
      .finally(() => {
        if (isActive) {
          setBackendLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const resolvedCount = backendData?.totalIncidents ?? 0;
  const recentClosed = useMemo(() => {
    if (!backendData) {
      return [];
    }
    return [...backendData.incidents]
      .sort((a, b) =>
        (b.closed_at ? new Date(b.closed_at).getTime() : 0) -
        (a.closed_at ? new Date(a.closed_at).getTime() : 0),
      )
      .slice(0, 5);
  }, [backendData]);
  const activeDisplayValue = backendLoading ? <LoadingSpinner /> : (
    backendData?.activeCount ?? metrics.incidents
  ).toString();
  const resolvedDisplayValue = backendLoading ? <LoadingSpinner /> : resolvedCount.toString();

  return (
    <AuthGate>
      <RequireRole roles={["admin", "operator", "executive", "observer"]}>
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Active incidents"
              value={activeDisplayValue}
              delta="-18% vs last week"
              trend="down"
              icon={<ShieldIcon />}
              caption={
                backendData ? "Currently active incidents from backend" : "Sev-1 automation closed 3 in the past day"
              }
            />
            <KpiCard
              label="Resolved incidents"
              value={resolvedDisplayValue}
              delta="AI Agent & Hotfix only"
              icon={<ShieldIcon />}
              caption="Filtered by backend incidents service"
            />
            <KpiCard
              label="MTTR"
              value={metrics.mttr}
              delta="11m faster"
              trend="up"
              icon={<Activity className="h-5 w-5" />}
              caption="AI Agents recommended 4 mitigations"
            />
            <KpiCard
              label="Automation rate"
              value={metrics.automation}
              delta="+6 pts"
              icon={<Bot className="h-5 w-5" />}
              caption="Runbooks executed automatically in 55% of incidents"
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <Card className="space-y-3 lg:col-span-2">
              <p className="section-title">Service health</p>
              <div className="grid gap-3 md:grid-cols-2">
                {services.map((service) => (
                  <HealthPill service={service} key={service.id} />
                ))}
              </div>
            </Card>
            <MiniList
              title="Recent anomalies"
              items={topAnomalies.map((anomaly) => ({
                id: anomaly.id,
                title: `${anomaly.metric} - ${anomaly.value} (baseline ${anomaly.baseline})`,
                meta: `Detected ${new Date(anomaly.detectedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`,
                status:
                  anomaly.severity === "critical"
                    ? "err"
                    : anomaly.severity === "high"
                    ? "warn"
                    : "ok",
              }))}
            />
          </section>

          <section className="grid gap-6">
            <Card className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="section-title">Recent closed incidents</p>
              </div>
              <div className="min-h-[180px] space-y-3">
                {backendLoading && <p className="text-sm text-white/70">Loading incidents…</p>}
                {backendError && <p className="text-sm text-rose-400">{backendError}</p>}
                {!backendLoading && !backendError && (
                  <>
                    {recentClosed.length === 0 && (
                      <p className="text-sm text-white/60">No closed incidents available.</p>
                    )}
                    {recentClosed.map((incident, index) => (
                      <button
                        key={incident.sys_id ?? incident.number ?? index}
                        type="button"
                        onClick={() => setSelectedClosedIncident(incident)}
                        className="flex w-full flex-col gap-1 rounded-lg border border-white/5 bg-white/5 p-3 text-left text-sm transition hover:border-white/20 hover:bg-white/10"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="font-semibold">{incident.number ?? 'Unknown'}</p>
                          <p className="text-xs text-white/60">
                            {incident.closed_at
                              ? new Date(incident.closed_at).toLocaleString()
                              : 'Closed date unknown'}
                          </p>
                        </div>
                        <p className="text-white/70">{incident.short_description ?? 'No description'}</p>
                        <p className="text-xs text-white/50">
                          {(incident.close_notes && String(incident.close_notes)) || 'Closed by AI agent'} • Notify: {incident.notify ?? 'n/a'}
                        </p>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </Card>
            {selectedClosedIncident && (
              <ClosedIncidentDrawer
                incident={selectedClosedIncident}
                onClose={() => setSelectedClosedIncident(null)}
              />
            )}
          </section>
        </div>
      </RequireRole>
    </AuthGate>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3l7 3v5c0 4.418-3.582 8-8 8s-8-3.582-8-8V6l7-3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}
