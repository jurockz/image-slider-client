import rt201 from '../../../../../../assets/racetracks/rt_201.png'
import rt215 from '../../../../../../assets/racetracks/rt_215.png'
import { rtImageI, rtImagesDataI } from '../racetrackPartTypes'

const getRtImage = (rtName: string): rtImageI => {
  const racetrackIconData: rtImagesDataI = {
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

  return racetrackIconData[rtName]
}

export default getRtImage