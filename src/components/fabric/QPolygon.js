import { fabric } from 'fabric'
export default class QPolygon extends fabric.Polygon {
  group

  constructor(points, option) {
    super(points, option)

    this.on('added', () => {
      if (this.isLengthText) {
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
}
