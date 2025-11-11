'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatFeed } from "@/components/chatops/ChatFeed";
import { useAIOpsStore } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";
import { Can } from "@/components/auth/Can";
import { useSessionStore } from "@/lib/auth/session";
import { toast } from "sonner";

export default function ChatOpsPage() {
  const incidents = useAIOpsStore((state) => state.incidents);
  const kb = useAIOpsStore((state) => state.knowledgeEntries);
  const addChatMessage = useAIOpsStore((state) => state.addChatMessage);
  const user = useSessionStore((state) => state.user);
  const [message, setMessage] = useState("");

  const similar = incidents.filter((incident) => incident.status !== "resolved").slice(0, 3);

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    addChatMessage({
      id: crypto.randomUUID(),
      author: "operator",
      text: message.trim(),
      timestamp: new Date().toISOString(),
    });
    setMessage("");
    toast.success("Message posted");
  };

  return (
    <AuthGate>
      <RequireRole roles={["admin", "operator", "executive", "observer"]}>
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="section-title">ChatOps bridge</p>
                <p className="text-white/70">
                  AI Agents, responders, and automation approvals in one stream.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="muted">Create ticket</Button>
                <Button>Post update</Button>
              </div>
            </div>
            <div className="mt-4 max-h-[420px] space-y-4 overflow-y-auto pr-2">
              <ChatFeed />
            </div>
            <div className="mt-4">
              <Can
                permission="post:chatops"
                fallback={
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] px-4 py-3 text-sm text-white/60">
                    ChatOps composer requires Operator or Admin privileges.
                  </div>
                }
              >
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Send an update to the bridge"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    className="flex-1 rounded-2xl border border-[var(--border)] bg-transparent px-4 py-2 text-sm text-white"
                  />
                  <Button type="submit" disabled={!message.trim()}>
                    Send as {user?.name.split(" ")[0] ?? "operator"}
                  </Button>
                </form>
              </Can>
            </div>
          </Card>
          <div className="space-y-6">
            <Card>
              <p className="section-title mb-4">Similar incidents</p>
              <div className="space-y-3 text-sm">
                {similar.map((incident) => (
                  <div key={incident.id} className="rounded-2xl border border-white/5 bg-white/5 p-3">
                    <p className="font-semibold text-white">{incident.id}</p>
                    <p className="text-white/70">{incident.title}</p>
                    <p className="text-xs text-white/50">
                      {incident.severity.toUpperCase()} · {formatDate(incident.detectedAt)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <p className="section-title mb-4">KB suggestions</p>
              <div className="space-y-3 text-sm">
                {kb.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-white/5 bg-white/5 p-3">
                    <p className="font-semibold text-white">{entry.title}</p>
                    <p className="text-white/70">{entry.summary}</p>
                    <p className="text-xs text-white/50">
                      Resolved {formatDate(entry.resolvedAt)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </RequireRole>
    </AuthGate>
  );
}
