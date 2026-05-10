import { WisdomTree } from "./wisdom-tree";

type ConceptGraphProps = {
  focusNodeId?: string;
};

export function ConceptGraph({ focusNodeId = "concepts" }: ConceptGraphProps) {
  return <WisdomTree initialNodeId={focusNodeId} compact />;
}
