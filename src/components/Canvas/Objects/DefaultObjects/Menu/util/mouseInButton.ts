import { transformR, vectorI } from "../../../Transform/transformTypes";
import { vertexI } from "../../../Transform/Vertex/types";

const mouseInButton = (
  mouseVector: vectorI,
  buttons: string[],
  objectTransform: transformR
) => {
  const menuOrigin: vertexI = objectTransform.getOrigin().getVertex();
  for (let i = 0; i < buttons.length; i++) {
    if (
      menuOrigin.y + 40 + 50 * i < mouseVector.y &&
      mouseVector.y < menuOrigin.y + 40 + 50 * (i + 1)
    )
      return buttons[i];
  }
};

export default mouseInButton;
