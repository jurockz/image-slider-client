import React from "react";
import { StyledIcon } from "./ui.styles";

const PointerIcon = (props) => {
  const btnName: string = "pointer"
  return (
    <StyledIcon width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => props.menuBtnClick(btnName)}>
      <path d="M34 28.6359L19.3865 11L16 33.2318L21.5725 30.0796L23.9259 39L29.9259 37.468L27.5725 28.5476L34 28.6359Z" fill={props.isActiveButton === btnName ? "#4756DF" : "black"}/>
    </StyledIcon>
  );
};

export default PointerIcon;