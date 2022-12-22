import React, { useRef, useEffect, useState } from "react";

import { StyledCanvas } from "./index.styles";
import { useDebounce } from 'usehooks-ts'
import renderer from "./renderer";
import { rendererR } from "./generalTypes";

interface CanvasProps {

}

const Canvas = (props : CanvasProps) => {
  const canvasRef = useRef(null)
  const [isCanvasHeight, setCanvasHeight] = useState(0)
  const debouncedCanvasHeight: number = useDebounce<number>(isCanvasHeight, 500)
  const [isCanvasWidth, setCanvasWidth] = useState(0)
  const debouncedCanvasWidth: number = useDebounce<number>(isCanvasWidth, 500)
  window.addEventListener('resize', () => {
    setCanvasHeight(window.innerHeight)
    setCanvasWidth(canvasRef.current.offsetWidth)
  })
  let canvas = null
  let CanvasRenderer: rendererR = null
  let sceneAnimation: ReturnType<typeof setInterval> = null
  
  useEffect(() => {
    if (window.innerHeight !== debouncedCanvasHeight) {
      setCanvasHeight(window.innerHeight)
      setCanvasWidth(canvasRef.current.offsetWidth)
    }
    canvas = canvasRef.current

    canvas.width = debouncedCanvasWidth * window.devicePixelRatio
    canvas.height = debouncedCanvasHeight * window.devicePixelRatio

    CanvasRenderer = renderer(canvas)
    sceneAnimation = CanvasRenderer.renderScene()

    return () => {
      clearInterval(sceneAnimation)
    }
  }, [debouncedCanvasHeight, debouncedCanvasWidth])

  return (
    <StyledCanvas ref={canvasRef}/>
  );
};

export default Canvas;