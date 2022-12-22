import { objectR } from "../../objectTypes";
import { edgeT } from "../Edge/types";
import { vectorI } from "../transformTypes";
import { triangleDataT, triangleR } from "../Triangle/types";
import crossProduct from "../util/crossProduct";
import pointBetweenTwoPoints from "../util/pointBetweenTwoPoints";
import swapXY from "../util/swapXY";
import { vertexDataT, vertexI, vertexR } from "../Vertex/types";
import { colliderProps, pointColliderDataI, colliderR, checkMeshCollisionProps, getMeshColliderProps, pointInVerticesProps, pointInVertexProps, pointInEdgesProps, pointInTrianglesProps, getPointColliderProps, edgeIntersectsEdgeProps, meshIntersectionProps } from "./colliderTypes";
import calculateTrisArea from "./util/calculateTrisArea";

const collider = ({mesh, meshBox, sceneObjects, objectName, visible}: colliderProps): colliderR => {

  const getPointCollider = ({pointToCheck, vertexCollisionRadius=1, edgeColliosionDistance=1}: getPointColliderProps): pointColliderDataI => {
    const pointColliderInfo: pointColliderDataI = {
      meshBox: {
        isInTriangle: false,
        inTriangles: [],
        isInVertex: false,
        inVertices: [],
        isInEdge: false,
        inEdges: []
      }, 
      mesh: {
        isInTriangle: false,
        inTriangles: [],
        isInVertex: false,
        inVertices: [],
        isInEdge: false,
        inEdges: []
      }
    }
    if(!visible) return pointColliderInfo
    
    // check Meshbox first
    pointColliderInfo.meshBox.inTriangles = pointInTriangles({point:pointToCheck, meshToCheck:meshBox})
    pointColliderInfo.meshBox.isInTriangle = Boolean(pointColliderInfo.meshBox.inTriangles.length)
    pointColliderInfo.meshBox.inVertices =  pointInVertices({point:pointToCheck, meshToCheck:meshBox, collisionRadius:vertexCollisionRadius})
    pointColliderInfo.meshBox.isInVertex = Boolean(pointColliderInfo.meshBox.inVertices.length)
    pointColliderInfo.meshBox.inEdges = pointInEdges({point:pointToCheck, meshToCheck:meshBox, allowedEdgeDistance:edgeColliosionDistance})
    pointColliderInfo.meshBox.isInEdge = Boolean(pointColliderInfo.meshBox.inEdges.length)

    // check Mesh
    if(pointColliderInfo.meshBox.isInTriangle || pointColliderInfo.meshBox.isInVertex) {
      pointColliderInfo.mesh.inVertices =  pointInVertices({point:pointToCheck, meshToCheck:mesh, collisionRadius:vertexCollisionRadius})
      pointColliderInfo.mesh.isInVertex = Boolean(pointColliderInfo.mesh.inVertices.length)
    }
    if(pointColliderInfo.meshBox.isInTriangle || pointColliderInfo.meshBox.isInEdge) {
      pointColliderInfo.mesh.inEdges = pointInEdges({point:pointToCheck, meshToCheck:mesh, allowedEdgeDistance:edgeColliosionDistance})
      pointColliderInfo.mesh.isInEdge = Boolean(pointColliderInfo.mesh.inEdges.length)
    }
    if(pointColliderInfo.meshBox.isInTriangle) {
      pointColliderInfo.mesh.inTriangles = pointInTriangles({point:pointToCheck, meshToCheck:mesh})
      pointColliderInfo.mesh.isInTriangle = Boolean(pointColliderInfo.mesh.inTriangles.length)
    }
    return pointColliderInfo
  }

  const getMeshCollider = ({includes=undefined, excludes={names: []}}: getMeshColliderProps): objectR[] => {
    if(!visible) return []
    if(!excludes.names) excludes.names = []
    excludes.names.push(objectName)
    return sceneObjects.getAllFilteredBy({includes, excludes}).filter(objectToCheck => {
      return objectToCheck.getData().objectTransform.getCollider().checkMeshCollision({meshA:mesh, meshBoxA:meshBox})
    })
  }

  const checkMeshCollision  = ({meshA, meshBoxA, meshB=mesh, meshBoxB=meshBox}: checkMeshCollisionProps): boolean => {
    if(!meshIntersection({meshA:meshBoxA, meshB:meshBoxB})) return false
    if(meshIntersection({meshA, meshB})) return true
    return false
  }

  const meshIntersection = ({meshA, meshB}: meshIntersectionProps): boolean => {
    let isIntersecting: boolean = false
    meshA.getEdges().every(edgeA => {
      meshB.getEdges().every(edgeB => {
        if(edgeIntersectsEdge({edgeA, edgeB})) {
          isIntersecting = true
          return false
        }
        return true
      })
      if(isIntersecting) return false
      return true
    })
    if(!isIntersecting) {
      const vertexFromMeshA: vertexI = meshA.getTriangles()[0].getTriangle()[0].getVertex()
      const vertexFromMeshB: vertexI = meshB.getTriangles()[0].getTriangle()[0].getVertex()
      if(pointInTriangles({point:vertexFromMeshB, meshToCheck:meshA}).length || pointInTriangles({point:vertexFromMeshA, meshToCheck:meshB}).length) {
        isIntersecting = true
      }
    }
    return isIntersecting
  }

  const pointInTriangles = ({point, meshToCheck}: pointInTrianglesProps): triangleR[] => {
    return meshToCheck.getTriangles().filter(triangleToCheck => pointInTriangle(point, triangleToCheck.getTriangleData()))
  }

  const pointInVertices = ({point, meshToCheck, collisionRadius}: pointInVerticesProps): vertexR[] => {
    return meshToCheck.getVertices().filter(vertexToCheck => pointInVertex({vertexToCheck, collisionRadius, point}))
  }

  const pointInEdges = ({point, meshToCheck, allowedEdgeDistance}: pointInEdgesProps) => {
    return meshToCheck.getEdges().filter(edge => {
      const egdeVertices: edgeT = edge.getEdge()
      const startVector: vectorI = egdeVertices[0].getVertex()
      const endVector: vectorI = egdeVertices[1].getVertex()
      let edgeToColliderDistance: vectorI = pointBetweenTwoPoints({startVector, endVector, distance:allowedEdgeDistance})
      edgeToColliderDistance.x -= startVector.x
      edgeToColliderDistance.y -= startVector.y
      edgeToColliderDistance = swapXY(edgeToColliderDistance)
      const pointA: vertexDataT = [startVector.x + edgeToColliderDistance.x, startVector.y + edgeToColliderDistance.y]
      const pointB: vertexDataT = [startVector.x - edgeToColliderDistance.x, startVector.y - edgeToColliderDistance.y]
      const pointC: vertexDataT = [endVector.x - edgeToColliderDistance.x, endVector.y - edgeToColliderDistance.y]
      const pointD: vertexDataT = [endVector.x + edgeToColliderDistance.x, endVector.y + edgeToColliderDistance.y]
      const tris1: boolean = pointInTriangle(point, [pointA, pointB, pointC])
      const tris2: boolean = pointInTriangle(point, [pointA, pointC, pointD])
      return tris1 || tris2
    })
  }

  const pointInTriangle = (point: vectorI, triangleData: triangleDataT): boolean => {
    const A: vertexDataT = triangleData[0]
    const B: vertexDataT = triangleData[1]
    const C: vertexDataT = triangleData[2]
    const P: vertexDataT = [point.x, point.y]
    const ABCPArea: number = calculateTrisArea({A, B, C:P}) + calculateTrisArea({A, B:P, C}) + calculateTrisArea({A:P, B, C}) 
    const ABCArea: number = calculateTrisArea({A, B, C})
    const tolerance: number = 0.01
    return Math.abs(ABCArea - ABCPArea) < tolerance
  }

  const pointInVertex = ({vertexToCheck, collisionRadius, point}: pointInVertexProps): boolean => {
    return Math.pow(point.x - vertexToCheck.getVertex().x, 2) + Math.pow(point.y - vertexToCheck.getVertex().y, 2) < Math.pow(collisionRadius, 2)
  }

  const edgeIntersectsEdge = ({edgeA, edgeB}: edgeIntersectsEdgeProps): boolean => {
    const edgeAVertices: edgeT = edgeA.getEdge()
    const edgeBVertices: edgeT = edgeB.getEdge()
    const A: vertexI = edgeAVertices[0].getVertex()
    const B: vertexI = edgeAVertices[1].getVertex()
    const C: vertexI = edgeBVertices[0].getVertex()
    const D: vertexI = edgeBVertices[1].getVertex()
    const AB: vectorI = {
      x: B.x - A.x,
      y: B.y - A.y
    }
    const CD: vectorI = {
      x: D.x - C.x,
      y: D.y - C.y
    }
    const AC: vectorI = {
      x: C.x - A.x,
      y: C.y - A.y
    }
    if(crossProduct({vectorA:AB, vectorB:CD}) === 0) return false
    const s: number = crossProduct({vectorA:AC, vectorB:CD}) / crossProduct({vectorA:AB, vectorB:CD})
    const t: number = crossProduct({vectorA:AC, vectorB:AB}) / crossProduct({vectorA:AB, vectorB:CD})
    if(0 <= s && s <= 1 && 0 <= t && t <= 1) return true
  }
  return {
    getPointCollider,
    checkMeshCollision,
    getMeshCollider
  }
}

export default collider