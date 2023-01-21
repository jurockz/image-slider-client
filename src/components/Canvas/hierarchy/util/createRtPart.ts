import _ from "lodash";
import { objectR } from "../../Objects/objectTypes";
import racetrackPartData from "../../Objects/PlacableObjects/RacetrackPart/racetrackPartDefaultData";
import { sceneObjectsR } from "../hierarchyTypes";

let rtCount: number = 0;

const createRtPart = (sceneObjects: sceneObjectsR, rtName: string): objectR => {
  const hierarchyDataObject = _.cloneDeep(racetrackPartData);
  // rt name example: rt_201_0.0001 & zIndex depending on their count
  hierarchyDataObject.name = hierarchyDataObject.name + rtName + "_" + rtCount;
  hierarchyDataObject.zIndex = hierarchyDataObject.zIndex + 0.001 * rtCount;
  hierarchyDataObject.specific.rtName = rtName
  rtCount++;
  // add racetrack part
  const createdObject: objectR = sceneObjects.add(hierarchyDataObject);
  return createdObject;
}

export default createRtPart