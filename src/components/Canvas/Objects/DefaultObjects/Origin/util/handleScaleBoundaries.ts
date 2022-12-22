import { scaleI, vectorI } from "../../../Transform/transformTypes"
import { originDataInterface } from "../types"
import adjustToScalarSum from "./adjustToScalarSum"

const handleScaleBoundaries = (originData: originDataInterface,translateVector: vectorI) => {
  const {specificData, sessionData} = originData
  const scalarSum: number = specificData.scalarSum
  const displacementVector: vectorI = specificData.displacementVector
  const gridScaleWithScalar: scaleI = {
    width: adjustToScalarSum(8000, scalarSum), 
    height: adjustToScalarSum(8000, scalarSum)
  }
  const futureGridScaleWithScalar: scaleI = {
    width: gridScaleWithScalar.width * sessionData.mouse.scale, 
    height: gridScaleWithScalar.height * sessionData.mouse.scale
  }
  // boundaryChecks
  // -The scaling factor makes the grid smaller than the window
  const windowBoundaryX = futureGridScaleWithScalar.width < sessionData.canvasStyleScale.width
  const windowBoundaryY = futureGridScaleWithScalar.height < sessionData.canvasStyleScale.height
  // -The scaling factor makes the grid smaller than the window + displacement vector
  const windowAndDisplacementBoundaryX = futureGridScaleWithScalar.width < -(displacementVector.x + translateVector.x) + sessionData.canvasStyleScale.width
  const windowAndDisplacementBoundaryY = futureGridScaleWithScalar.height < -(displacementVector.y + translateVector.y) + sessionData.canvasStyleScale.height

  if(windowBoundaryX || windowBoundaryY) {
    const scalarX = sessionData.canvasStyleScale.width/gridScaleWithScalar.width
    const scalarY = sessionData.canvasStyleScale.height/gridScaleWithScalar.height
    if(windowBoundaryX && windowBoundaryY) {
      // search for biggest scaling factor
      sessionData.scalar = scalarX < scalarY ? scalarY : scalarX
      // set translate so that displacement vector equals zero
      translateVector.x = -displacementVector.x/scalarSum
      translateVector.y = -displacementVector.y/scalarSum
    } else if(windowBoundaryX && !windowBoundaryY) {
      // search for biggest scaling factor
      sessionData.scalar = scalarX
      // set translate so that displacement vector equals zero
      translateVector.x = -displacementVector.x/scalarSum
    } else if (!windowBoundaryX && windowBoundaryY) {
      // search for biggest scaling factor
      sessionData.scalar = scalarY
      // set translate so that displacement vector equals zero
      translateVector.y = -displacementVector.y/scalarSum
    }
  } else if(windowAndDisplacementBoundaryX || windowAndDisplacementBoundaryY) {
    if(windowAndDisplacementBoundaryX) {
      translateVector.x = -futureGridScaleWithScalar.width - displacementVector.x + sessionData.canvasStyleScale.width
    }
    if(windowAndDisplacementBoundaryY) {
      translateVector.y = -futureGridScaleWithScalar.height - displacementVector.y + sessionData.canvasStyleScale.height
    }
  }
}

export default handleScaleBoundaries