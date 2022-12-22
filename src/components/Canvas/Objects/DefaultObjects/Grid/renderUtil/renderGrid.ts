import { renderGridProps } from "./renderGridTypes"

const renderGrid = ({ctx, cellSize, scale, color, scalarSum}: renderGridProps) => {
  const numberOfLinesX: number = Math.floor(scale.width/cellSize)
  const numberOfLinesY: number = Math.floor(scale.height/cellSize)
  ctx.save()
  for(var i=0; i <= numberOfLinesX; i++) {
    ctx.beginPath()
    ctx.lineWidth = 1 / scalarSum
    
    ctx.moveTo(0, cellSize*i)
    ctx.lineTo(scale.width, cellSize*i)
    ctx.strokeStyle = color.colorString
    ctx.stroke()
    ctx.closePath()
  }
  // Y Lines
  for(var i=0; i <= numberOfLinesY; i++) {
    ctx.beginPath()
    ctx.lineWidth = 1 / scalarSum

    ctx.moveTo(cellSize*i, 0)
    ctx.lineTo(cellSize*i, scale.height)
    ctx.strokeStyle = color.colorString
    ctx.stroke()
    ctx.closePath()
  }
  ctx.restore()
}

export default renderGrid