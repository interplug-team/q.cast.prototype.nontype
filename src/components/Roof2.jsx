import { useCanvas } from '@/hooks/useCanvas'
import { useEffect } from 'react'
import { UseMode, useMode } from '@/hooks/useMode'

export default function Roof2() {
  const { canvas, handleRedo, handleUndo, handleClear } = useCanvas('canvas')

  const { mode, changeMode, setCanvas } = useMode()

  useEffect(() => {
    // canvas가 없는 경우
    if (!canvas) return
    // canvas가 있는 경우
    changeMode(canvas, mode)
  }, [mode, canvas])

  return (
    <>
      <div className="flex justify-center my-8">
        <button
          className={`w-30 mx-2 p-2 rounded ${mode === UseMode.DRAW_LINE ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
          onClick={() => changeMode(canvas, UseMode.DRAW_LINE)}
        >
          기준선 긋기 모드
        </button>
        <button
          className={`w-30 mx-2 p-2 rounded ${mode === UseMode.EDIT ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
          onClick={() => changeMode(canvas, UseMode.EDIT)}
        >
          에디팅모드
        </button>
        <button
          className={`w-30 mx-2 p-2 rounded ${mode === UseMode.TEMPLATE ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
          onClick={() => changeMode(canvas, UseMode.TEMPLATE)}
        >
          템플릿모드
        </button>
        <button
          className={`w-30 mx-2 p-2 rounded ${mode === UseMode.TEXTBOX ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
          onClick={() => changeMode(canvas, UseMode.TEXTBOX)}
        >
          텍스트박스 모드
        </button>
        <button
          className={`w-30 mx-2 p-2 rounded ${mode === UseMode.DRAW_RECT ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
          onClick={() => changeMode(canvas, UseMode.DRAW_RECT)}
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
