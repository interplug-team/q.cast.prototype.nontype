import { fabric } from 'fabric'
import QRect from '@/components/fabric/QRect'
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

  fillCell(cell = { width: 50, height: 100 }) {
    // QPolygon의 점들을 가져옵니다.
    const points = this.getPoints()

    // 점들을 사용하여 QPolygon의 경계를 정의합니다.
    const bounds = fabric.util.makeBoundingBoxFromPoints(points)
    // 경계 내에서 cell의 크기에 맞게 반복합니다.
    for (let x = bounds.left; x < bounds.left + bounds.width; x += cell.width) {
      for (
        let y = bounds.top;
        y < bounds.top + bounds.height;
        y += cell.height
      ) {
        // 각 위치에 cell을 생성합니다.
        const rect = new fabric.Rect({
          left: x,
          top: y,
          width: cell.width,
          height: cell.height,
          fill: 'transparent',
          stroke: 'black',
          selectable: false,
        })

        // 사각형의 각 꼭지점을 생성합니다.
        const rectPoints = [
          new fabric.Point(rect.left, rect.top),
          new fabric.Point(rect.left + rect.width, rect.top),
          new fabric.Point(rect.left, rect.top + rect.height),
          new fabric.Point(rect.left + rect.width, rect.top + rect.height),
        ]

        console.log(rectPoints)

        // 모든 꼭지점이 사다리꼴 내부에 있는지 확인합니다.
        const isInside = rectPoints.every((rectPoint) =>
          this.inPolygon(rectPoint),
        )

        // 모든 꼭지점이 사다리꼴 내부에 있을 경우에만 사각형을 그립니다.
        if (isInside) {
          this.group.canvas.add(rect)
        }
      }
    }

    // 캔버스를 다시 그립니다.
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
