import { roomCreaterReturn } from "./roomCreater/roomCreaterTypes"

interface roomSpecificDataInterface {
  objectIsSet: boolean
}

interface roomSessionDataInterface {
  firstRender: boolean,
  _roomCreater: roomCreaterReturn,
  isMouseReleasedTrigger: boolean,
  mouseIsInRoom: boolean
}

export {
  roomSpecificDataInterface,
  roomSessionDataInterface,
}