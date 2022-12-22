import { sessionDataOriginInterface } from "../types"

const resetPerFrameVariables = (sessionData: sessionDataOriginInterface) => {
  sessionData.translateVector.x = 0
  sessionData.translateVector.y = 0
  sessionData.scalar = 1
}

export default resetPerFrameVariables