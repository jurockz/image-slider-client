import _ from "lodash";
import { isInCreationReturn } from "../types";
import { sceneObjectsR } from "../../../../hierarchy/hierarchyTypes";
import { objectR } from "../../../objectTypes";
import roomDefaultData from "../../../PlacableObjects/Room/roomDefaultData";

const objectCreater = (sceneObjects: sceneObjectsR) => {
  let roomCount: number = 0;
  const inCreation: objectR[] = [];
  const defaultObjectData = {
    room: roomDefaultData,
  };

  const findInCreationData = (objectName: string): objectR => {
    return inCreation.find((object) => object.getData().name === objectName);
  };

  const setObjectCreationFinished = (objectName: string): void => {
    const index: number = inCreation
      .map((object) => object.getData().name)
      .indexOf(objectName);
    inCreation.splice(index, 1);
  };

  const deleteObject = (objectName: string) => {
    sceneObjects.deleteBy({ name: objectName });
  };

  const isInCreation = (objectName: string) => {
    const isInCreationData: isInCreationReturn = {
      isInCreation: false,
      activeButtonToPointer: false,
    };

    if (!objectName) return isInCreationData;
    const objectInCreation: objectR = findInCreationData(objectName);
    if (Boolean(objectInCreation)) {
      if (objectInCreation.getData().specificData.objectIsSet) {
        isInCreationData.activeButtonToPointer = true;
        setObjectCreationFinished(objectName);
        return isInCreationData;
      }
      isInCreationData.isInCreation = true;
      return isInCreationData;
    }
    isInCreationData.isInCreation = true;
    return isInCreationData;
  };

  const createObject = (objectType: string) => {
    const hierarchyDataObject = _.cloneDeep(defaultObjectData[objectType]);
    // room names get count in name & zIndex depending on their count
    if (objectType === "room") {
      hierarchyDataObject.name = hierarchyDataObject.name + roomCount;
      hierarchyDataObject.zIndex =
        hierarchyDataObject.zIndex + 0.001 * roomCount;
      roomCount++;
    }
    // add Object
    const createdObject: objectR = sceneObjects.add(hierarchyDataObject);

    // Not working revisit
    inCreation.push(createdObject);
    return hierarchyDataObject.name;
  };

  return {
    createObject,
    isInCreation,
    deleteObject,
  };
};

export default objectCreater;
