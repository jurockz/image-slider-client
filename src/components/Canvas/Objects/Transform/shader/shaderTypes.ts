import { colorI } from "../../GeneralObjectUtil/generalObjectUtilTypes"
import { meshR } from "../Mesh/types"
import { vertexR } from "../Vertex/types"

interface shaderProps {
  mesh: meshR,
  meshBox: meshR
}

interface shaderR {
  renderMesh: ({
    ctx,
    filled, 
    fillColor, 
    stroke, 
    strokeColor, 
    lineWidth, 
    shadowBlur, 
    shadowColor, 
    cornerRadius,
    lineDash
  }: meshRendererProps) => void,
  renderVertices: ({
    ctx,
    vertices,
    radius,
    form,
    filled, 
    fillColor, 
    stroke, 
    strokeColor, 
    lineWidth, 
    lineDash
  }: renderVerticesProps) => void,
  renderVertex: ({
    ctx,
    vertex,
    radius,
    filled, 
    fillColor, 
    stroke, 
    strokeColor, 
    lineWidth, 
    lineDash
  }: renderVertexProps) => void
}

// renderMesh
interface meshRendererProps {
  ctx: CanvasRenderingContext2D,
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

// renderVertices
interface renderVerticesProps {
  ctx: CanvasRenderingContext2D,
  vertices: vertexR[]
  radius: number, 
  form: "round" | "rect",
  filled?: boolean, 
  fillColor?: colorI, 
  stroke?: boolean, 
  strokeColor?: colorI, 
  lineWidth?: number,
  lineDash?: number[]
}

// renderVertex
interface renderVertexProps {
  ctx: CanvasRenderingContext2D,
  vertex: vertexR
  radius: number,
  filled?: boolean, 
  fillColor?: colorI, 
  stroke?: boolean, 
  strokeColor?: colorI,
  lineWidth?: number,
  lineDash?: number[]
}

export {
  shaderR,
  shaderProps,
  meshRendererProps,
  renderVerticesProps,
  renderVertexProps
}