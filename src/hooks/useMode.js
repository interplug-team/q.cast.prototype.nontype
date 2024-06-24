import { useRef, useState } from 'react'

export const UseMode = {
  DRAW_LINE: 'drawLine', // 기준선 긋기모드
  EDIT: 'edit',
  TEMPLATE: 'template',
  TEXTBOX: 'textbox',
  DRAW_RECT: 'drawRect',
}

export function useMode() {
  const [mode, setMode] = useState(UseMode.EDIT)
  const points = useRef([])
  const historyPoints = useRef([])
  const historyLines = useRef([])
  const [canvas, setCanvas] = useState(null)

  const addEvent = (mode) => {
    switch (mode) {
      case 'drawLine':
        drawLineMode()
        break
      case 'edit':
        editMode()
        break
      case 'template':
        templateMode()
        break
      case 'textbox':
        textboxMode()
        break
      case 'drawRect':
        drawRectMode()
        break
    }
  }

  const changeMode = (canvas, mode) => {
    setMode(mode)
    // mode변경 시 이전 이벤트 제거
    canvas?.off('mouse:down')
    setCanvas(canvas)
    addEvent(mode)
  }

  const editMode = () => {
    canvas?.on('mouse:down', function (options) {
      const pointer = canvas?.getPointer(options.e)
      const circle = new fabric.Circle({
        radius: 1,
        fill: 'transparent', // 원 안을 비웁니다.
        stroke: 'black', // 원 테두리 색상을 검은색으로 설정합니다.
        left: pointer.x,
        top: pointer.y,
        originX: 'center',
        originY: 'center',
        selectable: false,
      })

      historyPoints.current.push(circle)
      points.current.push(circle)
      canvas?.add(circle)

      if (points.current.length === 2) {
        const length = Number(prompt('길이를 입력하세요:'))
        // length 값이 숫자가 아닌 경우
        if (isNaN(length) || length === 0) {
          // 기존에 추가된 circle과 pointer를 제거합니다.
          points.current.forEach((point) => {
            canvas?.remove(point)
          })
          historyPoints.current.pop()
          points.current = []
          return
        }

        if (length) {
          const vector = {
            x: points.current[1].left - points.current[0].left,
            y: points.current[1].top - points.current[0].top,
          }
          const slope = Math.abs(vector.y / vector.x) // 기울기 계산

          let scaledVector
          if (slope >= 1) {
            // 기울기가 1 이상이면 x축 방향으로 그림
            scaledVector = {
              x: 0,
              y: vector.y >= 0 ? Number(length) : -Number(length),
            }
          } else {
            // 기울기가 1 미만이면 y축 방향으로 그림
            scaledVector = {
              x: vector.x >= 0 ? Number(length) : -Number(length),
              y: 0,
            }
          }

          const line = new fabric.Line(
            [
              points.current[0].left,
              points.current[0].top,
              points.current[0].left + scaledVector.x,
              points.current[0].top + scaledVector.y,
            ],
            {
              stroke: 'black',
              strokeWidth: 2,
              selectable: false,
              direction: getDirection(points.current[0], points.current[1]),
            },
          )

          historyLines.current.push(line)
          console.log(line)
          const text = new fabric.Text(length.toString(), {
            left:
              (points.current[0].left +
                points.current[0].left +
                scaledVector.x) /
              2,
            top:
              (points.current[0].top + points.current[0].top + scaledVector.y) /
              2,
            fontSize: 15,
            originX: 'center',
            originY: 'center',
            selectable: false,
          })

          // 라인의 끝에 점을 추가합니다.
          const endPointCircle = new fabric.Circle({
            radius: 1,
            fill: 'transparent', // 원 안을 비웁니다.
            stroke: 'black', // 원 테두리 색상을 검은색으로 설정합니다.
            left: points.current[0].left + scaledVector.x,
            top: points.current[0].top + scaledVector.y,
            originX: 'center',
            originY: 'center',
            selectable: false,
          })

          console.log(endPointCircle)

          canvas?.add(line)
          canvas?.add(text)
          canvas?.add(endPointCircle)

          historyPoints.current.push(endPointCircle)

          points.current.forEach((point) => {
            canvas?.remove(point)
          })
          points.current = [endPointCircle]
        }
      }

      canvas?.renderAll()
    })
  }

  const templateMode = () => {
    changeMode(canvas, UseMode.EDIT)

    if (historyPoints.current.length >= 4) {
      const firstPoint = historyPoints.current[0]
      const lastPoint = historyPoints.current[historyPoints.current.length - 1]
      historyPoints.current.forEach((point) => {
        canvas?.remove(point)
      })
      drawLineWithLength(lastPoint, firstPoint)
      points.current = []
      historyPoints.current = []
      makePolygon()
    }
  }

  const textboxMode = () => {
    canvas?.on('mouse:down', function (options) {
      if (canvas?.getActiveObject()?.type === 'textbox') return
      const pointer = canvas?.getPointer(options.e)

      const textbox = new fabric.Textbox('텍스트를 입력하세요', {
        left: pointer.x,
        top: pointer.y,
        width: 150, // 텍스트박스의 너비를 설정합니다.
        fontSize: 16, // 텍스트의 크기를 설정합니다.
      })

      canvas?.add(textbox)
      canvas?.setActiveObject(textbox) // 생성된 텍스트박스를 활성 객체로 설정합니다.
      canvas?.renderAll()
      // textbox가 active가 풀린 경우 editing mode로 변경
      textbox?.on('editing:exited', function () {
        changeMode(canvas, UseMode.EDIT)
      })
    })
  }

  const drawLineMode = () => {
    canvas?.on('mouse:down', function (options) {
      const pointer = canvas?.getPointer(options.e)

      const line = new fabric.Line(
        [pointer.x, 0, pointer.x, canvas.height], // y축에 1자 선을 그립니다.
        {
          stroke: 'black',
          strokeWidth: 2,
          selectable: false,
        },
      )

      canvas?.add(line)
      canvas?.renderAll()
    })
  }

  const drawRectMode = () => {
    let rect, isDown, origX, origY
    canvas.on('mouse:down', function (o) {
      isDown = true
      const pointer = canvas.getPointer(o.e)
      origX = pointer.x
      origY = pointer.y
      rect = new fabric.Rect({
        left: origX,
        top: origY,
        originX: 'left',
        originY: 'top',
        width: pointer.x - origX,
        height: pointer.y - origY,
        angle: 0,
        fill: 'transparent',
        stroke: 'black',
        transparentCorners: false,
      })
      canvas.add(rect)
    })

    canvas.on('mouse:move', function (o) {
      if (!isDown) return
      const pointer = canvas.getPointer(o.e)
      if (origX > pointer.x) {
        rect.set({ left: Math.abs(pointer.x) })
      }
      if (origY > pointer.y) {
        rect.set({ top: Math.abs(pointer.y) })
      }

      rect.set({ width: Math.abs(origX - pointer.x) })
      rect.set({ height: Math.abs(origY - pointer.y) })
      canvas.renderAll()
    })

    canvas.on('mouse:up', function (o) {
      isDown = false
    })
  }

  /**
   * 두 점 사이의 방향을 반환합니다.
   */
  const getDirection = (a, b) => {
    const vector = {
      x: b.left - a.left,
      y: b.top - a.top,
    }

    if (Math.abs(vector.x) > Math.abs(vector.y)) {
      // x축 방향으로 더 많이 이동
      return vector.x > 0 ? 'right' : 'left'
    } else {
      // y축 방향으로 더 많이 이동
      return vector.y > 0 ? 'bottom' : 'top'
    }
  }

  /**
   * 두 점을 연결하는 선과 길이를 그립니다.
   */
  const drawLineWithLength = (a, b) => {
    const vector = {
      x: b.left - a.left,
      y: b.top - a.top,
    }
    const line = new fabric.Line([a.left, a.top, b.left, b.top], {
      stroke: 'black',
      strokeWidth: 2,
      selectable: false,
      direction: getDirection(a, b),
    })
    historyLines.current.push(line)

    const text = new fabric.Text(
      Math.round(Math.sqrt(vector.x ** 2 + vector.y ** 2)).toString(),
      {
        left: (a.left + b.left) / 2,
        top: (a.top + b.top) / 2,
        fontSize: 15,
        originX: 'center',
        originY: 'center',
        selectable: false,
      },
    )

    canvas?.add(line)
    canvas?.add(text)
    canvas?.renderAll()
  }

  const makePolygon = () => {
    // 캔버스에서 모든 라인 객체를 찾습니다.
    const lines = historyLines.current
    historyLines.current = []

    // 각 라인의 시작점과 끝점을 사용하여 다각형의 점 배열을 생성합니다.
    const points = lines.map((line) => ({ x: line.x1, y: line.y1 }))

    // 모든 라인 객체를 캔버스에서 제거합니다.
    lines.forEach((line) => canvas.remove(line))

    // 점 배열을 사용하여 새로운 다각형 객체를 생성합니다.
    const polygon = new fabric.Polygon(points, {
      stroke: 'black',
      fill: 'transparent',
      selectable: false,
    })

    // 새로운 다각형 객체를 캔버스에 추가합니다.
    canvas.add(polygon)

    // 캔버스를 다시 그립니다.
    canvas.renderAll()
  }

  return { mode, changeMode, setCanvas }
}
