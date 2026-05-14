"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpandableMap } from "./expandable-map";
import { WisdomNavigationHub } from "./wisdom-navigation-hub";

type WisdomTreeProps = {
  initialNodeId?: string;
  compact?: boolean;
};

/**
 * WisdomTree component with toggle between legacy force-graph and new hierarchy views
 */
export function WisdomTree({ initialNodeId = "wisdom-root", compact }: WisdomTreeProps) {
  const [viewMode, setViewMode] = useState<"new" | "legacy">("new");

  return (
    <div className="w-full">
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "new" | "legacy")} className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="new">New Atlas View</TabsTrigger>
          <TabsTrigger value="legacy">Classic Graph</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6">
          <WisdomNavigationHub initialNodeId={initialNodeId} />
        </TabsContent>

        <TabsContent value="legacy" className="mt-6">
          <ExpandableMap initialNodeId={initialNodeId} compact={compact} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
