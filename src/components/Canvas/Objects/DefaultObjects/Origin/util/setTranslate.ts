import { vectorI } from "../../../Transform/transformTypes"
import handleTranslateBoundaries from "./handleTranslateBoundaries"
import { changeTranslateProps } from "./originUtilTypes"

const defaultTranslateTo: vectorI = {x: 0, y: 0}

// changes translate- and displacementvector accordingly to translateFrom and translateTo
const setTranslate = ({displacementVector, translateVector, scalarSum, canvasStyleScale, translateFrom=defaultTranslateTo, translateTo}: changeTranslateProps) => {
  translateVector.x = (translateTo.x - translateFrom.x)/scalarSum
  translateVector.y = (translateTo.y - translateFrom.y)/scalarSum

  // Handle Grid Boundaries
  const {x, y} = handleTranslateBoundaries({displacementVector, translateVector:translateVector, scalarSum, canvasStyleScale})

  translateVector.x = x
  translateVector.y = y

  displacementVector.x += translateVector.x * scalarSum
  displacementVector.y += translateVector.y * scalarSum
}

export default setTranslate