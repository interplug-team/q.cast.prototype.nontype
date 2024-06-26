export default class QLine extends fabric.Line {
  length
  constructor(points, option) {
    super(points, option)

    this.on('added', () => {
      if (this.isLengthText) {
        this.addLengthText()
      }
    })
  }

  addLengthText() {
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

    const group = new fabric.Group([this, text], {
      selectable: false,
      type: 'QLine',
    })

    this.canvas.add(group)
    this.canvas.renderAll()
    this.canvas.remove(this)
  }
}
