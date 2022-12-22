import rt201 from '../../../../../../assets/racetracks/rt_201.png'
import rt215 from '../../../../../../assets/racetracks/rt_215.png'
import { rtIconsDataI } from '../rtSubmenuTypes'

const getRtIcons = (): rtIconsDataI => {
  const racetrackIconData: rtIconsDataI = {
    rt201: {
      image: new Image(),
      imgWidth: 58,
      imgHeight: 133
    },
    rt215: {
      image: new Image(),
      imgWidth: 78,
      imgHeight: 80
    }
  }
  racetrackIconData.rt201.image.src = rt201
  racetrackIconData.rt215.image.src = rt215

  return racetrackIconData
}

export default getRtIcons