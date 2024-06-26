import { useCanvas } from '@/hooks/useCanvas'
import { useEffect } from 'react'
import { Mode, useMode } from '@/hooks/useMode'
import QRect from '@/components/fabric/QRect'
import QLine from '@/components/fabric/QLine'
import QPolygon from '@/components/fabric/QPolygon'

export default function Roof2() {
  const { canvas, handleRedo, handleUndo } = useCanvas('canvas')

  const {
    mode,
    changeMode,
    handleClear,
    fillCellInPolygon,
    zoomIn,
    zoomOut,
    zoom,
  } = useMode()

  useEffect(() => {
    if (!canvas) {
      return
    }
    changeMode(canvas, mode)
  }, [canvas, mode])

  const makeRect = () => {
    if (canvas) {
      const rect = new QRect({
        left: 100,
        top: 100,
        fill: 'transparent',
        stroke: 'black',
        width: 400,
        height: 100,
        viewLengthText: true, // 이 속성이 true로 설정되면, 사각형의 각 선분의 길이를 표시하는 텍스트가 생성됩니다.
        selectable: false,
      })

      canvas?.add(rect)

      setTimeout(() => rect.delete(), 500)
    }
  }

  const makeLine = () => {
    if (canvas) {
      const line = new QLine([50, 50, 200, 200], {
        stroke: 'black',
        strokeWidth: 2,
        viewLengthText: true, // 이 속성이 true로 설정되면, 선분의 길이를 표시하는 텍스트가 생성됩니다.
        selectable: false,
      })

      canvas?.add(line)

      setTimeout(() => line.delete(), 500)
    }
  }

  const makePolygon = () => {
    if (canvas) {
      const polygon = new QPolygon(
        [
          { x: 100, y: 100 },
          { x: 200, y: 200 },
          { x: 200, y: 300 },
          { x: 100, y: 300 },
        ],
        {
          fill: 'transparent',
          stroke: 'black',
          strokeWidth: 2,

          viewLengthText: true, // 이 속성이 true로 설정되면, 다각형의 각 변의 길이를 표시하는 텍스트가 생성됩니다.
          selectable: true,
        },
      )

      canvas?.add(polygon)

      setTimeout(() => {
        polygon.fillCell({ width: 10, height: 20 })
      }, 500)
    }
  }

  return (
    <>
      {canvas && (
        <div className="flex justify-center my-8">
          <button
            className={`w-30 mx-2 p-2 rounded ${mode === Mode.DEFAULT ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
            onClick={() => changeMode(canvas, Mode.DEFAULT)}
          >
            모드 DEFAULT
          </button>
          <button
            className={`w-30 mx-2 p-2 rounded ${mode === Mode.DRAW_LINE ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
            onClick={() => changeMode(canvas, Mode.DRAW_LINE)}
          >
            기준선 긋기 모드
          </button>
          <button
            className={`w-30 mx-2 p-2 rounded ${mode === Mode.EDIT ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
            onClick={() => changeMode(canvas, Mode.EDIT)}
          >
            에디팅모드
          </button>
          <button
            className={`w-30 mx-2 p-2 rounded ${mode === Mode.TEMPLATE ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
            onClick={() => changeMode(canvas, Mode.TEMPLATE)}
          >
            템플릿
          </button>
          <button
            className={`w-30 mx-2 p-2 rounded ${mode === Mode.TEXTBOX ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
            onClick={() => changeMode(canvas, Mode.TEXTBOX)}
          >
            텍스트박스 모드
          </button>
          <button
            className={`w-30 mx-2 p-2 rounded ${mode === Mode.DRAW_RECT ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
            onClick={() => changeMode(canvas, Mode.DRAW_RECT)}
          >
            사각형 생성 모드
          </button>
          <button
            className="w-30 mx-2 p-2 rounded bg-gray-500 text-white"
            onClick={handleUndo}
          >
            Undo
          </button>
          <button
            className="w-30 mx-2 p-2 rounded bg-gray-500 text-white"
            onClick={handleRedo}
          >
            Redo
          </button>
          <button
            className="w-30 mx-2 p-2 rounded bg-gray-500 text-white"
            onClick={handleClear}
          >
            clear
          </button>
          <button
            className="w-30 mx-2 p-2 rounded bg-gray-500 text-white"
            onClick={zoomIn}
          >
            확대
          </button>
          <button
            className="w-30 mx-2 p-2 rounded bg-gray-500 text-white"
            onClick={zoomOut}
          >
            축소
          </button>
          현재 줌 : {zoom}%
          <button
            className="w-30 mx-2 p-2 rounded bg-gray-500 text-white"
            onClick={makeRect}
          >
            사각형만들기
          </button>
          <button
            className="w-30 mx-2 p-2 rounded bg-gray-500 text-white"
            onClick={makeLine}
          >
            선 추가
          </button>
          <button
            className="w-30 mx-2 p-2 rounded bg-gray-500 text-white"
            onClick={makePolygon}
          >
            다각형 추가
          </button>
        </div>
      )}

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
