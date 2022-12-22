import _ from "lodash";
import {
  originTransferFunctionsInterface,
  sessionDataOriginInterface,
  specificDataOriginInterface,
} from "./types";
import handleMouseScaleUpdate from "./util/handleMouseScaleUpdate";
import resetPerFrameVariables from "./util/resetPerFrameVariables";
import transform from "../../Transform/transform";
import { getDataR, objectProps, objectR } from "../../objectTypes";
import {
  hierarchyDataObjectI,
  sceneObjectsR,
} from "../../../hierarchy/hierarchyTypes";
import setTranslate from "./util/setTranslate";
import { getMouseR, inputSystemR } from "../../../InputSystem/inputTypes";
import { vectorI } from "../../Transform/transformTypes";

const origin = (objectProps: objectProps): objectR => {
  const hierarchyDataObject: hierarchyDataObjectI =
    objectProps.hierarchyDataObject;
  const sceneObjects: sceneObjectsR = objectProps.sceneObjects;
  const name: string = hierarchyDataObject.name;
  const type: string = hierarchyDataObject.type;
  const objectTransform = transform({
    ...hierarchyDataObject.transform,
    objectName: name,
    sceneObjects: sceneObjects,
  });
  const _zIndex: number = hierarchyDataObject.zIndex;
  const specificData: specificDataOriginInterface = {
    scalarSum: hierarchyDataObject.specific.scalarSum
      ? hierarchyDataObject.specific.scalarSum
      : 1,
    displacementVector: hierarchyDataObject.specific.displacementVector
      ? hierarchyDataObject.specific.displacementVector
      : { x: 0, y: 0 },
  };
  const sessionData: sessionDataOriginInterface = {
    firstRender: true,
    canvasStyleScale: {
      width: objectProps.hierarchyDataObject.specific.canvasWidth,
      height: objectProps.hierarchyDataObject.specific.canvasHeight,
    },
    mouse: null,
    lastMouseVector: null,
    scalar: 1,
    translateVector: {
      x: 0,
      y: 0,
    },
    isMouseReleasedTrigger: false,
  };

  // transfer functions
  // transforms canvas vector to grid vector (scalarSum is not included here)
  const canvasVectorToGridVector = (
    location: vectorI,
    withoutScalarSum: boolean = true
  ): vectorI => {
    return {
      x:
        (location.x - specificData.displacementVector.x) /
        (withoutScalarSum ? specificData.scalarSum : 1),
      y:
        (location.y - specificData.displacementVector.y) /
        (withoutScalarSum ? specificData.scalarSum : 1),
    };
  };

  const drawInDefaultGrid = (
    ctx: CanvasRenderingContext2D,
    callback: () => void
  ) => {
    // scaleSum back to default = 1
    const toScale = 1 / specificData.scalarSum;
    ctx.scale(toScale, toScale);
    ctx.translate(
      -specificData.displacementVector.x,
      -specificData.displacementVector.y
    );
    // draw callback
    callback();
    // scaleSum back to scaleSum
    ctx.translate(
      specificData.displacementVector.x,
      specificData.displacementVector.y
    );
    ctx.scale(specificData.scalarSum, specificData.scalarSum);
  };

  const transferFunctions: originTransferFunctionsInterface = {
    canvasVectorToGridVector,
    drawInDefaultGrid,
  };

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

  // Object functions
  const start = () => {
    const scalarSum: number = specificData.scalarSum
    const displacementVector: vectorI = specificData.displacementVector
    setTranslate({
      displacementVector: specificData.displacementVector,
      translateVector: sessionData.translateVector,
      scalarSum: specificData.scalarSum,
      canvasStyleScale: sessionData.canvasStyleScale,
      translateTo: displacementVector,
    });
    sessionData.scalar = scalarSum
  };

  const update = (inputSystem: inputSystemR) => {
    const mouse: getMouseR = inputSystem.getMouse();
    // mouse in Menu?
    const mouseIsNotPressedInMenu: boolean = !Boolean(
      mouse.mouseData.pressedAt["sceneMenu"]?.mesh.isInTriangle
    );
    const mouseIsNotInMenu: boolean = !Boolean(
      mouse.mouseData.mouseAt["sceneMenu"]?.mesh.isInTriangle
    );
    // left mouse button is pressed => all selection interaction is with the left mouse button
    const middleMouseButtonIsPressed: boolean =
      mouse.mouseData.isPressed && mouse.mouseData.button === 1;

    const scalarSum: number = specificData.scalarSum;
    // Reset Variables used once per Frame
    resetPerFrameVariables(sessionData);

    // mouse null => init mouse
    if (!sessionData.mouse) {
      sessionData.mouse = inputSystem.getMouse();
    }

    // save mouse from last frame & init new mouse if not null
    const oldMouse: getMouseR = _.cloneDeep(sessionData.mouse);
    if (sessionData.mouse) {
      sessionData.mouse = inputSystem.getMouse();
    }

    // Positioning | if mouse is pressed
    if (middleMouseButtonIsPressed && mouseIsNotPressedInMenu) {
      // init lastMouseVector
      if (!sessionData.lastMouseVector) {
        sessionData.lastMouseVector = _.cloneDeep(
          mouse.mouseData.mouseVector
        );
      }

      setTranslate({
        displacementVector: specificData.displacementVector,
        translateVector: sessionData.translateVector,
        scalarSum,
        canvasStyleScale: sessionData.canvasStyleScale,
        translateFrom: sessionData.lastMouseVector,
        translateTo: mouse.mouseData.mouseVector,
      });

      sessionData.lastMouseVector = _.cloneDeep(
        mouse.mouseData.mouseVector
      );

      sessionData.isMouseReleasedTrigger = false;
    }

    // Scaling
    if (mouseIsNotInMenu)
      handleMouseScaleUpdate(
        { specificData, sessionData },
        inputSystem,
        oldMouse
      );

    if (!middleMouseButtonIsPressed && !sessionData.isMouseReleasedTrigger) {
      sessionData.lastMouseVector = null;
      sessionData.isMouseReleasedTrigger = true;
    }
  };

  const render = (ctx: CanvasRenderingContext2D) => {
    ctx.translate(sessionData.translateVector.x, sessionData.translateVector.y);
    ctx.scale(sessionData.scalar, sessionData.scalar);
  };

  return {
    getData,
    getZIndex,
    start,
    update,
    render,
  };
};

export default origin;
