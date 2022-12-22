import { hierarchyDataObjectI, sceneObjectsR } from "../../../hierarchy/hierarchyTypes";
import { inputSystemR } from "../../../InputSystem/inputTypes";
import { getDataR, objectProps, objectR } from "../../objectTypes";
import transform from "../../Transform/transform";
import { transformR } from "../../Transform/transformTypes";
import {
  racetrackPartSessionDataI,
  racetrackPartSpecificDataI,
} from "./racetrackPartTypes";

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
  const specificData: racetrackPartSpecificDataI = {
    objectIsSet: objectProps.hierarchyDataObject.specific.objectIsSet,
  };
  const sessionData: racetrackPartSessionDataI = {};

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

  const start = () => {};

  // update get called 24 fps
  const update = (inputSystem: inputSystemR) => {};

  // update get called 24 fps
  const render = (ctx: CanvasRenderingContext2D) => {};

  return {
    getData,
    getZIndex,
    start,
    update,
    render,
  };
};

export default room;
