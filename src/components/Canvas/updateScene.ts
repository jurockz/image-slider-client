import _ from "lodash";
import { objectR } from "./Objects/objectTypes";
import { updateSceneProps } from "./generalTypes";

const updateScene = (props: updateSceneProps): void => {
  // Prevent added Objects to be rendered before they are updated or started
  const renderPriorityListFrameClone: objectR[] = _.clone(props.isSceneObjects.getAll())
  // UPDATE
  props.isInputSystem.updateInputSystem(); // update mouse location collision
  renderPriorityListFrameClone.forEach((objectToUpdate) => {
    if (objectToUpdate.getData().sessionData.firstRender) {
      objectToUpdate.start();
      // set first render false => start() only once per session
      objectToUpdate.getData().sessionData.firstRender = false;
    } else {
      objectToUpdate.update({InputSystem:props.isInputSystem, activeMenuBtn:props.activeMenuBtn, setMenuBtn:props.setMenuBtn});
    }
  });
  // SORT Z INDEX
  props.isSceneObjects.sortBy({ zIndex: true });
  // RENDER
  props.isCtx.clearRect(-200, -200, 8000 + 400, 8000 + 400);
  renderPriorityListFrameClone.forEach((objectToRender) => {
    objectToRender.render({ctx:props.isCtx, activeMenuBtn:props.activeMenuBtn, setMenuBtn:props.setMenuBtn});
  });
}

export default updateScene;