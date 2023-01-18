import { objectR } from "../../objectTypes"
import { vectorI } from "../../Transform/transformTypes"

interface rtIconI {
  image: HTMLImageElement,
  imgWidth: number,
  imgHeight: number
}

interface rtIconsDataI {
  [key: string]: rtIconI
}

interface rtIconDataI {
  image: HTMLImageElement,
  position: vectorI,
  width: number,
  height: number
}

interface rtMenuOptionI {
  iconData: rtIconDataI,
  position: vectorI,
  mouseIn: boolean
}

interface rtSubmenuDataI {
  options: {[key: string]: rtMenuOptionI},
  widthCoord: number, 
  heightCoord: number,
  optionSize: number
}

interface sessionDataRtSubmenuI {
  firstRender: boolean,
  rtSubmenuData: rtSubmenuDataI,
  rtPartInCreation: objectR
}

export {
  rtIconsDataI,
  rtSubmenuDataI,
  sessionDataRtSubmenuI
}