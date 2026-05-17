"use client";

import { HierarchyNavigator } from "./hierarchy-navigator";

type WisdomTreeProps = {
  initialNodeId?: string;
  compact?: boolean;
};

export function WisdomTree({ initialNodeId = "wisdom-root", compact }: WisdomTreeProps) {
  return <HierarchyNavigator initialNodeId={initialNodeId} compact={compact} />;
}
