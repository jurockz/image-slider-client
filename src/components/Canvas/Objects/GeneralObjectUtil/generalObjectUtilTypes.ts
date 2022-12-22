import { scaleI, vectorI } from "../Transform/transformTypes";

interface pointInRectProps {
  point: vectorI;
  rectPos: vectorI;
  rectScale: scaleI;
}

interface colorI {
  r: number;
  g: number;
  b: number;
  a: number;
  colorString: string;
  alpha?: (alpha: number) => colorI;
}

export { pointInRectProps, colorI };
