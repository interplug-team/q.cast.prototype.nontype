import { createGroupWithLineAndText, getDistance } from '@/app/util/canvas-util'
import { useCanvas } from '@/hooks/useCanvas'
import { fabric } from 'fabric'
import { v4 as uuidv4 } from 'uuid'
import { useEffect } from 'react'

export default function Roof() {
  const {
    canvas,
    addShape,
    handleUndo,
    handleRedo,
    handleClear,
    handleCopy,
    handleDelete,
    handleSave,
    handlePaste,
    handleRotate,
    attachCustomControlOnPolygon,
    saveImage,
    handleFlip,
    updateTextOnLineChange,
  } = useCanvas('canvas')

  useEffect(() => {
    // IText 추가
    const text = new fabric.IText('Hello', {
      left: 100,
      top: 100,
      fill: 'red',
    })
    text.on('editing:entered', () => {
      console.log('editing:entered')
    })
    canvas?.add(text)
  }, [canvas])

  const addRect = () => {
    const rect = new fabric.Rect({
      height: 200,
      width: 200,
      top: 10,
      left: 10,
      opacity: 0.4,
      fill: randomColor(),
      stroke: 'red',
      name: uuidv4(),
    })

    addShape(rect)
  }

  const addHorizontalLine = () => {
    const { x1, y1, x2, y2 } = { x1: 20, y1: 100, x2: 220, y2: 100 }
    /**
     * 시작X,시작Y,도착X,도착Y 좌표
     */
    const horizontalLine = new fabric.Line([x1, y1, x2, y2], {
      name: uuidv4(),
      stroke: 'red',
      strokeWidth: 3,
      selectable: true,
    })

    const text = new fabric.Text(getDistance(x1, y1, x2, y2).toString(), {
      fontSize: 20,
      left: (x2 - x1) / 2,
      top: y1 - 20,
    })

    const group = new fabric.Group([horizontalLine, text], {
      left: 20,
      top: 20,
    })

    // addShape(horizontalLine)
    addShape(group)
    console.log(JSON.stringify(canvas))
  }

  const addVerticalLine = () => {
    const verticalLine = new fabric.Line([10, 10, 10, 100], {
      name: uuidv4(),
      stroke: 'red',
      strokeWidth: 3,
      selectable: true,
    })

    addShape(verticalLine)
  }

  const addTriangle = () => {
    const triangle = new fabric.Triangle({
      name: uuidv4(),
      top: 50,
      left: 50,
      width: 100,
      stroke: randomColor(),
      strokeWidth: 3,
    })

    addShape(triangle)
  }

  const addTrapezoid = () => {
    const trapezoid = new fabric.Polygon(
      [
        { x: 100, y: 100 }, // 좌상단
        { x: 500, y: 100 }, // 우상단
        { x: 750, y: 400 }, // 우하단
        { x: 250, y: 400 }, // 좌하단
      ],
      {
        name: uuidv4(),
        stroke: 'red',
        opacity: 0.4,
        strokeWidth: 3,
        selectable: true,
        objectCaching: false,
      },
    )
    // attachCustomControlOnPolygon(trapezoid)

    const group = addDistanceTextToPolygon(trapezoid)
    addGroupClickEvent(group)
    group.getObjects().forEach(function (object, index) {
      if (object.type === 'i-text') {
        addTextModifiedEvent(object, trapezoid, index)
      }
    })
    canvas?.add(group)
    canvas?.renderAll()
  }

  // group에 클릭 이벤트를 추가하여 클릭 시 group을 제거하고 object들만 남기는 함수
  function addGroupClickEvent(group) {
    group.on('mousedown', function () {
      const objects = group.getObjects()
      canvas?.remove(group)
      objects.forEach(function (object) {
        canvas?.add(object)
      })
      canvas?.renderAll()
    })
  }

  // polygon의 각 변에 해당 점과 점 사이의 거리를 나타내는 IText를 추가하는 함수
  function addDistanceTextToPolygon(polygon) {
    const points = polygon.get('points')
    const texts = []

    for (let i = 0; i < points.length; i++) {
      const start = points[i]
      const end = points[(i + 1) % points.length] // 다음 점 (마지막 점의 경우 첫번째 점으로)
      const distance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2),
      ) // 두 점 사이의 거리 계산

      const text = new fabric.IText(distance.toFixed(2), {
        // 소수 둘째자리까지 표시
        left: (start.x + end.x) / 2, // 텍스트의 위치는 두 점의 중간
        top: (start.y + end.y) / 2,
        fontSize: 10,
        editable: true,
      })

      texts.push(text)
    }

    return new fabric.Group([polygon, ...texts], {
      // polygon과 텍스트들을 그룹화
      selectable: true,
    })
  }

  // IText를 수정할 때 해당 값을 길이로 갖는 다른 polygon을 생성하고 다시 그룹화하는 함수
  function addTextModifiedEvent(text, polygon, index) {
    text.on('editing:entered', function () {
      console.log(123)
      const newLength = parseFloat(text.text)
      const points = polygon.get('points')
      const start = points[index]
      const end = points[(index + 1) % points.length]
      const vector = { x: end.x - start.x, y: end.y - start.y } // start에서 end로의 벡터
      const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y) // 벡터의 길이 (현재 거리)
      const normalizedVector = { x: vector.x / length, y: vector.y / length } // 벡터를 정규화 (길이를 1로)
      const scaledVector = {
        x: normalizedVector.x * newLength,
        y: normalizedVector.y * newLength,
      } // 정규화된 벡터를 새로운 길이로 스케일링

      // end 점을 새로운 위치로 이동
      end.x = start.x + scaledVector.x
      end.y = start.y + scaledVector.y

      // polygon을 다시 그룹화
      const newGroup = addDistanceTextToPolygon(polygon)
      addGroupClickEvent(newGroup)
      canvas.add(newGroup)
      canvas.renderAll()
    })
  }

  const randomColor = () => {
    return '#' + Math.round(Math.random() * 0xffffff).toString(16)
  }

  return (
    <>
      <div className="flex justify-center my-8">
        <button
          className="w-30 mx-2 p-2 rounded bg-blue-500 text-white"
          onClick={addRect}
        >
          ADD RECTANGLE
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-blue-500 text-white"
          onClick={addHorizontalLine}
        >
          ADD HORIZONTAL LINE
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-blue-500 text-white"
          onClick={addVerticalLine}
        >
          ADD VERTICALITY LINE
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-blue-500 text-white"
          onClick={addTriangle}
        >
          ADD TRIANGLE
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-blue-500 text-white"
          onClick={addTrapezoid}
        >
          ADD TRAPEZOID
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-black text-white"
          onClick={handleCopy}
        >
          COPY shape
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-red-500 text-white"
          onClick={handleDelete}
        >
          DELETE
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-red-500 text-white"
          onClick={handleClear}
        >
          CLEAR
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-green-500 text-white"
          onClick={handleUndo}
        >
          UNDO
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-green-300 text-white"
          onClick={handleRedo}
        >
          REDO
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-black text-white"
          onClick={handleSave}
        >
          저장
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-black text-white"
          onClick={handlePaste}
        >
          붙여넣기
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-black text-white"
          onClick={() => handleRotate()}
        >
          45도 회전
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-black text-white"
          onClick={() => {
            saveImage('제목')
          }}
        >
          이미지 저장
        </button>
        <button
          className="w-30 mx-2 p-2 rounded bg-black text-white"
          onClick={handleFlip}
        >
          도형반전
        </button>
      </div>

      <div
        className="flex justify-center"
        style={{
          border: '1px solid',
          width: 1000,
          height: 1000,
          margin: 'auto',
        }}
      >
        <canvas id="canvas" />
      </div>
    </>
  )
}
