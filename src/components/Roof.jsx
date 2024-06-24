import { addDistanceTextToPolygon, getDistance } from '@/app/util/canvas-util'
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
  } = useCanvas('canvas')

  useEffect(() => {
    let circle = new fabric.Circle({
      radius: 40,
      fill: 'rgba(200, 0, 0, 0.3)',
      originX: 'center',
      originY: 'center',
    })

    let text = new fabric.Textbox('AJLoveChina', {
      originX: 'center',
      originY: 'center',
      textAlign: 'center',
      fontSize: 12,
    })

    let group = new fabric.Group([circle, text], {
      left: 100,
      top: 100,
      originX: 'center',
      originY: 'center',
    })

    group.on('mousedblclick', () => {
      // textForEditing is temporary obj,
      // and will be removed after editing
      console.log(text.type)
      let textForEditing = new fabric.Textbox(text.text, {
        originX: 'center',
        originY: 'center',
        textAlign: text.textAlign,
        fontSize: text.fontSize,

        left: group.left,
        top: group.top,
      })

      // hide group inside text
      text.visible = false
      // note important, text cannot be hidden without this
      group.addWithUpdate()

      textForEditing.visible = true
      // do not give controls, do not allow move/resize/rotation on this
      textForEditing.hasConstrols = false

      // now add this temporary obj to canvas
      canvas.add(textForEditing)
      canvas.setActiveObject(textForEditing)
      // make the cursor showing
      textForEditing.enterEditing()
      textForEditing.selectAll()

      // editing:exited means you click outside of the textForEditing
      textForEditing.on('editing:exited', () => {
        let newVal = textForEditing.text
        let oldVal = text.text

        // then we check if text is changed
        if (newVal !== oldVal) {
          text.set({
            text: newVal,
            visible: true,
          })

          // comment before, you must call this
          group.addWithUpdate()

          // we do not need textForEditing anymore
          textForEditing.visible = false
          canvas?.remove(textForEditing)

          // optional, buf for better user experience
          canvas?.setActiveObject(group)
        }
      })
    })

    canvas?.add(group)
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
        { x: 750, y: 700 }, // 우하단
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
    attachCustomControlOnPolygon(trapezoid)
    const group = addDistanceTextToPolygon(trapezoid)
    addGroupClickEvent(group)
    canvas?.add(group)
    canvas?.renderAll()
  }

  // group에 클릭 이벤트를 추가하여 클릭 시 group을 제거하고 object들만 남기는 함수
  function addGroupClickEvent(group) {
    group.on('selected', (e) => {
      console.log(e)
    })
    group.on('mousedblclick', (e) => {
      // textForEditing is temporary obj,
      // and will be removed after editing
      const pointer = canvas?.getPointer(e.e) // 마우스 클릭 위치 가져오기
      let minDistance = Infinity
      let closestTextbox = null
      const groupPoint = group.getCenterPoint()
      group.getObjects().forEach(function (object) {
        if (object.type === 'textbox') {
          // 객체가 TextBox인지 확인

          const objectCenter = object.getCenterPoint() // TextBox 객체의 중심점 가져오기
          const dx = objectCenter.x + groupPoint.x - pointer.x
          const dy = objectCenter.y + groupPoint.y - pointer.y
          const distance = Math.sqrt(dx * dx + dy * dy) // 마우스 클릭 위치와 TextBox 객체 사이의 거리 계산

          if (distance < minDistance) {
            // 가장 짧은 거리를 가진 TextBox 객체 찾기
            minDistance = distance
            closestTextbox = object
          }
        }
      })

      let textForEditing = new fabric.Textbox(closestTextbox.text, {
        originX: 'center',
        originY: 'center',
        textAlign: closestTextbox.textAlign,
        fontSize: closestTextbox.fontSize,
        left: closestTextbox.left + groupPoint.x,
        top: closestTextbox.top + groupPoint.y,
      })

      // hide group inside text
      closestTextbox.visible = false
      // note important, text cannot be hidden without this
      group.addWithUpdate()

      textForEditing.visible = true
      // do not give controls, do not allow move/resize/rotation on this
      textForEditing.hasConstrols = false

      // now add this temporary obj to canvas
      canvas?.add(textForEditing)
      canvas?.setActiveObject(textForEditing)
      // make the cursor showing
      textForEditing?.enterEditing()
      textForEditing?.selectAll()

      // editing:exited means you click outside of the textForEditing
      textForEditing?.on('editing:exited', () => {
        let newVal = textForEditing.text

        // then we check if text is changed
        closestTextbox.set({
          text: newVal,
          visible: true,
        })

        // comment before, you must call this
        group.addWithUpdate()

        // we do not need textForEditing anymore
        textForEditing.visible = false
        canvas?.remove(textForEditing)

        // optional, buf for better user experience
        canvas?.setActiveObject(group)
      })
    })
  }

  // IText를 수정할 때 해당 값을 길이로 갖는 다른 polygon을 생성하고 다시 그룹화하는 함수
  function addTextModifiedEvent(text, polygon, index) {
    text.on('editing:exited', function () {})
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
