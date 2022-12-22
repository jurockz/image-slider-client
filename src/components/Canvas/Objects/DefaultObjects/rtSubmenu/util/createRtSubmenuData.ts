import { vectorI } from "../../../Transform/transformTypes";
import { vertexI } from "../../../Transform/Vertex/types";
import { rtIconsDataI, rtSubmenuDataI } from "../rtSubmenuTypes";
import getRtIcons from "./getRtIcons";

const createRtSubmenuData = (startCoord: vertexI): rtSubmenuDataI => {
  const icons: rtIconsDataI = getRtIcons();
  const columns: number = 4;
  const rows: number = Math.ceil(Object.keys(icons).length / columns);
  const optionSize: number = 80;
  const menuPadding: number = 10;
  const menuData: rtSubmenuDataI = {
    options: {},
    widthCoord:
      startCoord.x +
      (optionSize *
        (Object.keys(icons).length < 4 ? Object.keys(icons).length : columns) +
        menuPadding),
    heightCoord: startCoord.y + (rows * optionSize + menuPadding),
    optionSize,
  };
  const optionPadding: number = 5;
  Object.keys(icons).forEach((iconName, index) => {
    const optionPosition: vectorI = {
      x: startCoord.x + (index % columns) * optionSize,
      y: startCoord.y + Math.floor(index / columns) * optionSize,
    };
    let iconPosition: vectorI = { x: null, y: null };
    let width: number = null;
    let height: number = null;
    if (icons[iconName].imgWidth >= icons[iconName].imgHeight) {
      width = optionSize - optionPadding * 2;
      height = (width / icons[iconName].imgWidth) * icons[iconName].imgHeight;
      iconPosition.x = optionPosition.x + optionPadding;
      iconPosition.y = optionPosition.y + (width - height) / 2 + optionPadding;
    } else {
      height = optionSize - optionPadding * 2;
      width = (height / icons[iconName].imgHeight) * icons[iconName].imgWidth;
      iconPosition.y = optionPosition.y + optionPadding;
      iconPosition.x = optionPosition.x + (height - width) / 2 + optionPadding;
    }

    menuData.options[iconName] = {
      iconData: {
        image: icons[iconName].image,
        position: iconPosition,
        width,
        height,
      },
      position: optionPosition,
      mouseIn: false,
    };
  });
  return menuData;
};

export default createRtSubmenuData;
