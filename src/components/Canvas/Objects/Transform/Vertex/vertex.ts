import _ from "lodash"
import { vectorI } from "../transformTypes"
import { setVertexPropsAtLeastOne, vertexDataT, vertexI, vertexProps, vertexR } from "./types"


// Data in [x,y]
const vertex = ({vertexData}: vertexProps): vertexR => {
  const _vertex: vertexI = {
    x: vertexData[0],
    y: vertexData[1]
  }
  const visible = true
  
  const getVertex = () => {
    return _vertex
  }

  const getVertexData = (): vertexDataT => {
    return [_vertex.x, _vertex.y]
  }

  const setVertex = ({x=_vertex.x, y=_vertex.y}: setVertexPropsAtLeastOne) => {
    _vertex.x = x,
    _vertex.y = y
  }

  const moveVertex = ({x, y}: vectorI) => {
    _vertex.x += x
    _vertex.y += y
  }

  const equals = ({x, y}: vertexI ) => {

    return _vertex.x === x && _vertex.y === y
  }

  return {
    getVertex,
    getVertexData,
    setVertex,
    moveVertex,
    equals
  }
}

export default vertex