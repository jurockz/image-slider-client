import hierarchy from "./hierarchy/hierarchy";
import _ from "lodash";
import { hierarchyR, sceneObjectsR } from "./hierarchy/hierarchyTypes";
import { objectR } from "./Objects/objectTypes";
import inputSystem from "./InputSystem/inputSystem";
import { inputSystemR } from "./InputSystem/inputTypes";
import { rendererR } from "./generalTypes";

const renderer = (canvas: HTMLCanvasElement): rendererR => {
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
  const _hierarchy: hierarchyR = hierarchy(canvas);
  const sceneObjects: sceneObjectsR = _hierarchy.intantiateSceneObjects();
  let sceneAnimation: ReturnType<typeof setInterval> = null;
  const input: inputSystemR = inputSystem(canvas, _hierarchy);

  const updateScene = () => {
    // Prevent added Objects to be rendered before they are updated or started
    const renderPriorityListFrameClone: objectR[] = _.clone(sceneObjects.getAll())
    // UPDATE
    input.updateMouseLocation(); // update mouse location collision
    renderPriorityListFrameClone.forEach((objectToUpdate) => {
      if (objectToUpdate.getData().sessionData.firstRender) {
        objectToUpdate.start();
        // set first render false => start() only once per session
        objectToUpdate.getData().sessionData.firstRender = false;
      } else {
        objectToUpdate.update(input);
      }
    });
    // SORT Z INDEX
    sceneObjects.sortBy({ zIndex: true });
    // RENDER
    ctx.clearRect(-200, -200, 8000 + 400, 8000 + 400);
    renderPriorityListFrameClone.forEach((objectToRender) => {
      objectToRender.render(ctx);
    });
  };

  const renderScene = () => {
    console.log("RenderScene");
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    // saveHierarchyData(hierarchyData)
    return (sceneAnimation = setInterval(updateScene, 42));
  };

  return {
    renderScene
  };
};

export default renderer;
