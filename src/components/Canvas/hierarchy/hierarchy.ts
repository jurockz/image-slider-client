import hierarchyData from "./hierarchyData"
import objectTypes from "./objectTypes"
import _ from "lodash"
import { hierarchyDataObjectI, hierarchyR, sceneObjectsR } from "./hierarchyTypes"
import { objectR } from "../Objects/objectTypes"
import sceneObejcts from "./sceneObjects"

const hierarchy = (canvas: HTMLCanvasElement): hierarchyR => {

  const _sceneObjects: sceneObjectsR = sceneObejcts()

  const addObject = (hierarchyDataObject: hierarchyDataObjectI): objectR => {
    const addedSceneObject: objectR = _sceneObjects.add(objectTypes[hierarchyDataObject.type]({hierarchyDataObject, sceneObjects:_sceneObjects}))
    return addedSceneObject
  }

  const deleteObject = (objectName: string) => {
    _sceneObjects.deleteBy({name:objectName})
  }

  const intantiateSceneObjects = (): sceneObjectsR => {
    // add all objects from hierarchy to 
    Object.keys(hierarchyData).forEach(objectName => {
      const hierarchyDataObject: hierarchyDataObjectI = _.cloneDeep(hierarchyData[objectName])
      hierarchyDataObject.name = objectName
      if(hierarchyDataObject.type === "origin") {
        hierarchyDataObject.specific.canvasHeight = canvas.offsetHeight
        hierarchyDataObject.specific.canvasWidth = canvas.offsetWidth
      }

      _sceneObjects.add(hierarchyDataObject)
    })
    
    // sort by z-index
    _sceneObjects.sortBy({zIndex:true})
    return _sceneObjects
  }

  const getSceneObjects = (): sceneObjectsR => {
    return _sceneObjects
  }

  return {
    getSceneObjects,
    intantiateSceneObjects,
    addObject,
    deleteObject
  }
}

export default hierarchy