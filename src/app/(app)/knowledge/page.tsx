'use client';

import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useAIOpsStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";

export default function KnowledgePage() {
  const knowledge = useAIOpsStore((state) => state.knowledgeEntries);
  const playbooks = useAIOpsStore((state) => state.playbooks);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  return (
    <AuthGate>
      <RequireRole roles={["admin", "operator", "executive", "observer"]}>
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card>
            <p className="section-title mb-4">Resolved incidents library</p>
            <div className="space-y-4">
              {knowledge.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/60">{entry.id}</p>
                      <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                    </div>
                    <span className="text-xs text-white/50">
                      Resolved {formatDate(entry.resolvedAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">{entry.summary}</p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-emerald-300">
                    {entry.takeaways.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
          <div className="space-y-6">
            <Card>
              <p className="section-title mb-4">Playbooks</p>
              <div className="space-y-3 text-sm">
                {playbooks.map((playbook) => (
                  <div key={playbook.id} className="rounded-2xl border border-white/5 bg-white/5 p-3">
                    <p className="font-semibold text-white">
                      {playbook.name} · {playbook.owner}
                    </p>
                    <ul className="mt-2 list-decimal space-y-1 pl-5 text-white/70">
                      {playbook.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="space-y-3">
              <p className="section-title">Feedback</p>
              <p className="text-sm text-white/70">
                Was the latest AI recommendation helpful?
              </p>
              <div className="flex gap-3">
                <Button
                  variant={feedback === "up" ? "default" : "muted"}
                  onClick={() => setFeedback("up")}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" /> Upvote
                </Button>
                <Button
                  variant={feedback === "down" ? "destructive" : "muted"}
                  onClick={() => setFeedback("down")}
                >
                  <ThumbsDown className="mr-2 h-4 w-4" /> Downvote
                </Button>
              </div>
              {feedback && (
                <p className="text-xs text-white/50">
                  Thanks! Feedback captured to retrain explainability models.
                </p>
              )}
            </Card>
          </div>
        </div>
      </RequireRole>
    </AuthGate>
  );
}
