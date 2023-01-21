import styled from 'styled-components'

export const StyledCanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

export const StyledCanvas = styled.canvas`
  position: absolute;
  top:0;
  right: 0;
  width: 100%;
  height: 100%;
`

export const StyledMenuBar = styled.div`
  position: absolute;
  top: 80px;
  left: 10px;
  background-color: white;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 15px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  padding-bottom: 20px;
`

interface rtMenuI {
  visible: boolean
}

export const StyledRtMenuContainer = styled.div<rtMenuI>`
  z-index: 101;
  position: absolute;
  top: 80px;
  left: 70px;
  width: 200px;
  height: 400px;
  background-color: white;
  border-radius: 5px;
  /* box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 15px; */
  border: 1px solid rgba(0, 0, 0, .3);
  display: ${props => props.visible ? "grid" : "none"};
  grid-template-rows: 30px 30px auto 30px;
  overflow: hidden;
  user-select: none;
`

export const StyledRtBtnWrapper = styled.div`
  height: 100%;
  width: 100%;
  transition: .3s;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: rgba(0, 0, 0, .05);
  }
`

export const StyledRtTypeBtn = styled(StyledRtBtnWrapper)`
  border-bottom: 1px solid rgba(0, 0, 0, .3);
`

export const StyledRtOptionsWrapper = styled.div`
  display: grid;
  grid-template-rows: 100px 100px 100px;
  grid-template-columns: 100px 100px;
`

export const StyledRtOption = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: .3s;
  &:hover {
    background-color: rgba(0, 0, 0, .05);
  }
`

export const StyledRtOptionImg = styled.img`
  max-width: 90%;
  max-height: 90%;
`

