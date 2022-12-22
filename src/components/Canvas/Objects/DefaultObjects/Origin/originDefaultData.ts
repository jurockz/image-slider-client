import { hierarchyDataObjectI } from "../../../hierarchy/hierarchyTypes"

const originData: hierarchyDataObjectI = {
  name: "sceneOrigin",
  type: "origin",
  transform: {
    meshData: {
      verticesData: [[0,0]],
      trianglesData: [],
      edgesData: []
    },
    visible:true
  },
  zIndex: 0,
  specific: {
    scalarSum: 1,
    displacementVector: {x: 0, y: 0}
  }
}

export default originData