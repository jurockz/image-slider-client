import mesh from "./Mesh/mesh";
import { meshR } from "./Mesh/types";
import meshBox from "./MeshBox/meshBox";
import collider from "./collider/collider";
import { colliderR } from "./collider/colliderTypes";
import { adjustToObjectsSizeProps, scaleI, scaleObjectProps, scaleObjectToProps, setVisibleProps, transformProps, transformR, vectorI } from "./transformTypes";
import { vertexDataT, vertexI, vertexR } from "./Vertex/types";
import origin from "./origin/origin";
import { getNearestVertexR, originR } from "./origin/originTypes";
import { meshBoxR } from "./MeshBox/types";
import { relationR } from "./relation/relationTypes";
import relation from "./relation/relation";
import { shaderR } from "./shader/shaderTypes";
import shader from "./shader/shader";

const transform = (transformData: transformProps): transformR => {
  const objectName: string = transformData.objectName
  const _mesh: meshR = mesh({verticesData:transformData.meshData.verticesData, trianglesData:transformData.meshData.trianglesData, edgesData:transformData.meshData.edgesData})
  const _meshBox: meshBoxR = meshBox({vertices:_mesh.getVertices()})

  let visible: boolean = transformData.visible
  
  const setVisible = ({setVisibleTo}: setVisibleProps): void => {
    visible = setVisibleTo
  }

  const getVisible = (): boolean => {
    return visible
  }

  const _collider: colliderR = collider({mesh:_mesh, meshBox:_meshBox.meshBox, sceneObjects:transformData.sceneObjects, objectName, getVisible})
  
  const _origin: originR = origin({meshBox:_meshBox.meshBox})
  const _relation: relationR = relation({objectName})
  const _shader: shaderR = shader({mesh:_mesh, meshBox:_meshBox.meshBox})

  const setObjectTo = (toVector: vectorI): void => {
    const originPos: vertexI = _origin.getOrigin().getVertex() 
    const moveVector: vectorI = {
      x: toVector.x - originPos.x,
      y: toVector.y - originPos.y
    }
    moveObject(moveVector)
  }

  const moveObject = ({x, y}: vectorI): void => {
    _mesh.moveMesh({x, y})
    _meshBox.meshBox.moveMesh({x, y})
    _relation.moveChildren({x, y})
  }

  const scaleObjectTo = ({scaleOrigin=_origin.getOrigin(), to}: scaleObjectToProps): void => {
    const from: vertexI = _meshBox.getVertexFurthestAwayFrom(_origin.getOrigin().getVertex()).getVertex()
    scaleObject({scaleOrigin, from, to})
  }

  const scaleObject = ({scaleOrigin=_origin.getOrigin(), from, to}: scaleObjectProps): void => {
    _mesh.scaleToOrigin({origin:scaleOrigin, from, to})
    _meshBox.meshBox.scaleToOrigin({origin:scaleOrigin, from, to})
    _relation.scaleChildren({from, to, scaleOrigin})
  }

  const adjustToObjectsSize = ({meshBoxes}: adjustToObjectsSizeProps) => {
    const allVertices: vertexR[] = meshBoxes
      .map(meshBoxToMap => meshBoxToMap.meshBox.getVertices())
      .reduce((prevVertexArray, currVertexArray) => prevVertexArray.concat(currVertexArray))
    const boundingMeshBox: meshBoxR = meshBox({vertices:allVertices})
    const upperLeftVertex: vertexI = boundingMeshBox.meshBox.getVertices().find(vertex => boundingMeshBox.getVertexDirection(vertex) === "upperLeft").getVertex()
    setObjectTo(upperLeftVertex)
    const lowerRightVertex: vertexI = boundingMeshBox.meshBox.getVertices().find(vertex => boundingMeshBox.getVertexDirection(vertex) === "lowerRight").getVertex()
    scaleObjectTo({to:lowerRightVertex})
  }

  const getObjectName = (): string => {
    return objectName
  }

  const getMesh = (): meshR => {
    return _mesh
  }

  const getMeshBox = (): meshBoxR => {
    return _meshBox
  }

  const getBorder = (): vertexR[][] => {
    return _mesh.getBorder()
  }

  const getCollider = (): colliderR => {
    return _collider
  }

  const getOrigin = (): vertexR => {
    return _origin.getOrigin()
  }

  const getRelation = (): relationR => {
    return _relation
  }

  const getShader = (): shaderR => {
    return _shader
  }

  const getMeshBoxScale = (): scaleI => {
    if(!_meshBox.meshBox) {
      console.error("MeshBox is null", _meshBox.meshBox);
      return null
    }
    const meshBoxVertices: vertexR[] = _meshBox.meshBox.getVertices()
    const nearestVertex: getNearestVertexR = _origin.getNearestVertex({vertices:meshBoxVertices})
    let leftIndex: number = (nearestVertex.index - 1) % 4
    if(leftIndex < 0) leftIndex += 4
    let rightIndex: number = (nearestVertex.index + 1) % 4
    if(rightIndex < 0) rightIndex += 4
    const scaleVertices: vertexDataT[] = [
      meshBoxVertices[leftIndex].getVertexData(),
      nearestVertex.vertex.getVertexData(),
      meshBoxVertices[rightIndex].getVertexData()
    ]
    return {
      width: scaleVertices[0][1] === scaleVertices[1][1] ? scaleVertices[1][0] : scaleVertices[2][0],
      height:  scaleVertices[0][0] === scaleVertices[2][0] ? scaleVertices[2][1] : scaleVertices[0][1]
    }
  }

  return {
    setVisible,
    getVisible,
    setObjectTo,
    moveObject,
    scaleObjectTo,
    scaleObject,
    adjustToObjectsSize,
    getObjectName,
    getMesh,
    getMeshBox,
    getBorder,
    getCollider,
    getOrigin,
    getRelation,
    getShader,
    getMeshBoxScale
  }
}

export default transform