import { hierarchyDataObjectI } from "../../../hierarchy/hierarchyTypes";
import { edgeDataT } from "../../Transform/Edge/types";
import { triangleDataT } from "../../Transform/Triangle/types";
import { vertexDataT } from "../../Transform/Vertex/types";

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

const roomData: hierarchyDataObjectI = {
  name: "room",
  type: "room",
  transform: {
    meshData: {
      verticesData: vertices,
      trianglesData: triangles,
      edgesData: edges,
    },
    visible: true,
  },
  zIndex: 10,
  specific: {
    objectIsSet: false,
  },
};

export default roomData;
