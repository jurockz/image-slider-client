import { filterI_ROO, sceneObjectsR } from "../../../hierarchy/hierarchyTypes"
import { objectR } from "../../objectTypes"
import { edgeR } from "../Edge/types"
import { meshR } from "../Mesh/types"
import { vectorI } from "../transformTypes"
import { triangleR } from "../Triangle/types"
import { vertexDataT, vertexI, vertexR } from "../Vertex/types"

interface colliderProps {
  mesh: meshR,
  meshBox: meshR,
  sceneObjects: sceneObjectsR,
  objectName: string,
  getVisible: () => boolean
}

interface colliderR {
  getPointCollider: ({pointToCheck, vertexCollisionRadius, edgeColliosionDistance}: getPointColliderProps) => pointColliderDataI,
  checkMeshCollision: ({meshA, meshBoxA, meshB, meshBoxB}: checkMeshCollisionProps) => boolean,
  getMeshCollider: ({includes={names: []}, excludes=undefined}: getMeshColliderProps) => objectR[]
}

interface getPointColliderProps {
  pointToCheck: vectorI,
  vertexCollisionRadius?: number,
  edgeColliosionDistance?: number
}

interface pointColliderDataI {
  meshBox: {
    isInTriangle: boolean,
    inTriangles: triangleR[]
    isInVertex: boolean,
    inVertices: vertexR[]
    isInEdge: boolean
    inEdges: edgeR[]
  },
  mesh: {
    isInTriangle: boolean,
    inTriangles: triangleR[]
    isInVertex: boolean,
    inVertices: vertexR[]
    isInEdge: boolean
    inEdges: edgeR[]
  }
}

interface calculateTrisAreaProps {
  A: vertexDataT,
  B: vertexDataT,
  C: vertexDataT
}

interface pointInMeshR {
  inMesh: boolean,
  triangleTarget: triangleR
}

interface checkMeshCollisionProps {
  meshA: meshR,
  meshBoxA: meshR,
  meshB?: meshR,
  meshBoxB?: meshR
}

interface getMeshColliderProps {
  includes?: filterI_ROO,
  excludes?: filterI_ROO
}

interface pointInVerticesProps {
  point: vectorI, 
  meshToCheck: meshR,
  collisionRadius: number
}

interface pointInVertexProps {
  vertexToCheck: vertexR, 
  collisionRadius: number, 
  point: vectorI
}

interface pointInEdgesProps {
  point: vectorI,
  meshToCheck: meshR, 
  allowedEdgeDistance: number
}

interface pointInTrianglesProps {
  point: vectorI, 
  meshToCheck: meshR
}

interface edgeIntersectsEdgeProps {
  edgeA: edgeR, 
  edgeB: edgeR
}

interface meshIntersectionProps {
  meshA: meshR,
  meshB: meshR
}

export {
  colliderProps,
  colliderR,
  getPointColliderProps,
  pointColliderDataI,
  calculateTrisAreaProps,
  pointInMeshR,
  checkMeshCollisionProps,
  getMeshColliderProps,
  pointInVerticesProps,
  pointInVertexProps,
  pointInEdgesProps,
  pointInTrianglesProps,
  edgeIntersectsEdgeProps,
  meshIntersectionProps
}