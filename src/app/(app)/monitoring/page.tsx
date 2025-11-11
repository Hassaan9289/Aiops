'use client';

import { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, CartesianGrid } from "recharts";
import { monitoringSeries } from "@/lib/mockData";
import { useAIOpsStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";

const metricMap = [
  { key: "latency", label: "Latency p95 (ms)", color: "#34d399" },
  { key: "errorRate", label: "Error rate (%)", color: "#f472b6" },
  { key: "cpu", label: "CPU utilization (%)", color: "#60a5fa" },
  { key: "memory", label: "Memory usage (%)", color: "#c084fc" },
];

export default function MonitoringPage() {
  const [environment, setEnvironment] = useState("prod");
  const [region, setRegion] = useState("us-east-1");
  const [service, setService] = useState("svc-payments");

  const anomalies = useAIOpsStore((state) => state.anomalies);
  const timeline = useAIOpsStore((state) => state.timeline);
  const services = useAIOpsStore((state) => state.services);

  const filteredAnomalies = useMemo(
    () => anomalies.filter((anomaly) => anomaly.serviceId === service),
    [anomalies, service],
  );

  return (
    <AuthGate>
      <RequireRole roles={["admin", "operator", "observer"]}>
        <div className="space-y-6">
      <Card className="flex flex-wrap items-center gap-4">
        <Filter label="Environment">
          <Select value={environment} onChange={(event) => setEnvironment(event.target.value)}>
            <option value="prod">Prod</option>
            <option value="staging">Staging</option>
            <option value="dev">Dev</option>
          </Select>
        </Filter>
        <Filter label="Region">
          <Select value={region} onChange={(event) => setRegion(event.target.value)}>
            <option value="us-east-1">us-east-1</option>
            <option value="us-west-2">us-west-2</option>
            <option value="eu-central-1">eu-central-1</option>
          </Select>
        </Filter>
        <Filter label="Service">
          <Select value={service} onChange={(event) => setService(event.target.value)}>
            {services.map((svc) => (
              <option value={svc.id} key={svc.id}>
                {svc.name}
              </option>
            ))}
          </Select>
        </Filter>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        {metricMap.map((metric) => (
          <Card key={metric.key}>
            <div className="flex items-center justify-between">
              <p className="section-title">{metric.label}</p>
              <Badge variant="outline">{environment.toUpperCase()}</Badge>
            </div>
            <div className="mt-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monitoringSeries[metric.key as keyof typeof monitoringSeries]}>
                  <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="var(--chart-axis)"
                    tick={{ fill: "var(--chart-axis-text)" }}
                    axisLine={{ stroke: "var(--chart-axis)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0b1326",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "1rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={metric.color}
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <p className="section-title">Anomaly feed</p>
            <span className="text-xs text-white/60">
              Showing {filteredAnomalies.length} for selection
            </span>
          </div>
          <div className="mt-4 space-y-4">
            {filteredAnomalies.map((anomaly) => (
              <details
                key={anomaly.id}
                className="rounded-2xl border border-white/5 bg-white/5 p-4 [&[open]]:bg-indigo-500/5"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm text-white/80">
                  <div>
                    <p className="font-semibold">{anomaly.metric}</p>
                    <p className="text-xs text-white/60">
                      Value {anomaly.value} vs baseline {anomaly.baseline}
                    </p>
                  </div>
                  <Badge
                    variant={
                      anomaly.severity === "critical"
                        ? "danger"
                        : anomaly.severity === "high"
                          ? "warning"
                          : "default"
                    }
                  >
                    {Math.round(anomaly.confidence * 100)}%
                  </Badge>
                </summary>
                <p className="mt-3 text-sm text-white/70">{anomaly.why}</p>
                <p className="mt-1 text-xs text-white/50">
                  Flagged {formatDate(anomaly.detectedAt)}
                </p>
              </details>
            ))}
            {filteredAnomalies.length === 0 && (
              <p className="text-sm text-white/60">No anomalies for this service.</p>
            )}
          </div>
        </Card>
        <Card>
          <p className="section-title mb-4">Event timeline</p>
          <div className="space-y-4 text-sm">
            {timeline.map((event) => (
              <div key={event.id} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-white/60" />
                <div>
                  <p className="text-xs text-white/50">{formatDate(event.timestamp)}</p>
                  <p className="text-white">{event.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
        </div>
      </RequireRole>
    </AuthGate>
  );
}

function Filter({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="space-y-1 text-sm">
      <p className="text-white/50">{label}</p>
      {children}
    </div>
  );
}
