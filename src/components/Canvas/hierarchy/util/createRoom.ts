import _ from "lodash";
import { sceneObjectsR } from "../hierarchyTypes";
import roomDefaultData from "../../Objects/PlacableObjects/Room/roomDefaultData"
import { objectR } from "../../Objects/objectTypes";

let roomCount: number = 0;

const createRoom = (sceneObjects: sceneObjectsR): objectR => {
  const hierarchyDataObject = _.cloneDeep(roomDefaultData);
  // room names get count in name & zIndex depending on their count
  hierarchyDataObject.name = hierarchyDataObject.name + roomCount;
  hierarchyDataObject.zIndex = hierarchyDataObject.zIndex + 0.001 * roomCount;
  roomCount++;
  // add room
  const createdObject: objectR = sceneObjects.add(hierarchyDataObject);
  return createdObject;
}

export default createRoom