import adjustToScalarSum from "./adjustToScalarSum"
import _ from "lodash"
import { handleTranslateBoundariesProps } from "./originUtilTypes"
import { scaleI, vectorI } from "../../../Transform/transformTypes"

const handleTranslateBoundaries = ({displacementVector, translateVector, scalarSum, canvasStyleScale}: handleTranslateBoundariesProps): vectorI => {
  const newTranslateVector = _.cloneDeep(translateVector)
  const futureDisplacementVector: vectorI = {
    x: displacementVector.x + translateVector.x * scalarSum,
    y: displacementVector.y + translateVector.y * scalarSum
  }

  const gridScaleWithScalar: scaleI = {
    width: adjustToScalarSum(8000, scalarSum), 
    height: adjustToScalarSum(8000, scalarSum)
  }
  // Boundarys | if goes over x = 0 or y = 0 then displace so that its 0 
  if(futureDisplacementVector.x > 0) newTranslateVector.x = -(displacementVector.x/scalarSum)
  if(futureDisplacementVector.y > 0) newTranslateVector.y = -(displacementVector.y/scalarSum)
  // Boundarys | if goes over width or height of grid then displace seam it with width or height
  if(gridScaleWithScalar.width < -futureDisplacementVector.x + canvasStyleScale.width) {
    newTranslateVector.x = -gridScaleWithScalar.width - displacementVector.x + canvasStyleScale.width
  }
  if(gridScaleWithScalar.height < -futureDisplacementVector.y + canvasStyleScale.height) {
    newTranslateVector.y = -gridScaleWithScalar.height - displacementVector.y + canvasStyleScale.height
  }
  return newTranslateVector
}

export default handleTranslateBoundaries