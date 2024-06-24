import { useCanvas } from '@/hooks/useCanvas'
import { useEffect } from 'react'
import { Mode, UseMode, useMode } from '@/hooks/useMode'

export default function Roof2() {
  const { canvas, handleRedo, handleUndo } = useCanvas('canvas')

  const { mode, changeMode, setCanvas, handleClear } = useMode()

  useEffect(() => {
    if (!canvas) {
      return
    }
    changeMode(canvas, mode)
  }, [canvas, mode])

  return (
    <>
      {canvas && (
        <div className="flex justify-center my-8">
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
