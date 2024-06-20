import { createGroupWithLineAndText, getDistance } from '@/app/util/canvas-util'
import { useCanvas } from '@/hooks/useCanvas'
import { fabric } from 'fabric'
import { v4 as uuidv4 } from 'uuid'

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
        { x: 300, y: 100 }, // 우상단
        { x: 250, y: 200 }, // 우하단
        { x: 150, y: 200 }, // 좌하단
      ],
      {
        name: uuidv4(),
        stroke: 'red',
        opacity: 0.4,
        strokeWidth: 3,
        selectable: true,
      },
    )
    attachCustomControlOnPolygon(trapezoid)
    addShape(trapezoid)
  }

  const addTextWithLine = () => {
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

    const group = createGroupWithLineAndText(horizontalLine, text)
    addShape(group)

    // 선의 길이가 변경될 때마다 텍스트를 업데이트하는 이벤트 리스너를 추가합니다.
    group.on('modified', () => updateTextOnLineChange(group, text))
  }

  const randomColor = () => {
    return '#' + Math.round(Math.random() * 0xffffff).toString(16)
  }

  return (
    <>
      <div className="flex justify-center my-8 w-full">
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
        <button
          className="w-30 mx-2 p-2 rounded bg-black text-white"
          onClick={addTextWithLine}
        >
          숫자가 있는 선
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
