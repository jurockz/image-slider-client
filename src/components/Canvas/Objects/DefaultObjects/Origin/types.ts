import { getMouseR } from "../../../InputSystem/inputTypes"
import { scaleI, vectorI } from "../../Transform/transformTypes"

interface specificDataOriginInterface {
  scalarSum: number,
  displacementVector: vectorI
}

interface sessionDataOriginInterface {
  firstRender: boolean,
  canvasStyleScale: scaleI,
  mouse: getMouseR,
  scalar: number,
  translateVector: vectorI,
  lastMouseVector: vectorI,
  isMouseReleasedTrigger: boolean
}

interface originTransferFunctionsInterface {
  canvasVectorToGridVector: (location: vectorI, withoutScalarSum?: boolean) => vectorI,
  drawInDefaultGrid: (ctx: CanvasRenderingContext2D, callback: () => void) => void
}

interface originDataInterface {
  specificData: specificDataOriginInterface,
  sessionData: sessionDataOriginInterface
}

export {
  specificDataOriginInterface,
  sessionDataOriginInterface,
  originDataInterface,
  originTransferFunctionsInterface
}