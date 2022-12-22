import { scaleI } from "../../../Transform/transformTypes";
import { colorI } from "../../../GeneralObjectUtil/generalObjectUtilTypes";

interface renderGridProps {
  ctx: CanvasRenderingContext2D;
  cellSize: number;
  scale: scaleI;
  color: colorI;
  scalarSum: number;
}

export { renderGridProps };
