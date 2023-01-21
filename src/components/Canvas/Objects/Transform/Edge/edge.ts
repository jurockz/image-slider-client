import _ from "lodash"
import { triangleDataT, triangleR, triangleT } from "../Triangle/types"
import { vectorI } from "../transformTypes"
import { vertexDataT } from "../Vertex/types"
import { edgeDataT, edgeProps, edgeR, edgeT } from "./types"
import isEdgeInTriangle from "./util/isEdgeInTriangle"
import roundVector from "../util/roundVector"

// data in [[x,y],[x,y]]
const edge = ({vertices, triangles, edgeData}: edgeProps): edgeR => {
  const _edge: edgeT = []
  const triangleNeighbours: triangleR[] = [null, null]
  
  // Find Vertices of edges
  vertices.every(vertex => {
    if(vertex.equals({x:edgeData[0][0], y:edgeData[0][1]})) {
      _edge.push(vertex)
    }
    if(vertex.equals({x:edgeData[1][0], y:edgeData[1][1]})) {
      _edge.push(vertex)
    }
    if(_edge.length === 2) return false
    return true
  })

  triangles.every(triangle => {
    const edgeInTriangle: boolean = isEdgeInTriangle({triangle, edge:_edge})
    if(edgeInTriangle) {
      if(triangleNeighbours[0] === null) {
        triangleNeighbours[0] = triangle
      } else {
        triangleNeighbours[1] = triangle
      }
      if(triangleNeighbours[0] !== null && triangleNeighbours[1] !== null) return false
    }
    return true
  })
  
  const getEdge = (): edgeT => {
    return _edge
  }

  const getTriangleNeighbors = (): triangleR[] => {
    return triangleNeighbours
  }

  const getEdgeData = (): edgeDataT => {
    return [
      _edge[0].getVertexData(),
      _edge[1].getVertexData()
    ]
  }

  const setTriangleNull = (removeTriangleData: triangleDataT): void => {
    triangleNeighbours.every((triangle, index) => {
      if(triangle !== null && triangle.equals(removeTriangleData)) {
        triangleNeighbours[index] = null
        return false
      }
    })
  }

  const moveEdge = (egdeVector: vectorI) => {
    _edge[0].moveVertex(roundVector(egdeVector, 6))
    _edge[1].moveVertex(roundVector(egdeVector, 6))
  }

  const equals = (equalsEdgeData: edgeDataT) => {
    const equal: boolean[] = [false, false]
    equalsEdgeData.forEach(((vertexData, index) => {
      if(_edge[0].equals({x:vertexData[0], y:vertexData[1]})) equal[index] = true
      if(_edge[1].equals({x:vertexData[0], y:vertexData[1]})) equal[index] = true
    }))
    return equal[0] && equal[1]
  }

  const includes = (includedVertex: vertexDataT) => {
    return _edge[0].equals({x:includedVertex[0], y:includedVertex[1]}) || _edge[1].equals({x:includedVertex[0], y:includedVertex[1]})
  }

  return {
    getEdge,
    getTriangleNeighbors,
    getEdgeData,
    setTriangleNull,
    moveEdge,
    equals,
    includes
  }
}

export default edge