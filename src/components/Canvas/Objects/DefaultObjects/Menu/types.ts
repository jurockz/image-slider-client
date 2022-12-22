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

export {
  objectCreaterReturn,
  isInCreationReturn
}