import { useCanvas } from '@/hooks/useCanvas'
import { useEffect, useRef } from 'react'

export default function Roof2() {
  const { canvas } = useCanvas('canvas')
  const points = useRef([])
  useEffect(() => {
    canvas?.on('mouse:down', function (options) {
      const pointer = canvas?.getPointer(options.e)
      const circle = new fabric.Circle({
        radius: 5,
        fill: 'transparent', // 원 안을 비웁니다.
        stroke: 'black', // 원 테두리 색상을 검은색으로 설정합니다.
        left: pointer.x,
        top: pointer.y,
        originX: 'center',
        originY: 'center',
        selectable: false,
      })

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

          let direction
          if (Math.abs(vector.x) > Math.abs(vector.y)) {
            // x축 방향으로 더 많이 이동
            direction = vector.x > 0 ? 'right' : 'left'
          } else {
            // y축 방향으로 더 많이 이동
            direction = vector.y > 0 ? 'bottom' : 'top'
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
              direction: direction,
            },
          )

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
            radius: 5,
            fill: 'transparent', // 원 안을 비웁니다.
            stroke: 'black', // 원 테두리 색상을 검은색으로 설정합니다.
            left: points.current[0].left + scaledVector.x,
            top: points.current[0].top + scaledVector.y,
            originX: 'center',
            originY: 'center',
            selectable: false,
          })

          canvas?.add(line)
          canvas?.add(text)
          canvas?.add(endPointCircle)
          points.current.forEach((point) => {
            canvas?.remove(point)
          })
          points.current = [endPointCircle]
        }
      }

      canvas?.renderAll()
    })
  }, [canvas])
  return (
    <>
      <div className="flex justify-center my-8"></div>

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
