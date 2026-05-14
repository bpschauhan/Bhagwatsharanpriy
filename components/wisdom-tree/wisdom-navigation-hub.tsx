"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HierarchyNavigator } from "./hierarchy-navigator";
import { TimelineView } from "./timeline-view";
import { LearningPathGuide } from "./learning-path-guide";

export function WisdomNavigationHub({ initialNodeId = "wisdom-root" }: { initialNodeId?: string }) {
  return (
    <Tabs defaultValue="tree" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:w-fit">
        <TabsTrigger value="tree">Knowledge Tree</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="learning-paths">Learning Paths</TabsTrigger>
      </TabsList>

      <TabsContent value="tree" className="mt-6">
        <HierarchyNavigator initialNodeId={initialNodeId} viewMode="tree" />
      </TabsContent>

      <TabsContent value="timeline" className="mt-6">
        <TimelineView initialNodeId={initialNodeId} />
      </TabsContent>

      <TabsContent value="learning-paths" className="mt-6">
        <LearningPathGuide initialNodeId={initialNodeId} />
      </TabsContent>
    </Tabs>
  );
}
