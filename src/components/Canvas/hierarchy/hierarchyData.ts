import gridDefaultData from "../Objects/DefaultObjects/Grid/gridDefaultData";
import originDefaultData from "../Objects/DefaultObjects/Origin/originDefaultData";
import selectionDefaultData from "../Objects/DefaultObjects/Selection/selectionDefaultData";
import { hierarchyDataObjectI } from "./hierarchyTypes";

const hierarchyData: { [key: string]: hierarchyDataObjectI } = {};

hierarchyData[originDefaultData.name] = originDefaultData;
hierarchyData[gridDefaultData.name] = gridDefaultData;
hierarchyData[selectionDefaultData.name] = selectionDefaultData;

export default hierarchyData;
