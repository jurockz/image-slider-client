import { vectorI } from "../transformTypes"

interface vertexI {
  x: number,
  y: number
}

type vertexDataT = number[]

interface vertexProps {
  vertexData: vertexDataT
}

interface setVertexProps {
  x?: number,
  y?: number
}

interface vertexR {
  getVertex: () => vertexI,
  getVertexData: () => vertexDataT,
  setVertex: ({x, y}: setVertexPropsAtLeastOne) => void,
  moveVertex: ({x, y}: vectorI) => void,
  equals: ({x,y}: vertexI) => boolean
}

// https://www.typescriptlang.org/docs/handbook/utility-types.html or https://realfiction.net/2019/02/03/typescript-type-shenanigans-2-specify-at-least-one-property
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>}[Keys]

type setVertexPropsAtLeastOne = RequireAtLeastOne<setVertexProps, "x" | "y">

export {
  vertexI,
  vertexDataT,
  vertexProps,
  vertexR,
  setVertexPropsAtLeastOne
}