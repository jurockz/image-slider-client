import _ from "lodash";
import mouseInButton from "./util/mouseInButton";
import menuIcons from "./util/menuIcons";
import { isInCreationReturn, objectCreaterReturn, sessionDataMenu } from "./menuTypes";
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
import createRoom from "./util/createRoom";

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
  const specificData: { buttons: string[]; activeButton: string[] } = {
    buttons: ["pointer", "room", "racetrack"],
    activeButton: ["pointer"],
  };
  const sessionData: sessionDataMenu = {
    firstRender: true,
    _mouseInButton: null,
    _menuIcons: null,
    objectCreater: null,
    objectInCreation: null,
    actionOfIconExecuted: false
  };

  const setActiveButton = (buttonName: string = "pointer") => {
    specificData.activeButton.unshift(buttonName);
    sessionData.actionOfIconExecuted = false
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
    const mouseInMenu: boolean = Boolean(
      mouse.mouseData.mouseAt[name]?.mesh.isInTriangle
    );
    
    // Is mouse in button? In what button?
    sessionData._mouseInButton = mouseInMenu && !mouse.mouseData.isPressed || pressedInMenu
      ? mouseInButton(
          mouse.mouseData.mouseVector,
          specificData.buttons,
          objectTransform
        )
      : null;
    
    const mouseInButtonNotActiveButton: boolean = sessionData._mouseInButton !== specificData.activeButton[0]
    // mouse over button that is not active => change cursor
    if (mouseInMenu) {
      if(sessionData._mouseInButton && mouseInButtonNotActiveButton) {
        inputSystem.changeCursorTo(name, "pointer");
      } else {
        inputSystem.changeCursorTo(name, "default");
      }
    } else {
      inputSystem.changeCursorTo(name, "")
    }
    // define active button on click 
    if (
      pressedInMenu &&
      sessionData._mouseInButton &&
      mouseInButtonNotActiveButton
    ) {
      specificData.activeButton.unshift(sessionData._mouseInButton);
      sessionData.actionOfIconExecuted = false
    }

    if(!sessionData.actionOfIconExecuted) {
      // clear last buttons actions
      if(specificData.activeButton[1] === "pointer") {

      }
      if(specificData.activeButton[1] === "room") {
        const roomsData: getDataR = sessionData.objectInCreation.getData()
        if(!roomsData.specificData.objectIsSet) { // object was not set => delete
          sceneObjects.deleteBy({ name: roomsData.name})
          inputSystem.changeCursorTo(roomsData.name, "")
        }
        sessionData.objectInCreation = null
      }
      if(specificData.activeButton[1] === "racetrack") {
        const rtMenu: getDataR = sceneObjects.getSceneObjectBy({ name: "racetrackMenu" }).getData()
        rtMenu.objectTransform.setVisible({ setVisibleTo: false });
        if(rtMenu.sessionData.rtPartInCreation) {
          sceneObjects.deleteBy({ name: rtMenu.sessionData.rtPartInCreation.getData().name})
        }
      }
      // execute button actions
      if(specificData.activeButton[0] === "pointer") {
        
      }
      if(specificData.activeButton[0] === "room") {
        sessionData.objectInCreation = createRoom(sceneObjects)
      }
      if(specificData.activeButton[0] === "racetrack") {
        sceneObjects
          .getSceneObjectBy({ name: "racetrackMenu" })
          .getData()
          .objectTransform.setVisible({ setVisibleTo: true });
      }
      sessionData.actionOfIconExecuted = true // set action as executed
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
          if (specificData.activeButton[0] === specificData.buttons[i]) {
            imageToDraw = sessionData._menuIcons.getIcon(
              specificData.activeButton[0],
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
