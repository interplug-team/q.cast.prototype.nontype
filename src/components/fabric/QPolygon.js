export default class QPolygon extends fabric.Polygon {
  constructor(points, option) {
    super(points, option)

    this.on('added', () => {
      if (this.isLengthText) {
        this.addLengthText()
      }
    })
  }

  addLengthText() {
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

    const group = new fabric.Group(groupItems, {
      selectable: false,
      type: 'QPolygon',
    })

    this.canvas.add(group)
    this.canvas.renderAll()
    this.canvas.remove(this)
  }
}
