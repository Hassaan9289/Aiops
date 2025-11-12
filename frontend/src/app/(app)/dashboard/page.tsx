'use client';

import { Activity, ArrowDownRight, Bot, PiggyBank } from "lucide-react";
import { useMemo } from "react";
import { useAIOpsStore } from "@/lib/store";
import { incidentTrend } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/KpiCard";
import { HealthPill } from "@/components/ui/HealthPill";
import { MiniList } from "@/components/ui/MiniList";
import { TrendChart } from "@/components/ui/TrendChart";
import { AiInsightCard } from "@/components/insights/AiInsightCard";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";

export default function DashboardPage() {
  const services = useAIOpsStore((state) => state.services);
  const anomalies = useAIOpsStore((state) => state.anomalies);
  const incidents = useAIOpsStore((state) => state.incidents);
  const aiInsights = useAIOpsStore((state) => state.insights);
  const runbooks = useAIOpsStore((state) => state.runbooks);

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

  return (
    <AuthGate>
      <RequireRole roles={["admin", "operator", "executive", "observer"]}>
        <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Active incidents"
          value={metrics.incidents.toString()}
          delta="-18% vs last week"
          trend="down"
          icon={<ShieldIcon />}
          caption="Sev-1 automation closed 3 in the past day"
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
        <KpiCard
          label="Cost savings"
          value={metrics.savings}
          delta="+$140K this quarter"
          icon={<PiggyBank className="h-5 w-5" />}
          caption="Noise reduction & toil avoidance"
        />
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-title">Incident trends</p>
              <p className="text-white/70">
                AI explains which stages reduced MTTR (Monitor &gt; Analyze &gt; Automate)
              </p>
            </div>
            <ArrowDownRight className="h-5 w-5 text-emerald-300" />
          </div>
          <div className="mt-4">
            <TrendChart
              data={incidentTrend}
              lines={[
                { dataKey: "incidents", color: "#f472b6", name: "Incidents" },
                { dataKey: "aiClosed", color: "#34d399", name: "AI-closed" },
              ]}
            />
          </div>
        </Card>
        <div className="space-y-4">
          <p className="section-title">AI Insights</p>
          {aiInsights.map((insight) => (
            <AiInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
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
            meta: `Detected ${new Date(anomaly.detectedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            status: anomaly.severity === "critical" ? "err" : anomaly.severity === "high" ? "warn" : "ok",
          }))}
        />
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
