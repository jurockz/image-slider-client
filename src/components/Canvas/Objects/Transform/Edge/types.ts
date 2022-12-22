import { triangleDataT, triangleR } from "../Triangle/types"
import { vectorI } from "../transformTypes"
import { vertexDataT, vertexR } from "../Vertex/types"

type edgeDataT = [vertexDataT, vertexDataT]

interface edgeProps {
  vertices: vertexR[],
  triangles: triangleR[],
  edgeData: edgeDataT
}

interface edgeR {
  getEdge: () => edgeT,
  getTriangleNeighbors: () => triangleR[],
  getEdgeData: () => edgeDataT,
  setTriangleNull: (removeTriangleData: triangleDataT) => void,
  moveEdge: (egdeVector: vectorI) => void,
  equals: (edgeData: edgeDataT) => boolean,
  includes: (includedData: vertexDataT) => boolean
}

type edgeT = vertexR[]

export {
  edgeDataT,
  edgeProps,
  edgeR,
  edgeT
}