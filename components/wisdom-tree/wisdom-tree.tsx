"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpandableMap } from "./expandable-map";
import { WisdomNavigationHub } from "./wisdom-navigation-hub";

type WisdomTreeProps = {
  initialNodeId?: string;
  compact?: boolean;
};

export function WisdomTree({ initialNodeId = "wisdom-root", compact }: WisdomTreeProps) {
  const [viewMode, setViewMode] = useState<"atlas" | "roadmap">("atlas");

  return (
    <div className="w-full">
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "atlas" | "roadmap")} className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="atlas">Civilization Atlas</TabsTrigger>
          <TabsTrigger value="roadmap">Classic Roadmap</TabsTrigger>
        </TabsList>

        <TabsContent value="atlas" className="mt-6">
          <WisdomNavigationHub initialNodeId={initialNodeId} />
        </TabsContent>

        <TabsContent value="roadmap" className="mt-6">
          <ExpandableMap initialNodeId={initialNodeId} compact={compact} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
