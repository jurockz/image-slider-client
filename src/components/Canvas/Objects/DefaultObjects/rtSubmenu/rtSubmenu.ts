import {
  hierarchyDataObjectI,
  sceneObjectsR,
} from "../../../hierarchy/hierarchyTypes";
import { getDataR, objectProps, objectR } from "../../objectTypes";
import createColor from "../../GeneralObjectUtil/render/createColor";
import transform from "../../Transform/transform";
import pointInRect from "../../GeneralObjectUtil/update/pointInRect";
import { sessionDataRtSubmenuI } from "./rtSubmenuTypes";
import createRtSubmenuData from "./util/createRtSubmenuData";
import { colorI } from "../../GeneralObjectUtil/generalObjectUtilTypes";
import { inputSystemR } from "../../../InputSystem/inputTypes";
import createRtPart from "./util/createRtPart";

const rtSubmenu = (objectProps: objectProps): objectR => {
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
  const specificData = {};
  const sessionData: sessionDataRtSubmenuI = {
    firstRender: true,
    rtSubmenuData: createRtSubmenuData(
      objectTransform.getMeshBox().findDirection("lowerRight").getVertex()
    ),
    rtPartInCreation: null
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
    objectTransform.scaleObjectTo({
      to: {
        x: sessionData.rtSubmenuData.widthCoord,
        y: sessionData.rtSubmenuData.heightCoord,
      },
    });
  };

  // update get called 24 fps
  const update = (inputSystem: inputSystemR) => {
    if(sessionData.rtPartInCreation?.getData().specificData.objectIsSet) {
      sessionData.rtPartInCreation = null
      sceneObjects.getSceneObjectBy({name:"sceneMenu"}).getData().transferFunctions.setActiveButton()
    }
    // if submenu is not visible => return
    if (!objectTransform.getVisible()) return;
    const mouse = inputSystem.getMouse();
    const leftMouseButtonIsPressed: boolean = mouse.mouseData.isPressed && mouse.mouseData.button === 0;
    const mouseInRtSubmenu: boolean = Boolean(
      mouse.mouseData.mouseAt[name]?.mesh.isInTriangle
    );
    const mouseIsNotPressedInMenu: boolean = !Boolean(
      mouse.mouseData.pressedAt["sceneMenu"]?.mesh.isInTriangle
    ) && !mouseInRtSubmenu;
    
    // click outside menu => close submenu & active button to pointer
    if(mouse.mouseData.isPressed && mouseIsNotPressedInMenu) {
      sceneObjects.getSceneObjectBy({name:"sceneMenu"}).getData().transferFunctions.setActiveButton()
    }

    // check for mouse in option
    Object.values(sessionData.rtSubmenuData.options).forEach((rtOption) => {
      rtOption.mouseIn = pointInRect({
        point: mouse.mouseData.mouseVector,
        rectPos: rtOption.iconData.position,
        rectScale: {
          width: rtOption.iconData.width,
          height: rtOption.iconData.height,
        },
      });
    });
    // handle cursor
    const mouseInAtLeastOneOption: any = Object.values(sessionData.rtSubmenuData.options).map(value => value.mouseIn).includes(true)
    if(mouseInAtLeastOneOption) {
      inputSystem.changeCursorTo(name, "pointer");
    } else {
      inputSystem.changeCursorTo(name, "");
    }
    // handle click on option
    if(mouseInRtSubmenu && leftMouseButtonIsPressed && mouseInAtLeastOneOption) {
      const mouseInOption: string = Object.entries(sessionData.rtSubmenuData.options).filter(value => value[1].mouseIn).map(value => value[0])[0]
      sessionData.rtPartInCreation = createRtPart(sceneObjects, mouseInOption)
      objectTransform.setVisible({setVisibleTo:false})
      inputSystem.changeCursorTo(name, "");
    }
  };

  // update get called 24 fps
  const render = (ctx: CanvasRenderingContext2D) => {
    if (!objectTransform.getVisible()) return;

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
        Object.values(sessionData.rtSubmenuData.options).forEach((rtOption) => {
          ctx.drawImage(
            rtOption.iconData.image,
            rtOption.iconData.position.x,
            rtOption.iconData.position.y,
            rtOption.iconData.width,
            rtOption.iconData.height
          );
        });
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

export default rtSubmenu;
