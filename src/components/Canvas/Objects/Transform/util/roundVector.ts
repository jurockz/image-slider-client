import { vectorI } from "../transformTypes";

const roundVector = (vector: vectorI, decimal: number): vectorI => {
  return {
    x: Number(vector.x.toFixed(decimal)),
    y: Number(vector.y.toFixed(decimal))
  }
}

export default roundVector