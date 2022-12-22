import { getMouseR, inputSystemR } from "../../../../InputSystem/inputTypes"
import { vectorI } from "../../../Transform/transformTypes"
import { originDataInterface } from "../types"
import handleScaleBoundaries from "./handleScaleBoundaries"
import setTranslate from "./setTranslate"

const handleMouseScaleUpdate = (originData: originDataInterface, inputSystem: inputSystemR, oldMouse: getMouseR) => {
  const {specificData, sessionData} = originData
  const displacementVector: vectorI = specificData.displacementVector
  // if no mouse scale happend from this to the last frame then stop scaling
  if(oldMouse.scale === sessionData.mouse.scale) {
    inputSystem.resetMouseWheel()
    sessionData.mouse.scale = 1
  }
  // is scaled?
  if(sessionData.mouse.scale !== 1) {
    sessionData.scalar = sessionData.mouse.scale
    
    // Where is mouse in displaced Canvas?
    const canvas_mouse_vector: vectorI = {
      x: sessionData.mouse.mouseData.mouseVector.x - displacementVector.x,
      y: sessionData.mouse.mouseData.mouseVector.y - displacementVector.y
    }

    // Where is mouse in scaled Canvas? 
    const scalar_mouse_vector: vectorI = {
      x: canvas_mouse_vector.x * sessionData.scalar,
      y: canvas_mouse_vector.y * sessionData.scalar
    }

    const translateVector: vectorI = {
      x: -scalar_mouse_vector.x + canvas_mouse_vector.x,
      y: -scalar_mouse_vector.y + canvas_mouse_vector.y
    }

    handleScaleBoundaries({specificData, sessionData}, translateVector)

    setTranslate({
      displacementVector:specificData.displacementVector, 
      translateVector:sessionData.translateVector, 
      scalarSum:specificData.scalarSum, 
      canvasStyleScale:sessionData.canvasStyleScale, 
      translateTo:translateVector
    })

    // new scalar sum
    specificData.scalarSum *= sessionData.scalar
  }
}

export default handleMouseScaleUpdate