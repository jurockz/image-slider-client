import { crossProductProps } from "../transformTypes"

const crossProduct = ({vectorA, vectorB}: crossProductProps) => {
  return vectorA.x * vectorB.y - vectorA.y * vectorB.x
}

export default crossProduct