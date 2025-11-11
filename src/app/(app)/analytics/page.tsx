'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { analyticsSeries } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KpiGrid } from "@/components/analytics/KpiGrid";
import { ChartCard } from "@/components/analytics/ChartCard";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";
import { Can } from "@/components/auth/Can";

export default function AnalyticsPage() {
  const kpis: Array<{
    label: string;
    value: string;
    delta: string;
    trend: "up" | "down";
  }> = [
    { label: "Noise reduction", value: "35%", delta: "+4 pts", trend: "up" },
    { label: "Automation coverage", value: "55%", delta: "+6 pts", trend: "up" },
    { label: "Incident recurrence", value: "-28%", delta: "-4%", trend: "down" },
    { label: "Cost savings YTD", value: "$740K", delta: "+$120K", trend: "up" },
  ];

  return (
    <AuthGate>
      <RequireRole roles={["admin", "operator", "executive"]}>
        <div className="space-y-6">
          <KpiGrid items={kpis} />
          <Card className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-title">Exports</p>
              <p className="text-sm text-white/60">Share MTTR, automation, and ROI snapshots.</p>
            </div>
            <Can
              permission="export:analytics"
              fallback={
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] px-4 py-2 text-sm text-white/60">
                  Exports require Executive or Admin access.
                </div>
              }
            >
              <div className="flex gap-2">
                <Button variant="muted">Export CSV</Button>
                <Button>Export PDF</Button>
              </div>
            </Can>
          </Card>
          <section className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="MTTR trend" description="Monitor → Analyze → Automate impact">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsSeries.mttr}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        background: "#0b1326",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "1rem",
                      }}
                    />
                    <Line dataKey="value" stroke="#34d399" strokeWidth={3} dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="Alert noise reduction">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsSeries.noiseReduction}>
                    <defs>
                      <linearGradient id="noise" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#f472b6" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#f472b6"
                      fillOpacity={1}
                      fill="url(#noise)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="Automation coverage">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsSeries.automationCoverage}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                    <Area
                      dataKey="value"
                      stroke="#60a5fa"
                      fill="#60a5fa33"
                      type="monotone"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="Incident recurrence">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsSeries.recurrence}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="label" stroke="rgba(255,255,255,0.5)" />
                    <Bar dataKey="value" fill="#c084fc" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="Cost savings" description="Automation vs avoidance">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsSeries.costSavings}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        background: "#0b1326",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="automation" fill="#34d399" radius={[12, 12, 0, 0]} />
                    <Bar dataKey="avoidance" fill="#f472b6" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="Top effective runbooks">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsSeries.topRunbooks}>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>
        </div>
      </RequireRole>
    </AuthGate>
  );
}
