import { vectorI } from "../../Transform/transformTypes"

interface racetrackPartSpecificDataI {
  objectIsSet: boolean,
  rtName: string
}

interface racetrackPartSessionDataI {
  firstRender: boolean,
  isMouseReleasedTrigger: boolean
}

interface rtImageI {
  image: HTMLImageElement,
  imgWidth: number,
  imgHeight: number
}

interface rtImagesDataI {
  [key: string]: rtImageI
}

export {
  racetrackPartSpecificDataI,
  racetrackPartSessionDataI,
  rtImagesDataI,
  rtImageI
}