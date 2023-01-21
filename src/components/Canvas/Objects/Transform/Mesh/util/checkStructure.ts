import _ from "lodash"
import { scalePcI, vectorI } from "../../transformTypes"
import roundVector from "../../util/roundVector"
import { vertexI, vertexR } from "../../Vertex/types"

const checkStructure = (originVertex: vectorI, vertices: vertexR[], percentageScale: scalePcI): boolean => {
  const verticesToCheck: vectorI[] = []
  vertices.forEach(vertexToScale => {
    const vertexToScaleCoord: vertexI = _.cloneDeep(vertexToScale.getVertex())
    const vertexRelativeToOrigin = {
      x: vertexToScaleCoord.x - originVertex.x,
      y: vertexToScaleCoord.y - originVertex.y
    }
    const moveVector: vectorI = {
      x: -(percentageScale.xPc * vertexRelativeToOrigin.x),
      y: -(percentageScale.yPc * vertexRelativeToOrigin.y)
    }
    
    verticesToCheck.push(roundVector({
      x: vertexToScaleCoord.x + moveVector.x,
      y: vertexToScaleCoord.y + moveVector.y
    }, 6))
  })
  
  for(let i = 0; i < verticesToCheck.length - 1; i++) {
    const vectorToCheck: vectorI = verticesToCheck.shift()
    const vectorFound: vectorI = verticesToCheck.find(vector => vector.x === vectorToCheck.x && vector.y === vectorToCheck.y)
    if(Boolean(vectorFound)) {
      return false
    }
  }
  return true
}

export default checkStructure