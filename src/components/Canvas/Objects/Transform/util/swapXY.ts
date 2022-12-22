import { vectorI } from "../transformTypes";

const swapXY = (vector: vectorI): vectorI => {
  return {
    x: vector.y,
    y: vector.x
  }
}

export default swapXY