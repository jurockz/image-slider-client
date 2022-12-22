import distanceOfTwoVertices from "../../util/distanceOfTwoVertices"
import pointBetweenTwoPoints from "../../util/pointBetweenTwoPoints"
import { vertexI } from "../../Vertex/types"
import { calculateCornerRadiusPositionProps } from "./shaderUtilTypes"

const calculateCornerRadiusPosition = ({vertexA, vertexB, cornerRadius}: calculateCornerRadiusPositionProps): vertexI => {
  const vertexAPos: vertexI = vertexA.getVertex()
  const vertexBPos: vertexI = vertexB.getVertex()
  return pointBetweenTwoPoints({startVector:vertexAPos, endVector:vertexBPos, distance: cornerRadius})
}

export default calculateCornerRadiusPosition