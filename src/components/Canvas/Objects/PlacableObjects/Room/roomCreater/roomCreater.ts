import { transformR } from "../../../Transform/transformTypes";
import {
  calculateRoomProps,
  roomAllowedAtLocationProps,
} from "./roomCreaterTypes";
import roomDefaultData from "../roomDefaultData";

const roomCreater = (objectTransform: transformR) => {
  let isCreating: boolean = false;
  let isCreated: boolean = false;
  let isCreationAllowed: boolean = true;

  const calculateRoom = ({
    selectionStartGridVector,
    mouseGridVector,
  }: calculateRoomProps): void => {
    // start selection point is set
    if (!isCreating) {
      objectTransform.setObjectTo(selectionStartGridVector);
      isCreating = true;
    }
    // set width and height of selection rectangle
    objectTransform.scaleObjectTo({ to: mouseGridVector });

    //CHECK is room in other room?
    isCreationAllowed = roomAllowedAtLocation({ objectTransform });
  };

  const roomAllowedAtLocation = ({
    objectTransform,
  }: roomAllowedAtLocationProps): boolean => {
    // check if object is in other room
    return !Boolean(
      objectTransform
        .getCollider()
        .getMeshCollider({ includes: { types: ["room"] } }).length
    );
  };

  const getIsCreating = () => {
    return isCreating;
  };

  const setRoomFinished = () => {
    isCreating = false;
    isCreated = true;
  };

  const getIsCreated = () => {
    return isCreated;
  };

  const getCreationAllowed = () => {
    return isCreationAllowed;
  };

  const resetCreation = () => {
    isCreating = false;
    objectTransform.setObjectTo({
      x: roomDefaultData.transform.meshData.verticesData[0][0],
      y: roomDefaultData.transform.meshData.verticesData[0][1],
    });
    objectTransform.scaleObjectTo({
      to: {
        x: roomDefaultData.transform.meshData.verticesData[2][0],
        y: roomDefaultData.transform.meshData.verticesData[2][1],
      },
    });
  };

  return {
    calculateRoom,
    getIsCreating,
    setRoomFinished,
    getIsCreated,
    getCreationAllowed,
    resetCreation,
  };
};

export default roomCreater;
