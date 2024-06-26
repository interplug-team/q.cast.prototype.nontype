/**
 * Collection of function to use on canvas
 */
// define a function that can locate the controls
export function polygonPositionHandler(dim, finalMatrix, fabricObject) {
  // @ts-ignore
  let x = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x
  // @ts-ignore
  let y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y
  return fabric.util.transformPoint(
    { x, y },
    fabric.util.multiplyTransformMatrices(
      fabricObject.canvas.viewportTransform,
      fabricObject.calcTransformMatrix(),
    ),
  )
}

function getObjectSizeWithStroke(object) {
  let stroke = new fabric.Point(
    object.strokeUniform ? 1 / object.scaleX : 1,
    object.strokeUniform ? 1 / object.scaleY : 1,
  ).multiply(object.strokeWidth)
  return new fabric.Point(object.width + stroke.x, object.height + stroke.y)
}

// define a function that will define what the control does
export function actionHandler(eventData, transform, x, y) {
  let polygon = transform.target,
    currentControl = polygon.controls[polygon.__corner],
    mouseLocalPosition = polygon.toLocalPoint(
      new fabric.Point(x, y),
      'center',
      'center',
    ),
    polygonBaseSize = getObjectSizeWithStroke(polygon),
    size = polygon._getTransformedDimensions(0, 0)
  polygon.points[currentControl.pointIndex] = {
    x:
      (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
      polygon.pathOffset.x,
    y:
      (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
      polygon.pathOffset.y,
  }
  return true
}

// define a function that can keep the polygon in the same position when we change its width/height/top/left
export function anchorWrapper(anchorIndex, fn) {
  return function (eventData, transform, x, y) {
    let fabricObject = transform.target
    let originX =
      fabricObject?.points[anchorIndex].x - fabricObject.pathOffset.x
    let originY = fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y
    let absolutePoint = fabric.util.transformPoint(
      {
        x: originX,
        y: originY,
      },
      fabricObject.calcTransformMatrix(),
    )
    let actionPerformed = fn(eventData, transform, x, y)
    let newDim = fabricObject._setPositionDimensions({})
    let polygonBaseSize = getObjectSizeWithStroke(fabricObject)
    let newX =
      (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
      polygonBaseSize.x
    let newY =
      (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
      polygonBaseSize.y
    fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5)
    return actionPerformed
  }
}

export const getDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}
// 선의 길이를 계산하는 함수
export const calculateLineLength = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

// 선과 텍스트를 그룹으로 묶는 함수
export const createGroupWithLineAndText = (line, text) => {
  return new fabric.Group([line, text])
}

export const calculateShapeLength = (shape) => {
  // 도형의 원래 길이를 가져옵니다.
  const originalLength = shape.width

  // 도형의 scaleX 값을 가져옵니다.
  const scaleX = shape.scaleX

  // 도형의 현재 길이를 계산합니다.
  return originalLength * scaleX
}

/**
 *
 * @param {number} value
 * @param {boolean} useDefault
 * @param {string} delimeter
 * @returns
 * ex) 1,100 mm
 */
export const formattedWithComma = (value, unit = 'mm') => {
  let formatterdData = value.toLocaleString('ko-KR')
  if (unit === 'cm') {
    formatterdData = value.toLocaleString('ko-KR') / 10
  } else if (unit === 'm') {
    formatterdData = value.toLocaleString('ko-KR') / 1000
  }

  return `${formatterdData} ${unit}`
}
