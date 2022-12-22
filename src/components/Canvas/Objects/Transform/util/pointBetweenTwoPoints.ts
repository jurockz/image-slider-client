import { vectorI } from "../transformTypes"
import distanceOfTwoPoints from "./distanceOfTwoPoints"

const pointBetweenTwoPoints = ({startVector, endVector, distance}: {startVector: vectorI, endVector: vectorI, distance: number}): vectorI => {
  const distanceAB: number = distanceOfTwoPoints({pointA:startVector, pointB:endVector})
  const abVector: vectorI = {
    x: endVector.x - startVector.x,
    y: endVector.y - startVector.y
  }
  return {
    x: startVector.x + ((abVector.x * distance)/distanceAB),
    y: startVector.y + ((abVector.y * distance)/distanceAB)
  }
}

export default pointBetweenTwoPoints