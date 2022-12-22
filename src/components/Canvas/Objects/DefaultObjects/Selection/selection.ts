import createColor from "../../GeneralObjectUtil/render/createColor";
import {
  selectionSessionDataInterface,
  selectionSpecificDataInterface,
} from "./SelectionTypes";
import crossImagePath from "../../../../../assets/images/cross.png";
import _ from "lodash";
import { getDataR, objectProps, objectR } from "../../objectTypes";
import {
  hierarchyDataObjectI,
  sceneObjectsR,
} from "../../../hierarchy/hierarchyTypes";
import transform from "../../Transform/transform";
import { pointColliderDataI } from "../../Transform/collider/colliderTypes";
import { colorI } from "../../GeneralObjectUtil/generalObjectUtilTypes";
import { getKeyR, getMouseR, inputSystemR } from "../../../InputSystem/inputTypes";
import { vectorI } from "../../Transform/transformTypes";

const selection = (objectProps: objectProps): objectR => {
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
  const specificData: selectionSpecificDataInterface = {
    typesAllowedForSelection: ["room"],
  };
  const sessionData: selectionSessionDataInterface = {
    firstRender: true,
    isMouseReleasedTrigger: false,
    mode: "selection",
    lastGridMouseVector: null,
    selectionTransformAllowed: true,
    crossImage: new Image(),
    objectsInSelection: [],
    activeCorner: null,
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
    // init Images
    sessionData.crossImage.src = crossImagePath;
  };

  // update get called 24 fps
  const update = (inputSystem: inputSystemR) => {
    // Pointer is not active Button in Menu
    if (
      sceneObjects.getSceneObjectBy({ name: "sceneMenu" }).getData()
        .specificData.activeButton !== "pointer"
    ) {
      objectTransform.getRelation().resetChildren();
      return;
    }

    // Mouse Locations
    const mouse: getMouseR = inputSystem.getMouse();
    const gridMouseVector: vectorI = sceneObjects
      .getSceneObjectBy({ name: "sceneOrigin" })
      .getData()
      .transferFunctions.canvasVectorToGridVector(
        mouse.mouseData.mouseVector
      );
    const gridMousePressedAtVector: vectorI = sceneObjects
      .getSceneObjectBy({ name: "sceneOrigin" })
      .getData()
      .transferFunctions.canvasVectorToGridVector(
        mouse.mouseData.pressedAtVector
      );
    const mouseCollisionData: pointColliderDataI = objectTransform
      .getCollider()
      .getPointCollider({
        pointToCheck: gridMouseVector,
        edgeColliosionDistance: 1,
        vertexCollisionRadius: 6,
      });

    // mouse in Menu?
    const mouseIsNotPressedInMenu: boolean = !Boolean(
      mouse.mouseData.pressedAt["sceneMenu"]?.mesh.isInTriangle
    );
    const mouseIsNotInMenu: boolean = !Boolean(
      mouse.mouseData.mouseAt["sceneMenu"]?.mesh.isInTriangle
    );
    // left mouse button is pressed => all selection interaction is with the left mouse button
    const leftMouseButtonIsPressed: boolean =
      mouse.mouseData.isPressed && mouse.mouseData.button === 0;

    // set Mode | Only if mouse is not clicked
    if (!leftMouseButtonIsPressed && sessionData.isMouseReleasedTrigger) {
      // if objects in Selection && mouse is in one of the meshboxes elements
      const mouseInMeshBox: boolean =
        mouseCollisionData.meshBox.isInEdge ||
        mouseCollisionData.meshBox.isInTriangle ||
        mouseCollisionData.meshBox.isInVertex;
      if (
        Boolean(objectTransform.getRelation().getChildren().length) &&
        mouseInMeshBox &&
        mouseIsNotInMenu
      ) {
        if (mouseCollisionData.meshBox.isInVertex) {
          sessionData.mode = "scale";
          switch (
            objectTransform
              .getMeshBox()
              .getVertexDirection(mouseCollisionData.meshBox.inVertices[0])
          ) {
            case "upperLeft":
              inputSystem.changeCursorTo(name, "nw-resize");
              break;
            case "upperRight":
              inputSystem.changeCursorTo(name, "ne-resize");
              break;
            case "lowerRight":
              inputSystem.changeCursorTo(name, "se-resize");
              break;
            case "lowerLeft":
              inputSystem.changeCursorTo(name, "sw-resize");
              break;
          }
        } else if (mouseCollisionData.meshBox.isInTriangle) {
          sessionData.mode = "move";
          inputSystem.changeCursorTo(name, "pointer");
        }
      } else {
        sessionData.mode = "selection";
        inputSystem.changeCursorTo(name, "default");
      }
    }

    // CHECK
    if (mouseIsNotPressedInMenu && leftMouseButtonIsPressed) {
      // Mode eqals selection
      if (sessionData.mode === "selection") {
        // setSelection
        if (!objectTransform.getOrigin().equals(gridMousePressedAtVector)) {
          if (Boolean(objectTransform.getRelation().getChildren())) {
            // Reset selection if objects were selected
            objectTransform.getRelation().resetChildren();
            objectTransform.setObjectTo({ x: -100, y: -100 });
            objectTransform.scaleObjectTo({ to: { x: -99.9, y: -99.9 } });
          }
          objectTransform.setObjectTo(gridMousePressedAtVector);
          objectTransform.setVisible({ setVisibleTo: true });
        }
        objectTransform.scaleObjectTo({ to: gridMouseVector });
        sessionData.objectsInSelection = objectTransform
          .getCollider()
          .getMeshCollider({ includes: { types: ["room"] } });
      }
      if (sessionData.mode === "move") {
        if (!sessionData.lastGridMouseVector)
          sessionData.lastGridMouseVector = gridMousePressedAtVector;
        objectTransform.moveObject({
          x: gridMouseVector.x - sessionData.lastGridMouseVector.x,
          y: gridMouseVector.y - sessionData.lastGridMouseVector.y,
        });
        sessionData.lastGridMouseVector = gridMouseVector;
      }
      if (sessionData.mode === "scale") {
        // scale to opposite and childs
        if (!sessionData.lastGridMouseVector)
          sessionData.lastGridMouseVector = gridMousePressedAtVector;
        if (!sessionData.activeCorner)
          sessionData.activeCorner = objectTransform
            .getMeshBox()
            .getVertexFurthestAwayFrom(
              mouseCollisionData.meshBox.inVertices[0].getVertex()
            );
        objectTransform.scaleObject({
          scaleOrigin: sessionData.activeCorner,
          from: sessionData.lastGridMouseVector,
          to: gridMouseVector,
        });
        sessionData.lastGridMouseVector = gridMouseVector;
      }

      sessionData.isMouseReleasedTrigger = false;
    }

    // left mouse button is not pressed & mouse release was not triggered yet
    if (!leftMouseButtonIsPressed && !sessionData.isMouseReleasedTrigger) {
      // Things that happen if mousepress was released
      if (sessionData.mode === "selection") {
        // set selection to finished
        if (!Boolean(sessionData.objectsInSelection.length)) {
          objectTransform.setVisible({ setVisibleTo: false });
          objectTransform.setObjectTo({ x: -100, y: -100 });
          objectTransform.scaleObjectTo({ to: { x: -99.9, y: -99.9 } });
        } else {
          objectTransform.adjustToObjectsSize({
            meshBoxes: sessionData.objectsInSelection.map((objectToMap) =>
              objectToMap.getData().objectTransform.getMeshBox()
            ),
          });
          objectTransform
            .getRelation()
            .setChildren(
              sessionData.objectsInSelection.map(
                (objectToMap) => objectToMap.getData().objectTransform
              )
            );
        }
      }
      if (sessionData.mode === "move") {
        // default anything
        sessionData.lastGridMouseVector = null;
      }
      if (sessionData.mode === "scale") {
        // default anything
        sessionData.lastGridMouseVector = null;
        sessionData.activeCorner = null;
      }

      sessionData.isMouseReleasedTrigger = true;
    }

    // KeyEvents
    const key: getKeyR = inputSystem.getKey();

    // Delete Objects
    if (key.pressed) {
      if (
        key.key === "Backspace" &&
        Boolean(objectTransform.getRelation().getChildren().length)
      ) {
        objectTransform
          .getRelation()
          .getChildren()
          .forEach((childObject) => {
            sceneObjects.deleteBy({ name: childObject.getObjectName() });
          });
        objectTransform.getRelation().resetChildren();
        objectTransform.setObjectTo({ x: -100, y: -100 });
        objectTransform.scaleObjectTo({ to: { x: -99.9, y: -99.9 } });
      }
    }
  };

  // update get called 24 fps
  const render = (ctx: CanvasRenderingContext2D) => {
    // Pointer is not active Button in Menu
    if (
      sceneObjects.getSceneObjectBy({ name: "sceneMenu" }).getData()
        .specificData.activeButton !== "pointer"
    )
      return;

    const blueColor: colorI = createColor(71, 86, 223);
    const whiteColor: colorI = createColor(255, 255, 255);
    const lineWidth: number = Boolean(
      objectTransform.getRelation().getChildren().length
    )
      ? 4
      : 1;
    // TO DO: style selected border && look into corner radius
    objectTransform
      .getShader()
      .renderMesh({
        ctx,
        filled: true,
        fillColor: blueColor.alpha(0.1),
        stroke: true,
        strokeColor: blueColor,
        lineWidth: lineWidth,
        lineDash: [10, 10],
      });
    if (Boolean(objectTransform.getRelation().getChildren().length)) {
      objectTransform.getShader().renderVertices({
        ctx,
        vertices: objectTransform.getMeshBox().meshBox.getVertices(),
        radius: 6,
        form: "round",
        filled: true,
        fillColor: whiteColor,
        stroke: true,
        strokeColor: blueColor,
      });
    }

    // if objects are selected
    if (Boolean(objectTransform.getRelation().getChildren().length)) {
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

export default selection;
