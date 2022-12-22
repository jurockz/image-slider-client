import { hierarchyDataObjectI } from "../../../hierarchy/hierarchyTypes";
import { edgeDataT } from "../../Transform/Edge/types";
import { triangleDataT } from "../../Transform/Triangle/types";
import { vertexDataT } from "../../Transform/Vertex/types";

// startpoint 10, 80
// width 50
// height 40
const start: vertexDataT = [70, 220];
const width: number = 10;
const height: number = 10;
const vertices: vertexDataT[] = [
  start,
  [start[0] + width, start[1]],
  [start[0] + width, start[1] + height],
  [start[0], start[1] + height],
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

const rtSubmenuData: hierarchyDataObjectI = {
  name: "racetrackMenu",
  type: "rtSubmenu",
  transform: {
    meshData: {
      verticesData: vertices,
      trianglesData: triangles,
      edgesData: edges,
    },
    visible: false,
  },
  zIndex: 101,
  specific: {},
};

export default rtSubmenuData;
