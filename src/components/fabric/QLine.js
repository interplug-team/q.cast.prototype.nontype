import { fabric } from 'fabric'
export default class QLine extends fabric.Line {
  length
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

  delete() {
    this.group.canvas.remove(this.group)
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

  #addLengthText() {
    const dx = this.x2 - this.x1
    const dy = this.y2 - this.y1
    const length = Math.sqrt(dx * dx + dy * dy)

    this.length = length.toFixed(0)

    const text = new fabric.Text(this.length, {
      left: (this.x1 + this.x2) / 2,
      top: (this.y1 + this.y2) / 2,
      fontSize: 16,
      selectable: false,
    })

    this.#makeGroupItem([this, text])
  }
}
