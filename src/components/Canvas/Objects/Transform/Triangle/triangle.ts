import _ from "lodash"
import { edgeDataT } from "../Edge/types"
import { vectorI } from "../transformTypes"
import { triangleDataT, triangleProps, triangleR, triangleT } from "./types"

const triangle = ({vertices, triangleData}: triangleProps): triangleR => {
  const _triangle: triangleT = []

  // Find vertices of triangle
  vertices.every(vertex => {
    if(vertex.equals({x:triangleData[0][0], y:triangleData[0][1]})) _triangle.push(vertex)
    if(vertex.equals({x:triangleData[1][0], y:triangleData[1][1]})) _triangle.push(vertex)
    if(vertex.equals({x:triangleData[2][0], y:triangleData[2][1]})) _triangle.push(vertex)
    if(_triangle.length === 3) return false
    return true
  })

  const getTriangle = (): triangleT => {
    return _triangle
  }

  const getTriangleData = (): triangleDataT => {
    return _triangle.map(triangle => triangle.getVertexData())
  }

  const moveTriangle = (triangleVector: vectorI): void => {
    _triangle[0].moveVertex(triangleVector)
    _triangle[1].moveVertex(triangleVector)
    _triangle[2].moveVertex(triangleVector)
  }

  const equals = (equalsTriangleData: triangleDataT): boolean => {
    const equal: boolean[] = [false, false, false]
    equalsTriangleData.every(((vertexData, index) => {
      _triangle.every(triangleVertex => {
        if(triangleVertex.equals({x:vertexData[0], y:vertexData[1]})) {
          equal[index] = true
          return false
        }
        return true
      })
      if(equal[index] === false) return false
      return true
    }))
    return equal[0] && equal[1] && equal[2]
  }

  return {
    getTriangle,
    getTriangleData,
    moveTriangle,
    equals
  }
}

export default triangle