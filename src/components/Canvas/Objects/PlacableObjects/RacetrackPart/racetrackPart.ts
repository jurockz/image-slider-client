import { hierarchyDataObjectI, sceneObjectsR } from "../../../hierarchy/hierarchyTypes";
import { getMouseR, inputSystemR } from "../../../InputSystem/inputTypes";
import { getDataR, objectProps, objectR, renderProps, updateProps } from "../../objectTypes";
import transform from "../../Transform/transform";
import { transformR, vectorI } from "../../Transform/transformTypes";
import {
  racetrackPartSessionDataI,
  racetrackPartSpecificDataI,
  rtImageI,
} from "./racetrackPartTypes";
import getRtImage from "./util/getRtImage";

const racetrackPart = (objectProps: objectProps): objectR => {
  const hierarchyDataObject: hierarchyDataObjectI =
    objectProps.hierarchyDataObject;
  const sceneObjects: sceneObjectsR = objectProps.sceneObjects;
  const name: string = hierarchyDataObject.name;
  const type: string = hierarchyDataObject.type;
  const objectTransform: transformR = transform({
    ...hierarchyDataObject.transform,
    objectName: name,
    sceneObjects: sceneObjects,
  });
  const _zIndex: number = hierarchyDataObject.zIndex;
  const specificData: racetrackPartSpecificDataI = {
    objectIsSet: objectProps.hierarchyDataObject.specific.objectIsSet,
    rtName: objectProps.hierarchyDataObject.specific.rtName
  };
  const sessionData: racetrackPartSessionDataI = {
    firstRender: true,
    isMouseReleasedTrigger: true
  };
  const transferFunctions = {};

  const getData = (): getDataR => {
    return {
      name,
      type,
      objectTransform,
      specificData,
      sessionData,
      transferFunctions,
    };
  };

  const getZIndex = (): number => {
    return _zIndex;
  };

  const start = () => {
    const imageData: rtImageI = getRtImage(specificData.rtName)
    const origin: vectorI = objectTransform.getOrigin().getVertex()
    const scaleTo: vectorI = {
      x: origin.x + imageData.imgWidth,
      y: origin.y + imageData.imgHeight
    }
    objectTransform.scaleObjectTo({to:scaleTo})
  };

  // update get called 24 fps
  const update = (props: updateProps) => {
    const inputSystem: inputSystemR = props.InputSystem
    const originObject: objectR = sceneObjects.getSceneObjectBy({
      name: "sceneOrigin",
    });
    const mouse: getMouseR = inputSystem.getMouse();
    const gridMouseVector: vectorI = originObject
      .getData()
      .transferFunctions.canvasVectorToGridVector(
        mouse.mouseData.mouseVector
      );
    if(!specificData.objectIsSet) {
      objectTransform.setObjectTo({x:gridMouseVector.x, y:gridMouseVector.y})
    }
    // left mouse button is pressed
    const leftMouseButtonIsPressed: boolean =
      mouse.mouseData.isPressed && mouse.mouseData.button === 0;
    if(leftMouseButtonIsPressed) {
      sessionData.isMouseReleasedTrigger = false;
    }

    // left mouse button is not pressed & mouse release was not triggered yet
    if (!leftMouseButtonIsPressed && !sessionData.isMouseReleasedTrigger) {
      specificData.objectIsSet = true
      props.setMenuBtn("pointer")
      // mouse release was triggered => set true till next click
      sessionData.isMouseReleasedTrigger = true;
    }
  };

  // update get called 24 fps
  const render = (props: renderProps) => {
    const ctx: CanvasRenderingContext2D = props.ctx
    const rtOrigin: vectorI = objectTransform.getOrigin().getVertex()
    const imageData: rtImageI = getRtImage(specificData.rtName)
    ctx.drawImage(imageData.image, rtOrigin.x, rtOrigin.y, imageData.imgWidth, imageData.imgHeight)
  };

  return {
    getData,
    getZIndex,
    start,
    update,
    render,
  };
};

export default racetrackPart;
