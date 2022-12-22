import { transformR, vectorI } from "../transformTypes"
import { relationProps, relationR, removeChildByProps } from "./relationTypes"

const relation = ({objectName, parents=[], children=[]}: relationProps): relationR => {

  const moveChildren = ({x, y}: vectorI): void => {
    children.forEach(child => {
      child.moveObject({x, y})
    })
  }

  const scaleChildren = ({scaleOrigin, from, to}) => {
    children.forEach(child => {
      child.scaleObject({from, to, scaleOrigin}) 
    })
  }

  const setChildren = (childrenToSet: transformR[]): void => {
    // remove all parents from previous children
    children.forEach(child => {
      child.getRelation().removeParent(objectName)
    })
    // set children 
    children = childrenToSet.filter(child => {
      if(child.getObjectName() !== objectName) return child
      console.error("No circular relations allowed: " + objectName);
    })
    // add all parents to children
    children.forEach(child => {
      child.getRelation().addParent(objectName)
    })
  }

  const addParent = (parentToAdd: string): void => {
    parents.push(parentToAdd)
  }

  const removeParent = (parentToRemove: string): void => {
    parents = parents.filter(parent => parent !== parentToRemove)
  }
  
  const removeChildBy = ({name}: removeChildByProps): void => {
    children = children.filter(child => child.getObjectName() !== name)
  }

  const getChildren = (): transformR[] => {
    return children
  }

  const getParents = (): string[] => {
    return parents
  }

  const resetChildren = (): void => {
    children = []
  }

  const resetParents = (): void => {
    parents = []
  }

  return {
    moveChildren,
    scaleChildren,
    setChildren,
    addParent,
    removeParent,
    removeChildBy,
    getChildren,
    getParents,
    resetChildren,
    resetParents
  }
}

export default relation