import { edgeR } from "../../Edge/types"
import { vertexI, vertexR } from "../../Vertex/types"

const calculateBorder = (edges: edgeR[]): vertexR[][] => {
  
  if(edges.length === 0) return null
  const borderEdges: edgeR[] = []
  
  edges.forEach(edge => {
    const isBorderEdge: boolean = edge.getTriangleNeighbors().filter(triangle => triangle !== null).length < 2
    if(isBorderEdge) borderEdges.push(edge)
  })
  
  const borderVerticesInOrder: vertexR[][] = [borderEdges[0].getEdge()]
  
  borderEdges.shift()
  while(borderEdges.length !== 0) {
    const lastBorderArray: vertexR[] = borderVerticesInOrder[borderVerticesInOrder.length - 1]
    const lastBorderArrayLength: number = lastBorderArray.length
    const lastBorderVertex: vertexI = lastBorderArray[lastBorderArray.length - 1].getVertex()
    const firstBorderVertex: vertexI = lastBorderArray[0].getVertex()
    borderEdges.every((edge, index) => {
      const edgesVertices = edge.getEdge()

      if(edgesVertices[0].equals(firstBorderVertex) || edgesVertices[1].equals(firstBorderVertex)) {
        borderEdges.splice(index, 1)
        return true
      }
      if(edgesVertices[0].equals(lastBorderVertex)) {
        borderVerticesInOrder[borderVerticesInOrder.length - 1].push(edgesVertices[1])
        borderEdges.splice(index, 1)
        return false
      }
      if (edgesVertices[1].equals(lastBorderVertex)) {
        borderVerticesInOrder[borderVerticesInOrder.length - 1].push(edgesVertices[0])
        borderEdges.splice(index, 1)
        return false
      }
      return true
    })
    if(lastBorderArrayLength === borderVerticesInOrder[borderVerticesInOrder.length - 1].length && borderEdges.length !== 0) {
      borderVerticesInOrder.push(borderEdges[0].getEdge())
      borderEdges.shift()
    }
  }
  
  return borderVerticesInOrder
}

export default calculateBorder
