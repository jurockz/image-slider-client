import { vectorI } from "../transformTypes"
import { vertexDataT, vertexR } from "../Vertex/types"

type triangleT = vertexR[]

type triangleDataT = vertexDataT[]

interface triangleProps {
  vertices: vertexR[],
  triangleData: triangleDataT
}

interface triangleR {
  getTriangle: () => triangleT,
  getTriangleData: () => triangleDataT,
  moveTriangle: (triangleVector: vectorI) => void,
  equals: (triangleData: triangleDataT) => boolean
}

export {
  triangleT,
  triangleDataT,
  triangleProps,
  triangleR
}