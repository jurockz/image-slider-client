import { pointColliderDataI } from "../Objects/Transform/collider/colliderTypes";
import { vectorI } from "../Objects/Transform/transformTypes";
import { timeInterface } from "../generalTypes";

interface getKeyR {
  pressed: boolean,
  key: string
}

interface getMouseR {
  mouseData: mouseDataI,
  scale: number
}

interface mouseDataI {
  mouseVector: vectorI,
  mouseAt: { [key: string]: pointColliderDataI },
  isPressed: boolean,
  pressedAt: { [key: string]: pointColliderDataI },
  pressedAtVector: vectorI,
  releasedAt: { [key: string]: pointColliderDataI },
  releasedAtVector: vectorI,
  button: number,
  time: timeInterface
}

interface inputSystemR {
  updateInputSystem: () => void,
  getMouse: () => getMouseR,
  getResize: () => any,
  resetMouseWheel: () => void,
  changeCursorTo: (whoWantstoChange: string, cursorName: string) => void,
  getKey: () => getKeyR
}

interface cursorLineI {
  changedBy: string,
  cursor: string
}

export {
  getKeyR,
  getMouseR,
  mouseDataI,
  inputSystemR,
  cursorLineI
}