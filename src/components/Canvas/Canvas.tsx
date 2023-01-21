import React, { useRef, useEffect, useState } from "react";
import { StyledCanvas, StyledCanvasWrapper, StyledMenuBar, StyledRtMenuContainer, StyledRtBtnWrapper, StyledRtTypeBtn, StyledRtOptionsWrapper, StyledRtOption, StyledRtOptionImg } from "./index.styles";
import { useDebounce, useInterval } from 'usehooks-ts'
import PointerIcon from "./uiComponents/pointerIcon";
import RoomIcon from "./uiComponents/RoomIcon";
import RtIcon from "./uiComponents/RtIcon";
import { hierarchyR, sceneObjectsR } from "./hierarchy/hierarchyTypes";
import hierarchy from "./hierarchy/hierarchy";
import inputSystem from "./InputSystem/inputSystem";
import { inputSystemR } from "./InputSystem/inputTypes";
import updateScene from "./updateScene";
import createRoom from "./hierarchy/util/createRoom";
import rt_201 from "../../assets/racetracks/rt_201.png"
import rt_215 from "../../assets/racetracks/rt_215.png"
import createRtPart from "./hierarchy/util/createRtPart";

interface CanvasProps {

}

const Canvas = (props : CanvasProps) => {
  const canvasRef = useRef(null)
  const canvasWrapperRef = useRef(null)
  const [isCanvasHeight, setCanvasHeight] = useState(0)
  const debouncedCanvasHeight: number = useDebounce<number>(isCanvasHeight, 500)
  const [isCanvasWidth, setCanvasWidth] = useState(0)
  const debouncedCanvasWidth: number = useDebounce<number>(isCanvasWidth, 500)
  const [isActiveButton, setActiveButton] = useState("pointer")
  const [isRtOptionMenuActive, setRtOptionMenuActive] = useState(false)
  window.addEventListener('resize', () => {
    const parentSize = canvasWrapperRef.current.getBoundingClientRect()
    setCanvasHeight(parentSize.height)
    setCanvasWidth(parentSize.width)
  })
  const [isSceneObjects, setSceneObjects] = useState<sceneObjectsR>(null)
  const [isCtx, setCtx] = useState<CanvasRenderingContext2D>(null)
  const [isInputSystem, setInputSystem] = useState<inputSystemR>(null)

  useEffect(() => {
    console.log("Start Scene");
    let cWidth = debouncedCanvasWidth
    let cHeight = debouncedCanvasHeight
    if(cWidth === 0 && cHeight === 0) {
      const parentSize = canvasWrapperRef.current.getBoundingClientRect()
      cHeight = parentSize.height
      cWidth = parentSize.width
    }
    const canvas = canvasRef.current
    canvas.height = cHeight * window.devicePixelRatio
    canvas.width = cWidth * window.devicePixelRatio
    
    // CTX
    const ctxToSet: CanvasRenderingContext2D = canvas.getContext("2d")
    ctxToSet.scale(window.devicePixelRatio, window.devicePixelRatio);
    setCtx(ctxToSet);
    
    const _hierarchy: hierarchyR = hierarchy(canvas)
    const sceneObjectToSet: sceneObjectsR = _hierarchy.intantiateSceneObjects()
    setSceneObjects(sceneObjectToSet)
    setInputSystem(inputSystem(canvas, sceneObjectToSet))
  },[debouncedCanvasHeight, debouncedCanvasWidth])

  useInterval(() => {
    updateScene({
      activeMenuBtn:isActiveButton, 
      setMenuBtn:setActiveButton,
      isSceneObjects,
      isCtx,
      isInputSystem
    })
  }, 42)

  const menuBtnClick = ( btnName: string) => {
    if(btnName !== isActiveButton) {
      setActiveButton(btnName)
      if(btnName !== "racetrack" && isRtOptionMenuActive) {
        setRtOptionMenuActive(false)
      }
      if(btnName === "room") {
        createRoom(isSceneObjects)
      }
      if(btnName === "racetrack") {
        setRtOptionMenuActive(true)
      }
    }
  }

  const rtOptionClick = (rtName: string) => {
    setRtOptionMenuActive(false)
    createRtPart(isSceneObjects, rtName)
  }

  return (
    <StyledCanvasWrapper ref={canvasWrapperRef}>
      <StyledCanvas ref={canvasRef} width="100%" height="100%"/>
      <StyledMenuBar>
        <PointerIcon isActiveButton={isActiveButton} menuBtnClick={menuBtnClick}/>
        <RoomIcon isActiveButton={isActiveButton} menuBtnClick={menuBtnClick}/>
        <RtIcon isActiveButton={isActiveButton} menuBtnClick={menuBtnClick}/>
      </StyledMenuBar>
      <StyledRtMenuContainer visible={isRtOptionMenuActive}>
        <StyledRtTypeBtn>
          300
        </StyledRtTypeBtn>
        <StyledRtBtnWrapper>
         <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z"/></svg>
        </StyledRtBtnWrapper>
        <StyledRtOptionsWrapper>
          <StyledRtOption onClick={() => rtOptionClick("rt201")}>
            <StyledRtOptionImg src={rt_201}></StyledRtOptionImg>
          </StyledRtOption>
          <StyledRtOption onClick={() => rtOptionClick("rt215")}>
            <StyledRtOptionImg src={rt_215}></StyledRtOptionImg>
          </StyledRtOption>
        </StyledRtOptionsWrapper>
        <StyledRtBtnWrapper>
          <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="m24 30.75-12-12 2.15-2.15L24 26.5l9.85-9.85L36 18.8Z"/></svg>
        </StyledRtBtnWrapper>
      </StyledRtMenuContainer>
    </StyledCanvasWrapper>
  );
};

export default Canvas;