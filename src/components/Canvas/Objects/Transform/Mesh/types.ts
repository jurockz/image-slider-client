import { edgeDataT, edgeR } from "../Edge/types"
import { triangleDataT, triangleR } from "../Triangle/types"
import { vectorI } from "../transformTypes"
import { vertexDataT, vertexR } from "../Vertex/types"

interface meshProps {
  verticesData: vertexDataT[],
  trianglesData: triangleDataT[],
  edgesData: edgeDataT[]
}

interface meshR {
  moveMesh: ({x, y}: vectorI) => void,
  removeTriangle: (triangleToRemove: triangleR) => void,
  removeEdge: (edgeToRemove: edgeR) => void,
  removeVertex: (vertexToRemove: vertexR) => void,
  splitEdge: ({edgeToSplit, vertexData}: splitEdgeProps) => void,
  scaleToOrigin: ({origin, from, to}: scaleToOriginProps) => void,
  getVertices: () => vertexR[],
  getTriangles: () => triangleR[],
  getEdges: () => edgeR[],
  getBorder: () => vertexR[][],
  getMeshData: () => meshProps
}

interface splitEdgeProps {
  edgeToSplit: edgeR,
  vertexData: vertexDataT
}

interface scaleToOriginProps {
  origin: vertexR, 
  from: vectorI, 
  to: vectorI
}

export {
  meshProps,
  meshR,
  splitEdgeProps,
  scaleToOriginProps
}