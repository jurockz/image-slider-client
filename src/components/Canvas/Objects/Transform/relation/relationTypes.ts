import { originR } from "../origin/originTypes"
import { transformR, vectorI } from "../transformTypes"

interface relationProps {
  objectName: string,
  parents?: string[],
  children?: transformR[]
}

interface relationR {
  moveChildren: ({x, y}: vectorI) => void,
  scaleChildren: ({scaleOrigin, from, to}) => void,
  setChildren: (childrenToSet: transformR[]) => void,
  addParent: (parentToAdd: string) => void,
  removeParent: (parentToRemove: string) => void,
  removeChildBy: ({name}: removeChildByProps) => void
  getChildren: () => transformR[],
  getParents: () => string[],
  resetChildren: () => void,
  resetParents: () => void
}

interface scaleChildrenProps {
  scaleOrigin: originR,
  from: vectorI,
  to: vectorI
}

interface removeChildByProps {
  name: string
}

export {
  relationProps,
  relationR,
  scaleChildrenProps,
  removeChildByProps
}