import _ from "lodash"
import distanceOfTwoVertices from "../util/distanceOfTwoVertices"
import { vertexI, vertexR } from "../Vertex/types"
import { getNearestVertexProps, getNearestVertexR, originProps, originR } from "./originTypes"

const origin = ({meshBox}: originProps): originR => {
  const _origin: vertexR = meshBox.getVertices().reduce((prevVertex, curVertex) => {
    const prevVertexCoord: vertexI = prevVertex.getVertex()
    const curVertexCoord: vertexI = curVertex.getVertex()
    return curVertexCoord.x <= prevVertexCoord.x && curVertexCoord.y <= prevVertexCoord.y ? curVertex : prevVertex
  })

  const getOrigin = (): vertexR => {
    return _origin
  }

  const getNearestVertex = ({vertices}: getNearestVertexProps): getNearestVertexR => {
    const _vertices: vertexR[] = _.cloneDeep(vertices)
    const firstVertex: vertexR = _vertices.shift()
    const nearestVertex: getNearestVertexR = {
      index: 0,
      vertex: firstVertex,
      distance: distanceOfTwoVertices({vertexA: firstVertex, vertexB:_origin})
    }
    _vertices.forEach((vertex, index) => {
      const distanceToOrigin: number = distanceOfTwoVertices({vertexA: vertex, vertexB:_origin})
      if(distanceToOrigin < nearestVertex.distance) {
        nearestVertex.index = index + 1
        nearestVertex.vertex = vertex
        nearestVertex.distance = distanceToOrigin
      }
    })
    return nearestVertex
  }

  return {
    getOrigin,
    getNearestVertex
  }
}

export default origin