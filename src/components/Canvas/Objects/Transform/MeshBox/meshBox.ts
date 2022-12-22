import { edgeDataT } from "../Edge/types"
import mesh from "../Mesh/mesh"
import { meshR } from "../Mesh/types"
import { triangleDataT } from "../Triangle/types"
import { paddingI, vectorI } from "../transformTypes"
import { vertexDataT, vertexI, vertexR } from "../Vertex/types"
import { meshBoxProps, meshBoxR } from "./types"
import distanceOfTwoPoints from "../util/distanceOfTwoPoints"
import _ from "lodash"

const defaultPadding: paddingI = {
  top: 0,
  bottom: 0,
  right: 0,
  left: 0
}

const meshBox = ({vertices, padding=defaultPadding}: meshBoxProps): meshBoxR => {
  let upper: vertexR = vertices[0]
  let lower: vertexR = vertices[0]
  let right: vertexR = vertices[0]
  let left: vertexR = vertices[0]

  const setExtremes = () => {
    vertices.forEach(vertex => {
      const vertexCoord: vertexI = vertex.getVertex()
      if(vertexCoord.y < upper.getVertex().y) upper = vertex
      if(vertexCoord.y > lower.getVertex().y) lower = vertex
      if(vertexCoord.x > right.getVertex().x) right = vertex
      if(vertexCoord.x < left.getVertex().x) left = vertex
    })
  }

  const createMeshBox = (): meshR => {
    if(vertices.length === 1) {
      return mesh({verticesData:[[vertices[0].getVertex().x, vertices[0].getVertex().y]], trianglesData:[], edgesData:[]})
    }
    setExtremes()
    const verticesData: vertexDataT[] = [
      [left.getVertex().x - padding.left, upper.getVertex().y - padding.top], // A
      [right.getVertex().x + padding.right, upper.getVertex().y - padding.top], // B
      [right.getVertex().x + padding.right, lower.getVertex().y + padding.bottom], // C
      [left.getVertex().x - padding.left, lower.getVertex().y + padding.bottom], // D
    ]
    const trianglesData: triangleDataT[] = [
      [verticesData[0], verticesData[1], verticesData[2]], // A B C
      [verticesData[0], verticesData[2], verticesData[3]] // A D C
    ]
    const edgesData: edgeDataT[] = [
      [verticesData[0], verticesData[1]],
      [verticesData[1], verticesData[2]],
      [verticesData[2], verticesData[3]],
      [verticesData[3], verticesData[0]],
      [verticesData[0], verticesData[2]],
    ]
    return mesh({verticesData, trianglesData, edgesData})
  }
  let _meshBox: meshR = createMeshBox()

  const update = (): void => {
    setExtremes()
    const upperLeftVertex: vertexR = findDirection("upperLeft")
    const upperRightVertex: vertexR = findDirection("upperRight")
    const lowerLeftVertex: vertexR = findDirection("lowerLeft")
    const lowerRightVertex: vertexR = findDirection("lowerRight")
    upperLeftVertex.setVertex({x:left.getVertex().x, y:upper.getVertex().y})
    upperRightVertex.setVertex({x:right.getVertex().x, y:upper.getVertex().y})
    lowerLeftVertex.setVertex({x:left.getVertex().x, y:lower.getVertex().y})
    lowerRightVertex.setVertex({x:right.getVertex().x, y:lower.getVertex().y})
  }

  const getVertexFurthestAwayFrom = (vector: vectorI): vertexR => {
    return _meshBox.getVertices().reduce((prevVertex, curVertex) => {
      const prevDistanceToPoint: number = distanceOfTwoPoints({pointA: vector, pointB:prevVertex.getVertex()})
      const curDistanceToPoint: number = distanceOfTwoPoints({pointA: vector, pointB:curVertex.getVertex()})
      return prevDistanceToPoint < curDistanceToPoint ? curVertex : prevVertex
    })
  }

  const findDirection = (directionToSearch: "upperLeft" | "upperRight" | "lowerLeft" | "lowerRight") => {
    let vertexToReturn: vertexR = null
    _meshBox.getVertices().every(vertex => {
      if(getVertexDirection(vertex) === directionToSearch) {
        vertexToReturn = vertex
        return false
      }
      return true
    })
    return vertexToReturn
  }

  const getVertexDirection = (vertexToSearch: vertexR): string => {
    const verticesClone: vertexR[] = _.clone(_meshBox.getVertices())
    
    let isIn: boolean = false
    const upperLower: [number, number] = [0,0]
    const leftRight: [number, number] = [0,0]

    verticesClone.forEach((vertexToCheck, index) => {
      if(vertexToCheck.equals(vertexToSearch.getVertex())) {
        isIn = true
        return
      }
      if(vertexToCheck.getVertex().y < vertexToSearch.getVertex().y) {
        upperLower[0]++
      } else {
        upperLower[1]++
      }
      if(vertexToCheck.getVertex().x < vertexToSearch.getVertex().x) {
        leftRight[0]++
      } else {
        leftRight[1]++
      }
    })
    if(!isIn) {
      console.error("vertex was not found");
      return null
    }
    return (upperLower[0] < upperLower[1] ? "upper" : "lower") + (leftRight[0] < leftRight[1] ? "Left" : "Right")
  }

  return {
    meshBox: _meshBox,
    update,
    getVertexFurthestAwayFrom,
    getVertexDirection,
    findDirection
  }
}

export default meshBox