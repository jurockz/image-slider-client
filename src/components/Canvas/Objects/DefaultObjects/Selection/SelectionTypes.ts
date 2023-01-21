import { objectR } from "../../objectTypes";
import { vectorI } from "../../Transform/transformTypes";
import { vertexR } from "../../Transform/Vertex/types";

interface selectionSpecificDataInterface {
  typesAllowedForSelection: string[];
}

interface selectionSessionDataInterface {
  firstRender: boolean;
  isMouseReleasedTrigger: boolean;
  mode: string;
  lastGridMouseVector: vectorI;
  selectionTransformAllowed: boolean;
  objectsInSelection: objectR[];
  activeCorner: vertexR;
}

export { selectionSpecificDataInterface, selectionSessionDataInterface };
