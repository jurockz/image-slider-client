import pointerButtonImage from '../../../../../../assets/images/pointer.png'
import pointerSelectedButtonImage from '../../../../../../assets/images/pointer_selected.png'
import roomButtonImage from '../../../../../../assets/images/room.png'
import roomSelectedButtonImage from '../../../../../../assets/images/roomSelected.png'
import racetrackButtonImage from '../../../../../../assets/images/racetrack.png'
import racetrackSelectedButtonImage from '../../../../../../assets/images/racetrackSelected.png'

const menuIcons = () => {
  const icons = {
    pointer: {
      default: null,
      selected: null
    },
    room: {
      default: null,
      selected: null
    },
    racetrack: {
      default: null,
      selected: null
    }
  }
  Object.keys(icons).forEach(iconName => {
    icons[iconName].default = new Image()
    icons[iconName].selected = new Image()
  })

  icons.pointer.default.src = pointerButtonImage
  icons.pointer.selected.src = pointerSelectedButtonImage
  icons.room.default.src = roomButtonImage
  icons.room.selected.src = roomSelectedButtonImage
  icons.racetrack.default.src = racetrackButtonImage
  icons.racetrack.selected.src = racetrackSelectedButtonImage


  const getIcon = (imageName: string, selected: boolean) => {
    return selected ? icons[imageName].selected : icons[imageName].default
  }

  return {
    getIcon
  }
}

export default menuIcons