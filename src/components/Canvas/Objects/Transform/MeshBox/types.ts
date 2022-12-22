import { meshR } from "../Mesh/types"
import { paddingI, vectorI } from "../transformTypes"
import { vertexR } from "../Vertex/types"

interface meshBoxProps {
  vertices: vertexR[],
  padding?: paddingI
}

interface meshBoxR {
  meshBox: meshR
  update: () => void,
  getVertexFurthestAwayFrom: (vector: vectorI) => vertexR,
  getVertexDirection: (vertexToSearch: vertexR) => string,
  findDirection: (directionToSearch: "upperLeft" | "upperRight" | "lowerLeft" | "lowerRight") => vertexR
}

export {
  meshBoxProps,
  meshBoxR
}