'use client';

import { useState } from "react";
import { useAIOpsStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { TopologyCanvas } from "@/components/topology/TopologyCanvas";
import { NodeDetails } from "@/components/topology/NodeDetails";
import { AuthGate } from "@/components/auth/AuthGate";
import { RequireRole } from "@/components/auth/RequireRole";

export default function TopologyPage() {
  const nodes = useAIOpsStore((state) => state.topologyNodes);
  const edges = useAIOpsStore((state) => state.topologyEdges);
  const services = useAIOpsStore((state) => state.services);
  const incidents = useAIOpsStore((state) => state.incidents);
  const changeRisks = useAIOpsStore((state) => state.changeRisks);

  const [activeNodeId, setActiveNodeId] = useState(nodes[0]?.id);
  const activeNode = nodes.find((node) => node.id === activeNodeId);

  return (
    <AuthGate>
      <RequireRole roles={["admin", "operator"]}>
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="h-[70vh]">
        <div className="flex items-center justify-between">
          <p className="section-title">Dependency map</p>
          <p className="text-xs text-white/60">
            Zoom & drag to explore relationships
          </p>
        </div>
        <div className="mt-4 h-full">
          <TopologyCanvas
            nodes={nodes}
            edges={edges}
            selectedId={activeNodeId}
            onSelect={(node) => setActiveNodeId(node.id)}
            height={520}
          />
        </div>
          </Card>
          <NodeDetails node={activeNode} services={services} incidents={incidents} changes={changeRisks} />
        </div>
      </RequireRole>
    </AuthGate>
  );
}
