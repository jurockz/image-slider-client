import React from "react";
import { StyledIcon } from "./ui.styles";

const RoomIcon = (props) => {
  const btnName: string = "room"
  return (
    <StyledIcon width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => props.menuBtnClick(btnName)}>
      <mask id="path-1-inside-1_213_2" fill="white">
        <rect x="10" y="10" width="30" height="30" rx="1"/>
      </mask>
      <rect className="rectToChange" x="10" y="10" width="30" height="30" rx="1" stroke={props.isActiveButton === btnName ? "#4756DF" : "black"} strokeWidth="4" mask="url(#path-1-inside-1_213_2)"/>
    </StyledIcon>
  );
};

export default RoomIcon;