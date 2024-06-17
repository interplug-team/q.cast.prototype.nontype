/**
 * Collection of utils to use on canvas
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
