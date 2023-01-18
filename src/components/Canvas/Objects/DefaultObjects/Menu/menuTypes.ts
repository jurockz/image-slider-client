import { objectR } from "../../objectTypes"

interface isInCreationReturn {
  isInCreation: boolean,
  activeButtonToPointer: boolean
}

interface objectCreaterReturn {
  createObject: (objectType: string) => string,
  isInCreation: (objectName: string) => isInCreationReturn,
  deleteObject: (objectName: string) => void
}

interface sessionDataMenu {
  firstRender: boolean,
  _mouseInButton: string,
  _menuIcons: { getIcon: (imageName: string, selected: boolean) => any },
  objectCreater: objectCreaterReturn,
  objectInCreation: objectR,
  actionOfIconExecuted: boolean
}

export {
  objectCreaterReturn,
  isInCreationReturn,
  sessionDataMenu
}