import renderGrid from "./renderUtil/renderGrid";
import _ from "lodash";
import { gridSessionDataI, gridTransferFunctionsInterface } from "./gridTypes";
import { getDataR, objectProps, objectR, renderProps, updateProps } from "../../objectTypes";
import {
  hierarchyDataObjectI,
  sceneObjectsR,
} from "../../../hierarchy/hierarchyTypes";
import transform from "../../Transform/transform";
import createColor from "../../GeneralObjectUtil/render/createColor";
import { scaleI, vectorI } from "../../Transform/transformTypes";
import { colorI } from "../../GeneralObjectUtil/generalObjectUtilTypes";
import { inputSystemR } from "../../../InputSystem/inputTypes";

const grid = (objectProps: objectProps): objectR => {
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
  const specificData: { meterToPixel: number } = {
    meterToPixel: hierarchyDataObject.specific.meterToPixel
      ? hierarchyDataObject.specific.meterToPixel
      : 50,
  };
  const sessionData: gridSessionDataI = {
    firstRender: true,
    cellSize: specificData.meterToPixel,
    currentCellSize: specificData.meterToPixel,
    scaleIntervall: {
      start: 1,
      end: 1,
      decimalProcentage: 0,
      length: 0,
      direction: true,
      lastScalarSum: 1,
    },
    gridMouseLocation: {
      x: 0,
      y: 0,
    },
    mouseVector: {
      x: 0,
      y: 0,
    },
  };

  const getPixelToMeterRatio = (): number => {
    return sessionData.currentCellSize;
  };

  const transferFunctions: gridTransferFunctionsInterface = {
    getPixelToMeterRatio,
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

  const start = () => {};

  // update get called 24 fps
  const update = (props: updateProps) => {
    const inputSystem: inputSystemR = props.InputSystem
    const originData: getDataR = sceneObjects
      .getSceneObjectBy({ name: "sceneOrigin" })
      .getData();
    const scalar: number = originData.specificData.scalarSum;
    const displacementVector: vectorI =
      originData.specificData.displacementVector;
    sessionData.mouseVector = _.cloneDeep(
      inputSystem.getMouse().mouseData.mouseVector
    );
    sessionData.mouseVector.x -= displacementVector.x;
    sessionData.mouseVector.y -= displacementVector.y;
    sessionData.mouseVector.x /= scalar;
    sessionData.mouseVector.y /= scalar;
    sessionData.gridMouseLocation = _.cloneDeep(
      inputSystem.getMouse().mouseData.mouseVector
    );
    sessionData.gridMouseLocation.x =
      (sessionData.gridMouseLocation.x / scalar -
        displacementVector.x / scalar) /
      100;
    sessionData.gridMouseLocation.y =
      (sessionData.gridMouseLocation.y / scalar -
        displacementVector.y / scalar) /
      100;
    sessionData.gridMouseLocation.x =
      Math.round(sessionData.gridMouseLocation.x * 1000) / 1000;
    sessionData.gridMouseLocation.y =
      Math.round(sessionData.gridMouseLocation.y * 1000) / 1000;
  };

  // update get called 24 fps
  const render = (props: renderProps) => {
    const ctx: CanvasRenderingContext2D = props.ctx
    const originData: getDataR = sceneObjects
      .getSceneObjectBy({ name: "sceneOrigin" })
      .getData();
    const scalarSum = originData.specificData.scalarSum;
    const scaleIntervall = sessionData.scaleIntervall;
    // swap intervall if zoom direction is changed
    if (
      (scaleIntervall.direction && scaleIntervall.lastScalarSum > scalarSum) ||
      (!scaleIntervall.direction && scaleIntervall.lastScalarSum < scalarSum)
    ) {
      scaleIntervall.direction = !scaleIntervall.direction;
      const start = scaleIntervall.start;
      scaleIntervall.start = scaleIntervall.end;
      scaleIntervall.end = start;
    }
    scaleIntervall.lastScalarSum = scalarSum;
    // search for next end scale
    if (
      (scaleIntervall.start === scaleIntervall.end && scalarSum !== 1) ||
      (scaleIntervall.start < scaleIntervall.end &&
        !(
          scaleIntervall.start < scalarSum && scalarSum < scaleIntervall.end
        )) ||
      (scaleIntervall.start > scaleIntervall.end &&
        !(scaleIntervall.end < scalarSum && scalarSum < scaleIntervall.start))
    ) {
      if (scaleIntervall.start > scalarSum) {
        for (let i = 0; true; i--) {
          if (Math.pow(2, i) < scalarSum) {
            scaleIntervall.start = scaleIntervall.end;
            scaleIntervall.end = Math.pow(2, i);
            break;
          }
        }
      } else if (scaleIntervall.start < scalarSum) {
        for (let i = 0; true; i++) {
          if (Math.pow(2, i) > scalarSum) {
            scaleIntervall.start = scaleIntervall.end;
            scaleIntervall.end = Math.pow(2, i);
            break;
          }
        }
      }
      // calculate length
      scaleIntervall.length = Math.abs(
        scaleIntervall.end - scaleIntervall.start
      );
    }
    scaleIntervall.decimalProcentage =
      scalarSum === 1
        ? 0
        : Math.abs(
            scalarSum -
              (scaleIntervall.direction
                ? scaleIntervall.start
                : scaleIntervall.end)
          ) / scaleIntervall.length;

    const backgroundColor: colorI = createColor(240, 240, 240);
    const color: colorI = createColor(200, 200, 200);

    const smallerGridCellsize =
      sessionData.cellSize /
      (scaleIntervall.direction ? scaleIntervall.end : scaleIntervall.start);
    const gridCellSize =
      sessionData.cellSize /
      (scaleIntervall.direction ? scaleIntervall.start : scaleIntervall.end);

    const gridScale: scaleI = objectTransform.getMeshBoxScale();

    objectTransform
      .getShader()
      .renderMesh({
        ctx,
        filled: true,
        fillColor: backgroundColor,
        stroke: false,
      });
    renderGrid({
      ctx,
      cellSize: smallerGridCellsize,
      scale: gridScale,
      color: color.alpha(scaleIntervall.decimalProcentage),
      scalarSum,
    });
    renderGrid({
      ctx,
      cellSize: gridCellSize,
      scale: gridScale,
      color,
      scalarSum,
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

export default grid;
