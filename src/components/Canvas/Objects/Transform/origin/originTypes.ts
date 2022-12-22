import { meshR } from "../Mesh/types";
import { vertexR } from "../Vertex/types";

interface originProps {
  meshBox: meshR
}

interface originR {
  getOrigin: () => vertexR,
  getNearestVertex: ({vertices}: getNearestVertexProps) => getNearestVertexR
}

interface getNearestVertexProps {
  vertices: vertexR[]
}

interface getNearestVertexR {
  index: number,
  vertex: vertexR,
  distance: number
}

export {
  originProps,
  originR,
  getNearestVertexProps,
  getNearestVertexR
}