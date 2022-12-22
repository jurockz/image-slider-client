import { calculateTrisAreaProps } from "../colliderTypes";

const calculateTrisArea = ({A, B, C}: calculateTrisAreaProps): number => {
  return  Math.abs(A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]))
}

export default calculateTrisArea