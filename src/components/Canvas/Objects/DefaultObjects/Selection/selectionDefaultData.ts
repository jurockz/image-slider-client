import { hierarchyDataObjectI } from "../../../hierarchy/hierarchyTypes";
import { edgeDataT } from "../../Transform/Edge/types";
import { triangleDataT } from "../../Transform/Triangle/types";
import { vertexDataT } from "../../Transform/Vertex/types";

// startpoint 10, 80
// width 50
// height 40
const vertices: vertexDataT[] = [
  [-100, -100],
  [-100, -99.9],
  [-99.9, -99.9],
  [-99.9, -100],
];
const triangles: triangleDataT[] = [
  [vertices[0], vertices[1], vertices[2]],
  [vertices[0], vertices[2], vertices[3]],
];
const edges: edgeDataT[] = [
  [vertices[0], vertices[1]],
  [vertices[1], vertices[2]],
  [vertices[2], vertices[3]],
  [vertices[3], vertices[0]],
  [vertices[0], vertices[2]],
];

const selectionData: hierarchyDataObjectI = {
  name: "sceneSelection",
  type: "selection",
  transform: {
    meshData: {
      verticesData: vertices,
      trianglesData: triangles,
      edgesData: edges,
    },
    visible: true,
  },
  zIndex: 30,
  specific: {},
};

export default selectionData;
