import { transformR } from "../../../Transform/transformTypes"

const resetSelection = (objectTransform: transformR) => {
  // Reset selection if objects were selected
  if (Boolean(objectTransform.getRelation().getChildren())) {
    objectTransform.getRelation().resetChildren();
    objectTransform.setObjectTo({ x: -100, y: -100 });
    objectTransform.scaleObjectTo({ to: { x: -99.9, y: -99.9 } });
  }
}

export default resetSelection