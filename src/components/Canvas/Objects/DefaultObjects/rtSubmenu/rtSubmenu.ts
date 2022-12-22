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
    if (!objectTransform.getVisible()) return;

    const mouse = inputSystem.getMouse();
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
