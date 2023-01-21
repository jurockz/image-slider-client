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

interface updateProps {
  InputSystem: inputSystemR,
  activeMenuBtn: string,
  setMenuBtn: React.Dispatch<React.SetStateAction<string>>
}

interface renderProps {
  ctx: CanvasRenderingContext2D,
  activeMenuBtn: string,
  setMenuBtn: React.Dispatch<React.SetStateAction<string>>
}

interface objectR {
  getData: () => getDataR;
  getZIndex: () => number;
  start: () => void;
  update: (props: updateProps) => void;
  render: (props: renderProps) => void;
}

export { objectProps, getDataR, objectR, updateProps, renderProps };
