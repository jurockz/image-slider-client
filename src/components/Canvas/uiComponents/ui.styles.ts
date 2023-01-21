import styled from 'styled-components'

export const StyledIcon = styled.svg`
  width: 40px;
  height: 40px;
  padding: 5px;
  cursor: pointer;
  &:hover path {
    fill: #4756DF
  }
  &:hover .rectToChange {
    stroke: #4756DF
  }
`