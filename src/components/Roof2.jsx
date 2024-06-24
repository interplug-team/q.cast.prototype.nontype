import { useCanvas } from '@/hooks/useCanvas'
import { useEffect } from 'react'
import { MODE, useMode } from '@/app/mode'

export default function Roof2() {
  const { canvas } = useCanvas('canvas')

  const { mode, changeMode } = useMode()

  useEffect(() => {
    // canvas가 없는 경우
    if (!canvas) return
    // canvas가 있는 경우
    changeMode(canvas, mode)
  }, [mode])

  return (
    <>
      <div className="flex justify-center my-8">
        <button
          className={`w-30 mx-2 p-2 rounded ${mode === MODE.DRAW_LINE ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
          onClick={() => changeMode(canvas, MODE.DRAW_LINE)}
        >
          기준선 긋기 모드
        </button>
        <button
          className={`w-30 mx-2 p-2 rounded ${mode === MODE.EDIT ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
          onClick={() => changeMode(canvas, MODE.EDIT)}
        >
          에디팅모드
        </button>
        <button
          className={`w-30 mx-2 p-2 rounded ${mode === MODE.TEMPLATE ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
          onClick={() => changeMode(canvas, MODE.TEMPLATE)}
        >
          템플릿모드
        </button>
        <button
          className={`w-30 mx-2 p-2 rounded ${mode === MODE.TEXTBOX ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
          onClick={() => changeMode(canvas, MODE.TEXTBOX)}
        >
          텍스트박스 모드
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
