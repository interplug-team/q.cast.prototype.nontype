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
      selectable: false,
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
    // QPolygon의 경계를 구합니다.
    const bounds = this.group.getBoundingRect()

    // 경계 내에서 cell의 크기에 맞게 반복합니다.
    for (let x = bounds.left; x < bounds.left + bounds.width; x += cell.width) {
      for (
        let y = bounds.top;
        y < bounds.top + bounds.height;
        y += cell.height
      ) {
        // 각 위치에 cell을 생성합니다.
        const rect = new QRect({
          left: x,
          top: y,
          viewLengthText: true,
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

        // 모든 꼭지점이 사다리꼴 내부에 있는지 확인합니다.
        const isInside = rectPoints.every((rectPoint) =>
          this.group.containsPoint(rectPoint),
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
}
