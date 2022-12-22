import { colorI } from "../generalObjectUtilTypes"

const createColor = (r: number, g: number, b: number) : colorI => {
  const alpha = (alpha: number) => {
    return {r, g, b, a: alpha, colorString: `rgba(${r}, ${g}, ${b}, ${alpha})`}
  }
  return {r, g, b, a: 1, colorString: `rgba(${r}, ${g}, ${b}, ${1})`, alpha}
}

export default createColor