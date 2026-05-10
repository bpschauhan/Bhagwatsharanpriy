import { ExpandableMap } from "./expandable-map";

type WisdomTreeProps = {
  initialNodeId?: string;
  compact?: boolean;
};

export function WisdomTree({ initialNodeId, compact }: WisdomTreeProps) {
  return <ExpandableMap initialNodeId={initialNodeId} compact={compact} />;
}
