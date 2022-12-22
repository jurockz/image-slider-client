import { pointInRectProps } from "../generalObjectUtilTypes"

const pointInRect = ({point, rectPos, rectScale}: pointInRectProps) => {
  return (rectPos.x < point.x && point.x < rectPos.x + rectScale.width) && (rectPos.y < point.y && point.y < rectPos.y + rectScale.height)
}

export default pointInRect