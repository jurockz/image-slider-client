import {
  hierarchyDataObjectI,
  sceneObjectsR,
} from "../../../hierarchy/hierarchyTypes";
import { getDataR, objectProps, objectR } from "../../objectTypes";
import transform from "../../Transform/transform";
import { transformR, vectorI } from "../../Transform/transformTypes";
import {
  roomSessionDataInterface,
  roomSpecificDataInterface,
} from "./roomTypes";
import crossImagePath from "../../../../../assets/images/cross.png";
import roomCreater from "./roomCreater/roomCreater";
import createColor from "../../GeneralObjectUtil/render/createColor";
import { colorI } from "../../GeneralObjectUtil/generalObjectUtilTypes";
import { getMouseR, inputSystemR } from "../../../InputSystem/inputTypes";

const room = (objectProps: objectProps): objectR => {
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
  const specificData: roomSpecificDataInterface = {
    objectIsSet: objectProps.hierarchyDataObject.specific.objectIsSet,
  };
  const sessionData: roomSessionDataInterface = {
    firstRender: true,
    crossImage: new Image(),
    _roomCreater: roomCreater(objectTransform),
    isMouseReleasedTrigger: false,
    mouseIsInRoom: false,
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
    sessionData.crossImage.src = crossImagePath;
  };

  // update get called 24 fps
  const update = (inputSystem: inputSystemR) => {
    const originObject: objectR = sceneObjects.getSceneObjectBy({
      name: "sceneOrigin",
    });
    const mouse: getMouseR = inputSystem.getMouse();
    const gridMouseVector: vectorI = originObject
      .getData()
      .transferFunctions.canvasVectorToGridVector(
        mouse.mouseData.mouseVector
      );
    const gridMousePressedAtVector: vectorI = originObject
      .getData()
      .transferFunctions.canvasVectorToGridVector(
        mouse.mouseData.pressedAtVector
      );
    sessionData.mouseIsInRoom = Boolean(mouse.mouseData.mouseAt[name]);

    // mouse is in menu => set cursor to default
    const mouseIsInMenu: boolean = Boolean(
      mouse.mouseData.mouseAt["sceneMenu"]?.mesh.isInTriangle
    );
    if (mouseIsInMenu) {
      inputSystem.changeCursorTo(name, "default");
    } else if (!specificData.objectIsSet) {
      // Mouse is in creation & not in menu set to cross
      inputSystem.changeCursorTo(name, "crosshair");
    }
    // only make room when mouse is pressed in grid
    const mouseIsNotPressedInMenu: boolean = !Boolean(
      mouse.mouseData.pressedAt["sceneMenu"]?.mesh.isInTriangle
    );
    // left mouse button is pressed
    const leftMouseButtonIsPressed: boolean =
      mouse.mouseData.isPressed && mouse.mouseData.button === 0;
    if (mouseIsNotPressedInMenu && leftMouseButtonIsPressed) {
      // if room is not set yet => update data needed for setting the room
      if (!specificData.objectIsSet) {
        sessionData._roomCreater.calculateRoom({
          selectionStartGridVector: gridMousePressedAtVector,
          mouseGridVector: gridMouseVector,
        });
      }

      sessionData.isMouseReleasedTrigger = false;
    }

    // left mouse button is not pressed & mouse release was not triggered yet
    if (!leftMouseButtonIsPressed && !sessionData.isMouseReleasedTrigger) {
      // roomCreater | if the creation is allowed ? set finished : set creating to false and start creation from beginning
      if (
        sessionData._roomCreater.getIsCreating() &&
        sessionData._roomCreater.getCreationAllowed()
      ) {
        sessionData._roomCreater.setRoomFinished();
        specificData.objectIsSet = sessionData._roomCreater.getIsCreated();
        inputSystem.changeCursorTo(name, "default");
      } else if (sessionData._roomCreater.getIsCreating()) {
        sessionData._roomCreater.resetCreation();
      }

      // mouse release was triggered => set true till next click
      sessionData.isMouseReleasedTrigger = true;
    }
  };

  // update get called 24 fps
  const render = (ctx: CanvasRenderingContext2D) => {
    if (
      sessionData._roomCreater.getIsCreating() ||
      sessionData._roomCreater.getIsCreated()
    ) {
      const color: colorI = !sessionData._roomCreater.getCreationAllowed()
        ? createColor(214, 100, 92)
        : createColor(130, 130, 130);
      const textColor: colorI = createColor(255, 255, 255);

      // Draw room
      objectTransform
        .getShader()
        .renderMesh({
          ctx,
          filled: true,
          fillColor: color.alpha(0.1),
          stroke: true,
          strokeColor: color,
          lineWidth: 4
        });
    }
  };

  return {
    getData,
    getZIndex,
    start,
    update,
    render,
  };
};

export default room;
