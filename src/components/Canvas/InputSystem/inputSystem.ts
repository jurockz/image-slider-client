import _ from "lodash";
import { hierarchyR, sceneObjectsR } from "../hierarchy/hierarchyTypes";
import { getDataR } from "../Objects/objectTypes";
import { pointColliderDataI } from "../Objects/Transform/collider/colliderTypes";
import { vectorI } from "../Objects/Transform/transformTypes";
import { getKeyR, getMouseR, inputSystemR, mouseDataI } from "./inputTypes";

const inputSystem = (
  canvas: HTMLElement,
  hierarchy: hierarchyR
): inputSystemR => {
  let mouseData: mouseDataI = {
    mouseVector: { x: 0, y: 0 },
    mouseAt: {},
    isPressed: false,
    pressedAt: {},
    pressedAtVector: { x: 0, y: 0 },
    releasedAt: {},
    releasedAtVector: { x: 0, y: 0 },
    button: null,
    time: {
      start: null,
      end: null,
      differenceInSec: null,
    },
  };
  const key: getKeyR = {
    pressed: false,
    key: "",
  };
  let scale: number = 1;

  const changeCursorTo = (whoWantstoChange: string, cursorName: string) => {
    canvas.style.cursor = cursorName;
  };

  const mouseMove = canvas.addEventListener("mousemove", (event) => {
    mouseData.mouseVector.x = event.clientX;
    mouseData.mouseVector.y = event.clientY;
  });

  const contextMenu = canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    return false;
  });

  const mouseDown = canvas.addEventListener("mousedown", (event) => {
    mouseData.isPressed = true;
    mouseData.pressedAt = _.cloneDeep(mouseData.mouseAt);
    mouseData.pressedAtVector = _.cloneDeep(mouseData.mouseVector);
    mouseData.button = event.button;
    mouseData.time.start = null;
    mouseData.time.end = null;
    mouseData.time.differenceInSec = null;
    mouseData.time.start = new Date().getTime();
    // reset mouseUp data
    mouseData.releasedAt = {};
    mouseData.releasedAtVector.x = 0;
    mouseData.releasedAtVector.y = 0;
  });

  const mouseUp = canvas.addEventListener("mouseup", (event) => {
    mouseData.isPressed = false;
    mouseData.pressedAt = {};
    mouseData.button = null;
    mouseData.releasedAt = _.cloneDeep(mouseData.mouseAt);
    mouseData.releasedAtVector = _.cloneDeep(mouseData.mouseVector);
    mouseData.time.end = new Date().getTime();
    mouseData.time.differenceInSec =
      (mouseData.time.end - mouseData.time.start) / 1000;
  });

  const mouseWheel = canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      if (event.ctrlKey) {
        scale += event.deltaY * 0.001;
      } else {
        if (event.deltaY > 1) {
          scale = 1.15;
        } else {
          scale = 0.85;
        }
      }
    },
    { passive: false }
  );

  let _resize = null;

  const resize = canvas.addEventListener("resize", (event) => {
    _resize = event;
  });

  const keyDown = window.addEventListener("keydown", (event) => {
    key.pressed = true;
    key.key = event.key;
  });

  const keyUp = window.addEventListener("keyup", (event) => {
    key.pressed = false;
  });

  const updateMouseLocation = (): void => {
    mouseData.mouseAt = {}; // reset
    const sceneObjects: sceneObjectsR = hierarchy.getSceneObjects();
    const gridMouseLocation: vectorI = sceneObjects
      .getSceneObjectBy({ name: "sceneOrigin" })
      .getData()
      .transferFunctions.canvasVectorToGridVector(mouseData.mouseVector);
    sceneObjects.getAll().forEach((objectToCheck) => {
      const objectData: getDataR = objectToCheck.getData();
      if (["sceneMenu", "sceneOrigin"].includes(objectData.name)) {
        // uses normal mouseVector
        const collisionData: pointColliderDataI = objectData.objectTransform
          .getCollider()
          .getPointCollider({
            pointToCheck: mouseData.mouseVector,
            edgeColliosionDistance: 1,
            vertexCollisionRadius: 6,
          });
        if (
          collisionData.meshBox.isInTriangle ||
          collisionData.meshBox.isInEdge ||
          collisionData.meshBox.isInVertex
        ) {
          mouseData.mouseAt[objectData.name] = collisionData;
        }
      } else {
        // others use grid mouse location
        const collisionData: pointColliderDataI = objectData.objectTransform
          .getCollider()
          .getPointCollider({
            pointToCheck: gridMouseLocation,
            edgeColliosionDistance: 1,
            vertexCollisionRadius: 6,
          });
        if (
          collisionData.meshBox.isInTriangle ||
          collisionData.meshBox.isInEdge ||
          collisionData.meshBox.isInVertex
        ) {
          mouseData.mouseAt[objectData.name] = collisionData;
        }
      }
    });
  };

  const getMouse = (): getMouseR => {
    return {
      mouseData,
      scale,
    };
  };

  const getKey = (): getKeyR => {
    return _.cloneDeep(key);
  };

  const resetMouseWheel = () => {
    scale = 1;
  };

  const getResize = () => {
    return _resize;
  };

  return {
    updateMouseLocation,
    getMouse,
    getResize,
    resetMouseWheel,
    changeCursorTo,
    getKey,
  };
};

export default inputSystem;
