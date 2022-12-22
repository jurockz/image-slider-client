import { transformR, vectorI } from "../../../Transform/transformTypes";

interface roomCreaterReturn {
  calculateRoom: ({
    selectionStartGridVector,
    mouseGridVector,
  }: calculateRoomProps) => void;
  getIsCreating: () => boolean;
  setRoomFinished: () => void;
  getIsCreated: () => boolean;
  getCreationAllowed: () => boolean;
  resetCreation: () => void;
}

interface calculateRoomProps {
  selectionStartGridVector: vectorI;
  mouseGridVector: vectorI;
}

interface roomAllowedAtLocationProps {
  objectTransform: transformR;
}

export { roomCreaterReturn, calculateRoomProps, roomAllowedAtLocationProps };
