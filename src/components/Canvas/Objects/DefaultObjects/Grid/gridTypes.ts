import { vectorI } from "../../Transform/transformTypes";

interface gridTransferFunctionsInterface {
  getPixelToMeterRatio: () => number
}

interface gridSessionDataI {
  firstRender: boolean;
  cellSize: number;
  currentCellSize: number;
  scaleIntervall: any;
  gridMouseLocation: vectorI;
  mouseVector: vectorI;
}

export {
  gridTransferFunctionsInterface,
  gridSessionDataI
}