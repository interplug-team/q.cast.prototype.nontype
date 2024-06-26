import { fabric } from 'fabric'
import QRect from '@/components/fabric/QRect'
import { distanceBetweenPoints } from '@/app/util/canvas-util'
export default class QPolygon extends fabric.Polygon {
  group
  polygon

  constructor(points, option) {
    super(points, option)
    this.polygon = this
    this.on('added', () => {
      if (this.viewLengthText) {
        this.#addLengthText()
      } else {
        this.#makeGroupItem([this])
      }
    })
  }

  #makeGroupItem(groupItems) {
    const group = new fabric.Group(groupItems, {
      selectable: this.selectable,
      type: 'QRect',
      canvas: this.canvas,
    })

    this.group = group
    this.canvas.add(group)
    this.canvas.renderAll()
    this.canvas.remove(this)
  }

  delete() {
    this.group.canvas.remove(this.group)
  }

  #addLengthText() {
    const groupItems = [this]

    for (let i = 0; i < this.points.length; i++) {
      const start = this.points[i]
      const end = this.points[(i + 1) % this.points.length]

      const dx = end.x - start.x
      const dy = end.y - start.y
      const length = Math.sqrt(dx * dx + dy * dy)

      const text = new fabric.Text(length.toFixed(0), {
        left: (start.x + end.x) / 2,
        top: (start.y + end.y) / 2,
        fontSize: 16,
        selectable: false,
      })

      groupItems.push(text)
    }

    this.#makeGroupItem(groupItems)
  }

  #distanceFromEdge(point) {
    const vertices = this.getPoints()
    let minDistance = Infinity

    for (let i = 0; i < vertices.length; i++) {
      let vertex1 = vertices[i]
      let vertex2 = vertices[(i + 1) % vertices.length]

      const dx = vertex2.x - vertex1.x
      const dy = vertex2.y - vertex1.y

      const t =
        ((point.x - vertex1.x) * dx + (point.y - vertex1.y) * dy) /
        (dx * dx + dy * dy)

      let closestPoint
      if (t < 0) {
        closestPoint = vertex1
      } else if (t > 1) {
        closestPoint = vertex2
      } else {
        closestPoint = new fabric.Point(vertex1.x + t * dx, vertex1.y + t * dy)
      }

      const distance = distanceBetweenPoints(point, closestPoint)
      if (distance < minDistance) {
        minDistance = distance
      }
    }

    return minDistance
  }

  fillCell(cell = { width: 50, height: 100, padding: 10 }) {
    const points = this.getPoints()
    let bounds

    try {
      bounds = fabric.util.makeBoundingBoxFromPoints(points)
    } catch (error) {
      alert('다각형의 꼭지점이 4개 이상이어야 합니다.')
      return
    }

    for (
      let x = bounds.left;
      x < bounds.left + bounds.width;
      x += cell.width + cell.padding
    ) {
      for (
        let y = bounds.top;
        y < bounds.top + bounds.height;
        y += cell.height + cell.padding
      ) {
        const rect = new fabric.Rect({
          left: x,
          top: y,
          width: cell.width,
          height: cell.height,
          fill: 'transparent',
          stroke: 'black',
          selectable: false,
        })

        const rectPoints = [
          new fabric.Point(rect.left, rect.top),
          new fabric.Point(rect.left + rect.width, rect.top),
          new fabric.Point(rect.left, rect.top + rect.height),
          new fabric.Point(rect.left + rect.width, rect.top + rect.height),
        ]

        const isInside = rectPoints.every(
          (rectPoint) =>
            this.inPolygon(rectPoint) &&
            this.#distanceFromEdge(rectPoint) >= cell.padding,
        )

        if (isInside) {
          this.group.canvas.add(rect)
        }
      }
    }

    this.group.canvas.renderAll()
  }

  getPoints() {
    return this.points
  }

  getInfo() {
    return this
  }

  inPolygon(point) {
    const vertices = this.getPoints()
    let intersects = 0

    for (let i = 0; i < vertices.length; i++) {
      let vertex1 = vertices[i]
      let vertex2 = vertices[(i + 1) % vertices.length]

      if (vertex1.y > vertex2.y) {
        let tmp = vertex1
        vertex1 = vertex2
        vertex2 = tmp
      }

      if (point.y === vertex1.y || point.y === vertex2.y) {
        point.y += 0.01
      }

      if (point.y <= vertex1.y || point.y > vertex2.y) {
        continue
      }

      let xInt =
        ((point.y - vertex1.y) * (vertex2.x - vertex1.x)) /
          (vertex2.y - vertex1.y) +
        vertex1.x
      if (xInt < point.x) {
        intersects++
      }
    }

    return intersects % 2 === 1
  }
}
