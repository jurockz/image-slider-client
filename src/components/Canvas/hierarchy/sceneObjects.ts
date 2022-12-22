import { objectR } from "../Objects/objectTypes"
import { deleteSceneObjectByProps, filterProps_ROO, getAllFilteredByProps, getSceneObjectByProps, hierarchyDataObjectI, sceneObjectsR, sortByProps } from "./hierarchyTypes"
import objectTypes from "./objectTypes"

const sceneObejcts = (): sceneObjectsR => {
  const _sceneObjects: objectR[] = []
  
  const add = (hierarchyDataObject: hierarchyDataObjectI): objectR => {
    const objectToAdd: objectR = objectTypes[hierarchyDataObject.type]({hierarchyDataObject, sceneObjects:sceneObjectsReturn})
    const newLength: number = _sceneObjects.push(objectToAdd)
    return _sceneObjects[newLength - 1]
  }

  const deleteBy = ({name}: deleteSceneObjectByProps) => {
    const sceneObjectsIndex: number = _sceneObjects.map(object => object.getData().name).indexOf(name)
    _sceneObjects[sceneObjectsIndex].getData().objectTransform.getRelation().getParents().forEach(parent => {
      getSceneObjectBy({name:parent}).getData().objectTransform.getRelation().removeChildBy({name})
    })
    if(sceneObjectsIndex > -1) _sceneObjects.splice(sceneObjectsIndex, 1)
  }

  const getSceneObjectBy = ({name}: getSceneObjectByProps): objectR => {
    return _sceneObjects.find(object => object.getData().name === name)
  }

  const getAll = (): objectR[] => {
    return _sceneObjects
  }

  const getAllFilteredBy = ({includes, excludes}: getAllFilteredByProps) => {
    let filteredObjects = _sceneObjects
    if(includes) filteredObjects = filter({...includes, toFilter:filteredObjects, includeOrExclude: true})
    if(excludes) filteredObjects = filter({...excludes, toFilter:filteredObjects, includeOrExclude: false})
    return filteredObjects
  }

  const filter = ({toFilter, includeOrExclude, names, types, zIndexRange}: filterProps_ROO) => {
    return toFilter.filter(objectToFilter => {
      const filters: boolean[] = []
      // Names
      if(names) filters.push(names.includes(objectToFilter.getData().name))
      // Types
      if(types) filters.push(types.includes(objectToFilter.getData().type))
      // zIndex Range
      if(zIndexRange) filters.push(zIndexRange[0] <= objectToFilter.getZIndex() && objectToFilter.getZIndex() <= zIndexRange[1])
      const isOK = filters.reduce((previous, current) => {
        return previous || current
      })
      return includeOrExclude ? isOK : !isOK
    })
  }

  const sortBy = ({zIndex}: sortByProps): void => {
    if(zIndex) _sceneObjects.sort((aObject, bObject) => aObject.getZIndex() - bObject.getZIndex())
  }

  const sceneObjectsReturn: sceneObjectsR = {
    add,
    deleteBy,
    getSceneObjectBy,
    getAll,
    sortBy,
    getAllFilteredBy
  }

  return sceneObjectsReturn
}

export default sceneObejcts