'use client';

import { useMemo } from "react";
import { useAIOpsStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { RunbookTable } from "@/components/automation/RunbookTable";
import { ApprovalPanel } from "@/components/automation/ApprovalPanel";
import { ExecutionTimeline } from "@/components/automation/ExecutionTimeline";
import { ChatFeed } from "@/components/chatops/ChatFeed";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";

export default function AutomationPage() {
  const runbooks = useAIOpsStore((state) => state.runbooks);
  const executions = useAIOpsStore((state) => state.executions);

  const metrics = useMemo(() => {
    const executedToday = executions.filter(
      (exe) => Math.abs(new Date().getTime() - new Date(exe.startedAt).getTime()) < 1000 * 60 * 60 * 24,
    ).length;
    const pendingApprovals = executions.filter((exe) => exe.status === "pending-approval").length;
    const successRate =
      executions.reduce((acc, exe) => acc + (exe.status === "success" ? 1 : 0), 0) /
      executions.length;
    return {
      totalRunbooks: runbooks.length,
      executedToday,
      pendingApprovals,
      successRate: `${Math.round(successRate * 100)}%`,
    };
  }, [executions, runbooks]);

  return (
    <AuthGate>
      <RequireRole roles={["admin", "operator", "executive"]}>
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Runbooks available" value={metrics.totalRunbooks.toString()} />
            <SummaryCard label="Executed today" value={metrics.executedToday.toString()} />
            <SummaryCard label="Pending approvals" value={metrics.pendingApprovals.toString()} />
            <SummaryCard label="Success rate" value={metrics.successRate} accent />
          </section>
          <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <Card>
              <p className="section-title mb-4">Runbook library</p>
              <RunbookTable runbooks={runbooks} />
            </Card>
            <ApprovalPanel />
          </section>
          <section className="grid gap-6 lg:grid-cols-2">
            <ExecutionTimeline />
            <Card>
              <p className="section-title mb-4">ChatOps stream</p>
              <div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">
                <ChatFeed />
              </div>
            </Card>
          </section>
        </div>
      </RequireRole>
    </AuthGate>
  );
}

function SummaryCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <Card className={accent ? "border-indigo-500/40" : ""}>
      <p className="text-sm text-white/60">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="text-xs text-white/40">Updated {new Date().toLocaleTimeString()}</p>
    </Card>
  );
}
