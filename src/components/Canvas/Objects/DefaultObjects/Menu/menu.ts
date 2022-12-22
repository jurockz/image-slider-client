import _ from "lodash";
import mouseInButton from "./util/mouseInButton";
import menuIcons from "./util/menuIcons";
import { isInCreationReturn, objectCreaterReturn } from "./types";
import objectCreater from "./util/objectCreater";
import createColor from "../../GeneralObjectUtil/render/createColor";
import { getDataR, objectProps, objectR } from "../../objectTypes";
import {
  hierarchyDataObjectI,
  sceneObjectsR,
} from "../../../hierarchy/hierarchyTypes";
import transform from "../../Transform/transform";
import { colorI } from "../../GeneralObjectUtil/generalObjectUtilTypes";
import { inputSystemR } from "../../../InputSystem/inputTypes";
import { vectorI } from "../../Transform/transformTypes";

const menu = (objectProps: objectProps): objectR => {
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
  const specificData: { buttons: string[]; activeButton: string } = {
    buttons: ["pointer", "room", "racetrack"],
    activeButton: "pointer",
  };
  const sessionData: {
    firstRender: boolean;
    _mouseInButton: string;
    _menuIcons: { getIcon: (imageName: string, selected: boolean) => any };
    objectCreater: objectCreaterReturn;
    objectInCreation: string;
  } = {
    firstRender: true,
    _mouseInButton: null,
    _menuIcons: null,
    objectCreater: null,
    objectInCreation: null,
  };

  const setActiveButton = (buttonName: string = "pointer") => {
    specificData.activeButton = buttonName;
  };

  const transferFunctions = {
    setActiveButton,
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

  const start = () => {
    sessionData.objectCreater = objectCreater(sceneObjects);
    const from: vectorI = {
      x: 60,
      y: 120,
    };
    const to: vectorI = {
      x: 60,
      y: 120 + (50 * specificData.buttons.length + 20),
    };
    objectTransform.scaleObject({ from, to });
    sessionData._menuIcons = menuIcons();
  };

  // update get called 24 fps
  const update = (inputSystem: inputSystemR) => {
    const mouse = inputSystem.getMouse();
    const pressedInMenu: boolean = Object.keys(mouse.mouseData.pressedAt).includes('sceneMenu')
    const mouseInTriangles: boolean = Boolean(
      mouse.mouseData.mouseAt[name]?.mesh.isInTriangle
    );
    
    // Is mouse in button? In what button?
    sessionData._mouseInButton = mouseInTriangles && !mouse.mouseData.isPressed || pressedInMenu
      ? mouseInButton(
          mouse.mouseData.mouseVector,
          specificData.buttons,
          objectTransform
        )
      : null;

    if (sessionData._mouseInButton) {
      inputSystem.changeCursorTo(name, "pointer");
    }

    if (
      sessionData._mouseInButton &&
      pressedInMenu &&
      sessionData._mouseInButton !== specificData.activeButton
    ) {
      specificData.activeButton = sessionData._mouseInButton;
    }
    // Create Object | only if an object is not in the creation process
    const objectStillInCreation: isInCreationReturn =
      sessionData.objectCreater.isInCreation(sessionData.objectInCreation);
    // previous object has been created => turn Button to pointer
    if (
      !["room"].includes(specificData.activeButton) &&
      sessionData.objectInCreation !== null
    ) {
      sessionData.objectCreater.deleteObject(sessionData.objectInCreation);
      sessionData.objectInCreation = null;
    }
    if (!objectStillInCreation.isInCreation) {
      // previous object has been created => turn Button to pointer
      if (objectStillInCreation.activeButtonToPointer) {
        specificData.activeButton = "pointer";
        sessionData.objectInCreation = null;
      }
      // Create Room Object
      if (specificData.activeButton === "room") {
        sessionData.objectInCreation =
          sessionData.objectCreater.createObject("room");
      }
      // open rtSubmenu
      if (specificData.activeButton === "racetrack") {
        sceneObjects
          .getSceneObjectBy({ name: "racetrackMenu" })
          .getData()
          .objectTransform.setVisible({ setVisibleTo: true });
      } else {
        sceneObjects
          .getSceneObjectBy({ name: "racetrackMenu" })
          .getData()
          .objectTransform.setVisible({ setVisibleTo: false });
      }
    }
  };

  // update get called 24 fps
  const render = (ctx: CanvasRenderingContext2D) => {
    sceneObjects
      .getSceneObjectBy({ name: "sceneOrigin" })
      .getData()
      .transferFunctions.drawInDefaultGrid(ctx, () => {
        const whiteColor: colorI = createColor(255, 255, 255);
        const greyColor: colorI = createColor(153, 153, 153);
        objectTransform
          .getShader()
          .renderMesh({
            ctx,
            fillColor: whiteColor,
            stroke: false,
            shadowBlur: 40,
            shadowColor: greyColor.alpha(0.3),
            cornerRadius: 4,
          });
        for (let i = 0; i < specificData.buttons.length; i++) {
          let imageToDraw: HTMLImageElement = null;
          // is active button ?
          if (specificData.activeButton === specificData.buttons[i]) {
            imageToDraw = sessionData._menuIcons.getIcon(
              specificData.activeButton,
              true
            );
          } else {
            imageToDraw = sessionData._menuIcons.getIcon(
              specificData.buttons[i],
              sessionData._mouseInButton == specificData.buttons[i]
            );
          }
          ctx.drawImage(imageToDraw, 15, 120 + 50 * i, 40, 40);
        }
      });
  };

  return {
    getData,
    getZIndex,
    start,
    update,
    render,
  };
};

export default menu;
