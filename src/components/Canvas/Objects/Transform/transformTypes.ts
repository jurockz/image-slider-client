import { sceneObjectsR } from "../../hierarchy/hierarchyTypes"
import { colorI } from "../GeneralObjectUtil/generalObjectUtilTypes"
import { colliderR } from "./collider/colliderTypes"
import { meshProps, meshR } from "./Mesh/types"
import { meshBoxR } from "./MeshBox/types"
import { relationR } from "./relation/relationTypes"
import { shaderR } from "./shader/shaderTypes"
import { vertexR } from "./Vertex/types"

interface vectorI {
  x: number,
  y: number
}

interface scalePcI {
  xPc: number,
  yPc: number
}

interface scaleI {
  width: number,
  height: number
}

interface paddingI {
  top: number,
  bottom: number,
  right: number,
  left: number,
}

interface transformProps {
  objectName: string,
  meshData: meshProps,
  visible: boolean,
  sceneObjects: sceneObjectsR
}

interface transformR {
  setVisible: ({setVisibleTo}: setVisibleProps) => void,
  getVisible: () => boolean,
  setObjectTo: (toVector: vectorI) => void,
  moveObject: ({x, y}: vectorI) => void,
  scaleObjectTo: ({scaleOrigin, to}: scaleObjectToProps) => void
  scaleObject: ({scaleOrigin, from, to}: scaleObjectProps) => void,
  adjustToObjectsSize: ({meshBoxes}: adjustToObjectsSizeProps) => void
  getObjectName: () => string,
  getMesh: () => meshR,
  getMeshBox: () => meshBoxR,
  getBorder: () => vertexR[][],
  getOrigin: () => vertexR,
  getCollider: () => colliderR
  getRelation: () => relationR,
  getShader: () => shaderR,
  getMeshBoxScale: () => scaleI
}

interface scaleObjectProps {
  scaleOrigin?: vertexR,
  from: vectorI,
  to: vectorI
}

interface scaleObjectToProps {
  scaleOrigin?: vertexR,
  to: vectorI
}

interface renderMeshProps {
  ctx: CanvasRenderingContext2D, 
  mesh?: meshR, 
  filled?: boolean, 
  fillColor?: colorI, 
  stroke?: boolean, 
  strokeColor?: colorI, 
  lineWidth?: number, 
  shadowBlur?: number, 
  shadowColor?: colorI, 
  cornerRadius?: number,
  lineDash?: number[]
}

interface setVisibleProps {
  setVisibleTo: boolean
}

interface adjustToObjectsSizeProps {
  meshBoxes: meshBoxR[]
}

interface crossProductProps {
  vectorA: vectorI,
  vectorB: vectorI
}

export {
  vectorI,
  scalePcI,
  scaleI,
  paddingI,
  transformProps,
  transformR,
  scaleObjectProps,
  scaleObjectToProps,
  renderMeshProps,
  setVisibleProps,
  adjustToObjectsSizeProps,
  crossProductProps
}