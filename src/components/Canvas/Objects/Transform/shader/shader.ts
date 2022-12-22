import _ from "lodash"
import createColor from "../../GeneralObjectUtil/render/createColor"
import { vertexI, vertexR } from "../Vertex/types"
import { meshRendererProps, renderVertexProps, renderVerticesProps, shaderProps, shaderR } from "./shaderTypes"
import calculateCornerRadiusPosition from "./util/calculateCornerRadiusPosition"

const shader = ({mesh, meshBox}: shaderProps): shaderR => {

  const renderMeshDefaultFillColor = createColor(0,0,0).alpha(.5)
  const renderMeshDefaultStrokeColor = createColor(0,0,0)
  const renderMeshDefaultShadowColor = createColor(0,0,0)


  const renderMesh = ({
    ctx,
    filled=true, 
    fillColor=renderMeshDefaultFillColor, 
    stroke=true, 
    strokeColor=renderMeshDefaultStrokeColor, 
    lineWidth=1, 
    shadowBlur=0, 
    shadowColor=renderMeshDefaultShadowColor, 
    cornerRadius=0,
    lineDash=[]
  }: meshRendererProps): void => {
    const meshBorders: vertexR[][] = mesh.getBorder()
    ctx.save()
    meshBorders.forEach(meshPart => {
      const meshPartClone: vertexR[] = _.cloneDeep(meshPart)
      const firstVertex: vertexR = meshPartClone.shift()
      const firstVertexPos: vertexI = firstVertex.getVertex()
      ctx.beginPath()
      ctx.shadowColor = shadowColor.colorString
      ctx.shadowBlur = shadowBlur
      if(cornerRadius === 0) ctx.lineCap = "square"
      const moveTo: vertexI = calculateCornerRadiusPosition({vertexA:firstVertex, vertexB:meshPartClone[0], cornerRadius: cornerRadius})
      ctx.moveTo(moveTo.x, moveTo.y)
      meshPartClone.forEach( (cornerVertex, index) => {
        const prevVertex: vertexR = index === 0 ? firstVertex : meshPartClone[index - 1]
        const lineTo: vertexI = calculateCornerRadiusPosition({vertexA:cornerVertex, vertexB:prevVertex, cornerRadius: cornerRadius})
        ctx.lineTo(lineTo.x, lineTo.y)
        const nextVertex: vertexR = index === meshPartClone.length - 1 ? firstVertex : meshPartClone[index + 1]
        const quadraticCurveTo: vertexI = calculateCornerRadiusPosition({vertexA:cornerVertex, vertexB:nextVertex, cornerRadius: cornerRadius})
        const cornerVertexPos: vertexI = cornerVertex.getVertex()
        ctx.quadraticCurveTo(cornerVertexPos.x, cornerVertexPos.y, quadraticCurveTo.x, quadraticCurveTo.y)
      })
      const lastMeshPartVertex: vertexR = meshPartClone[meshPartClone.length - 1]
      const lineTo: vertexI = calculateCornerRadiusPosition({vertexA:firstVertex, vertexB:lastMeshPartVertex, cornerRadius: cornerRadius})
      ctx.lineTo(lineTo.x, lineTo.y)
      ctx.quadraticCurveTo(firstVertexPos.x, firstVertexPos.y, moveTo.x, moveTo.y)
      ctx.fillStyle = fillColor.colorString
      filled && ctx.fill()
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = strokeColor.colorString
      ctx.setLineDash(lineDash)
      stroke && ctx.stroke()
    })
    ctx.restore()
  }

  const renderVertices = ({
    ctx, 
    vertices, 
    radius, 
    form, 
    filled=true, 
    fillColor=renderMeshDefaultFillColor, 
    stroke=true, 
    strokeColor=renderMeshDefaultStrokeColor,
    lineWidth=1,
    lineDash=[]
  }: renderVerticesProps): void => {
    vertices.forEach(vertexToRender => {
      if(form === "round") {
        renderVertex({ctx, vertex:vertexToRender, radius, filled, fillColor, stroke, strokeColor, lineWidth, lineDash})
      }
      if(form === "rect") {
        // not integrated yet
      }
    })
  }

 const renderVertex = ({
  ctx, 
  vertex, 
  radius,
  filled=true, 
  fillColor=renderMeshDefaultFillColor, 
  stroke=true, 
  strokeColor=renderMeshDefaultStrokeColor,
  lineWidth=1,
  lineDash=[]
 }: renderVertexProps) => {
  const vertexCoord: vertexI = vertex.getVertex()
  ctx.save()
  ctx.beginPath()
  ctx.arc(vertexCoord.x, vertexCoord.y, radius, 0, 2 * Math.PI)
  ctx.fillStyle = fillColor.colorString
  filled && ctx.fill()
  ctx.lineWidth = lineWidth
  ctx.strokeStyle = strokeColor.colorString
  ctx.setLineDash(lineDash)
  stroke && ctx.stroke()
  ctx.restore()
 }

  return {
    renderMesh,
    renderVertices,
    renderVertex
  }
}

export default shader