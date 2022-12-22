import gridDefaultData from "../Objects/DefaultObjects/Grid/gridDefaultData";
import menuDefaultData from "../Objects/DefaultObjects/Menu/menuDefaultData";
import originDefaultData from "../Objects/DefaultObjects/Origin/originDefaultData";
import rtSubmenuData from "../Objects/DefaultObjects/rtSubmenu/rtSubmenuDefaultData";
import selectionDefaultData from "../Objects/DefaultObjects/Selection/selectionDefaultData";
import { hierarchyDataObjectI } from "./hierarchyTypes";

const hierarchyData: { [key: string]: hierarchyDataObjectI } = {};

hierarchyData[originDefaultData.name] = originDefaultData;
hierarchyData[gridDefaultData.name] = gridDefaultData;
hierarchyData[selectionDefaultData.name] = selectionDefaultData;
hierarchyData[menuDefaultData.name] = menuDefaultData;
hierarchyData[rtSubmenuData.name] = rtSubmenuData;

export default hierarchyData;
