import edge from "../Edge/edge"
import { edgeDataT, edgeR, edgeT } from "../Edge/types"
import triangle from "../Triangle/triangle"
import { triangleDataT, triangleR } from "../Triangle/types"
import { scalePcI, vectorI } from "../transformTypes"
import { vertexDataT, vertexI, vertexR } from "../Vertex/types"
import vertex from "../Vertex/vertex"
import { meshProps, meshR, scaleToOriginProps, splitEdgeProps } from "./types"
import calculateBorder from "./util/calculateBorder"

// vertices: [vertice,...], triangles: [[three vertices],..], edges: [vertice,vertice,triangle,triangle]
const mesh = ({verticesData, trianglesData, edgesData}: meshProps): meshR => {
  const vertices: vertexR[] = verticesData.map(vertexData => vertex({vertexData}))
  const triangles: triangleR[] = trianglesData.map(triangleData => triangle({vertices, triangleData}))
  const edges: edgeR[] = edgesData.map(edgeData => edge({vertices, triangles, edgeData}))
  const border: vertexR[][] = calculateBorder(edges)

  const moveMesh = ({x, y}: vectorI): void => {
    vertices.forEach(vertex => vertex.moveVertex({x, y}))
  }

  const removeTriangle = (triangleToRemove: triangleR): void => {
    const removeTriangleData: triangleDataT = triangleToRemove.getTriangleData()
    triangles.every((triangle, index) => {
      if(triangle.equals(removeTriangleData)) {
        triangles.splice(index, 1)
        return false
      }
    })
    edges.forEach(edge => {
      edge.setTriangleNull(removeTriangleData)
    })
  }

  const removeEdge = (edgeToRemove: edgeR): void => {
    const edgeTriangleNeighbours: triangleR[] = edgeToRemove.getTriangleNeighbors()
    const edgeToRemoveData: edgeDataT = edgeToRemove.getEdgeData()
    edges.every((edge, index) => {
      if(edge.equals(edgeToRemoveData)) {
        triangles.splice(index, 1)
        return false
      }
    })
    if(edgeTriangleNeighbours[0] !== null) removeTriangle(edgeTriangleNeighbours[0])
    if(edgeTriangleNeighbours[1] !== null) removeTriangle(edgeTriangleNeighbours[1])
  }

  const removeVertex = (vertexToRemove: vertexR): void => {
    const vertexToRemoveData: vertexDataT = vertexToRemove.getVertexData()
    const edgesToDelete: edgeR[] = edges.filter(edge => edge.includes(vertexToRemoveData))
    edgesToDelete.forEach(edge => removeEdge(edge))
  }

  const splitEdge = ({edgeToSplit, vertexData}: splitEdgeProps): void => {
    vertices.push(vertex({vertexData}))
    const edgeVertices: edgeT = edgeToSplit.getEdge()
    const vertexA: vertexDataT = edgeVertices[0].getVertexData()
    const vertexB: vertexDataT = vertexData
    const vertexD: vertexDataT = edgeVertices[1].getVertexData()
    const edgeTriangleNeighbours: triangleR[] = edgeToSplit.getTriangleNeighbors()
    edgeTriangleNeighbours.forEach(triangleCurrent => {
      if(triangleCurrent === null) return
      triangleCurrent.getTriangle().every(vertexToFind => {
        if(!vertexToFind.equals(edgeVertices[0].getVertex()) && !vertexToFind.equals(edgeVertices[1].getVertex())) {
          const vertexC: vertexDataT = vertexToFind.getVertexData()
          triangles.push(triangle({vertices, triangleData:[vertexA, vertexB, vertexC]}))
          triangles.push(triangle({vertices, triangleData:[vertexC, vertexB, vertexD]}))
          edges.push(edge({vertices, triangles, edgeData:[vertexB, vertexC]}))
          return false
        }
      })
    })
    edges.push(edge({vertices, triangles, edgeData:[vertexA, vertexB]}))
    edges.push(edge({vertices, triangles, edgeData:[vertexB, vertexD]}))
    removeEdge(edgeToSplit)
  }
  
  const scaleToOrigin = ({origin, from, to}: scaleToOriginProps): void => {
    const originVertex: vertexI = origin.getVertex()
    const fromRelativeToOrigin: vectorI = {
      x: from.x - originVertex.x,
      y: from.y - originVertex.y
    }
    // prevent unnecessary scale
    if(fromRelativeToOrigin.x === 0 && fromRelativeToOrigin.y === 0) return
    // prevent loosing mesh structure
    if(originVertex.x === to.x || originVertex.y === to.y) return
    
    const toRelativeToOrigin: vectorI = {
      x: to.x - originVertex.x,
      y: to.y - originVertex.y
    }
    const percentageScale: scalePcI = {
      xPc: (fromRelativeToOrigin.x - toRelativeToOrigin.x) / fromRelativeToOrigin.x,
      yPc: (fromRelativeToOrigin.y - toRelativeToOrigin.y) / fromRelativeToOrigin.y
    }

    vertices.forEach(vertexToScale => {
      const vertexToScaleCoord: vertexI = vertexToScale.getVertex()
      const vertexRelativeToOrigin = {
        x: vertexToScaleCoord.x - originVertex.x,
        y: vertexToScaleCoord.y - originVertex.y
      }
      const moveVector: vectorI = {
        x: -(percentageScale.xPc * vertexRelativeToOrigin.x),
        y: -(percentageScale.yPc * vertexRelativeToOrigin.y)
      }
      vertexToScale.moveVertex(moveVector)
    })
  }

  const getVertices = (): vertexR[] => {
    return vertices
  }

  const getTriangles = (): triangleR[] => {
    return triangles
  }

  const getEdges = (): edgeR[] => {
    return edges
  }

  const getBorder = (): vertexR[][] => {
    return border
  }

  const getMeshData = (): meshProps => {
    return {
      verticesData: vertices.map(vertexToMap => vertexToMap.getVertexData()),
      trianglesData: triangles.map(triangleToMap => triangleToMap.getTriangleData()),
      edgesData: edges.map(edgeToMap => edgeToMap.getEdgeData()),
    }
  }

  return {
    moveMesh,
    removeTriangle,
    removeEdge,
    removeVertex,
    splitEdge,
    scaleToOrigin,
    getVertices,
    getTriangles,
    getEdges,
    getBorder,
    getMeshData
  }
}

export default mesh