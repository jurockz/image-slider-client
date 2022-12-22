import { vertexR } from "../Vertex/types"

const distanceOfTwoVertices = ({vertexA, vertexB}: {vertexA: vertexR, vertexB: vertexR}) => {
  return Math.sqrt(Math.pow(vertexA.getVertexData()[0] - vertexB.getVertexData()[0], 2) + Math.pow(vertexA.getVertexData()[1] - vertexB.getVertexData()[1], 2) )
}

export default distanceOfTwoVertices