import { triangleT } from "../../Triangle/types";
import { edgeInTriangleProps } from "./isEdgeInTriangleTypes";

const isEdgeInTriangle = ({triangle, edge}: edgeInTriangleProps) => {
  const triangleVertices: triangleT = triangle.getTriangle()
  const bothEdgeVerticesInTriangle: boolean[] = []
  
  triangleVertices.every(vertexToCompare => {
    if(vertexToCompare.equals(edge[0].getVertex()) || vertexToCompare.equals(edge[1].getVertex())) {
      bothEdgeVerticesInTriangle.push(true)
      if(bothEdgeVerticesInTriangle.length === 2) return false
    }
    return true
  })

  return bothEdgeVerticesInTriangle.length === 2
}

export default isEdgeInTriangle