import { scaleI, vectorI } from "../../../Transform/transformTypes";

interface handleTranslateBoundariesProps {
  displacementVector: vectorI;
  translateVector: vectorI;
  scalarSum: number;
  canvasStyleScale: scaleI;
}

interface changeTranslateProps {
  displacementVector: vectorI;
  translateVector: vectorI;
  scalarSum: number;
  canvasStyleScale: scaleI;
  translateFrom?: vectorI;
  translateTo: vectorI;
}

export { handleTranslateBoundariesProps, changeTranslateProps };
