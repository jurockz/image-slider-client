import { hierarchyDataObjectI } from "../../../hierarchy/hierarchyTypes";
import { edgeDataT } from "../../Transform/Edge/types";
import { triangleDataT } from "../../Transform/Triangle/types";
import { vertexDataT } from "../../Transform/Vertex/types";

// startpoint 10, 80
// width 50
// height 40
const vertices: vertexDataT[] = [
  [10, 80],
  [60, 80],
  [60, 120],
  [10, 120],
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

const menuData: hierarchyDataObjectI = {
  name: "sceneMenu",
  type: "menu",
  transform: {
    meshData: {
      verticesData: vertices,
      trianglesData: triangles,
      edgesData: edges,
    },
    visible: true,
  },
  zIndex: 100,
  specific: {},
};

export default menuData;
