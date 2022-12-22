import React from "react";
import { StyledPageWrapper, StyledBuilderContainer } from "./App.styles"
import Canvas from "./components/Canvas/Canvas"

const App = () => {
  return (
    <StyledPageWrapper >
      <StyledBuilderContainer>
        <Canvas />
      </StyledBuilderContainer>
    </StyledPageWrapper>
  );
};

export default App;
