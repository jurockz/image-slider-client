import {
  hierarchyDataObjectI,
  sceneObjectsR,
} from "../hierarchy/hierarchyTypes";
import { inputSystemR } from "../InputSystem/inputTypes";
import { transformR } from "./Transform/transformTypes";

interface objectProps {
  hierarchyDataObject: hierarchyDataObjectI;
  sceneObjects: sceneObjectsR;
}

interface getDataR {
  name: string;
  type: string;
  objectTransform: transformR;
  specificData: {
    [key: string]: any;
  };
  sessionData: {
    [key: string]: any;
  };
  transferFunctions: any;
}

interface objectR {
  getData: () => getDataR;
  getZIndex: () => number;
  start: () => void;
  update: (InputSystem: inputSystemR) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
}

export { objectProps, getDataR, objectR };
