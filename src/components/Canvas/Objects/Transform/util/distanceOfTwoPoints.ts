import { vectorI } from "../transformTypes"

const distanceOfTwoPoints = ({pointA, pointB}: {pointA: vectorI, pointB: vectorI}) => {
  return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2) )
}

export default distanceOfTwoPoints