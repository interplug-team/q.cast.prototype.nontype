export default class QRect extends fabric.Rect {
  constructor(options) {
    super(options)

    this.on('added', () => {
      if (this.isLengthText) {
        this.addLengthText()
      }
    })
  }

  addLengthText() {
    const lines = [
      {
        start: { x: this.left, y: this.top },
        end: { x: this.left + this.width, y: this.top },
      },
      {
        start: { x: this.left + this.width, y: this.top },
        end: { x: this.left + this.width, y: this.top + this.height },
      },
      {
        start: { x: this.left + this.width, y: this.top + this.height },
        end: { x: this.left, y: this.top + this.height },
      },
      {
        start: { x: this.left, y: this.top + this.height },
        end: { x: this.left, y: this.top },
      },
    ]

    const groupItems = [this]

    lines.forEach((line) => {
      const dx = line.end.x - line.start.x
      const dy = line.end.y - line.start.y
      const length = Math.sqrt(dx * dx + dy * dy)

      const text = new fabric.Text(length.toFixed(0), {
        left: (line.start.x + line.end.x) / 2,
        top: (line.start.y + line.end.y) / 2,
        fontSize: 16,
        selectable: false,
      })

      groupItems.push(text)
    })

    const group = new fabric.Group(groupItems, {
      selectable: false,
      type: 'QRect',
    })

    this.canvas.add(group)
    this.canvas.renderAll()
    this.canvas.remove(this)
  }
}
