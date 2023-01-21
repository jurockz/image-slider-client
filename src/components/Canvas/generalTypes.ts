import { sceneObjectsR } from "./hierarchy/hierarchyTypes";
import { inputSystemR } from "./InputSystem/inputTypes";

interface timeInterface {
  start: number;
  end: number;
  differenceInSec: number;
}

interface rendererR {
  updateScene: (props: updateSceneProps) => void
}

interface updateSceneProps {
  activeMenuBtn: string,
  setMenuBtn: React.Dispatch<React.SetStateAction<string>>,
  isSceneObjects: sceneObjectsR,
  isCtx: CanvasRenderingContext2D,
  isInputSystem: inputSystemR

}

export {
  rendererR,
  timeInterface,
  updateSceneProps
};
