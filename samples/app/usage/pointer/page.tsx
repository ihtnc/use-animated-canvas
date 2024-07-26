'use client'

import { type AnimatedCanvasRenderFunction, use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { type PointerEventHandler } from 'react'
import { useDarkMode } from 'usehooks-ts'

export default function Pointer() {
  type ClickData = { x: number, y: number, new: boolean, display: boolean }
  let current: ClickData | null = null

  const { isDarkMode } = useDarkMode()

  const initialiseData = () => []

  const renderBackground: AnimatedCanvasRenderFunction<Array<ClickData>> = (context, data) => {
    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'top'
    context.fillText('Click to add', 5, 5)
    context.fillText('a point', 5, 25)
    context.fillText('Drag to view', 5, 45)
    context.fillText('coordinates', 5, 65)
  }

  const render: AnimatedCanvasRenderFunction<Array<ClickData>> = (context, data) => {
    const current = data?.data ?? []
    if (current.length === 0) { return }

    let previous: ClickData | null = null
    for(let i = 0; current.length > i; i++) {
      const item = current[i]
      context.strokeStyle = isDarkMode ? '#B6391F' : '#FF0000'
      context.beginPath()
      context.arc(item.x, item.y, 3, 0, 2*Math.PI)
      context.stroke()

      if (previous !== null) {
        context.strokeStyle = isDarkMode ? '#E5E7EB' : '#000000'
        context.beginPath()
        context.moveTo(previous.x, previous.y)
        context.lineTo(item.x, item.y)
        context.stroke()
      }

      previous = item
    }
  }

  const renderForeground: AnimatedCanvasRenderFunction<Array<ClickData>> = (context, data) => {
    if (data?.data === undefined || data.data.length === 0) { return }

    const lastItem = data.data[data.data.length - 1]
    if (lastItem.new == false || lastItem.display === false) { return }

    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'top'
    context.fillText(`{x=${lastItem.x}, y=${lastItem.y}}`, 5, context.canvas.height - 20)
  }

  const { Canvas } = use2dAnimatedCanvas<Array<ClickData>>({
    initialiseData,
    preRenderTransform: (data) => {
      let list = data.data ?? []
      if (current === null) { list = [] }
      else { list.push(current) }

      data.data = list
      return data
    },
    renderBackground,
    render,
    renderForeground,
    postRenderTransform: (data) => {
      if (data.data !== undefined) {
        data.data = data.data.filter((item) => item.new == false)
      }

      if (current !== null) { current.new = true }
      return data
    }
  })

  const onPointerEnterHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    current = { x, y, new: true, display: false }
  }

  const onPointerMoveHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    current = { x, y, new: true, display: current?.display ?? false }
  }

  const onPointerDownHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    if (current === null) { return }
    current.display = true
  }

  const onPointerUpHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    if (current === null) { return }
    current.new = false
    current.display = false
  }

  const onPointerOutHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
    current = null
  }

  const code = `
    export default function Pointer() {
      type ClickData = { x: number, y: number, new: boolean, display: boolean }

      // will store the value for the current mouse position
      let current: ClickData | null = null

      const initialiseData = () => []

      const renderBackground: AnimatedCanvasRenderFunction<Array<ClickData>> = (context, data) => {
        // render instructions in the top left corner
      }

      const render: AnimatedCanvasRenderFunction<Array<ClickData>> = (context, data) => {
        // for each click data in the array, render a small circle
        //   then connect each circle with a line
        //   from the coordinates of previous data in the array
      }

      const renderForeground: AnimatedCanvasRenderFunction<Array<ClickData>> = (context, data) => {
        // get the current value from the array
        // the data transformation logic ensures that the current value
        //   will always be the last item in the array
        // render coordinates of the current value in the bottom left corner
        //   if it is flagged for display
      }

      // expected data is an array of ClickData
      const { Canvas } = use2dAnimatedCanvas<Array<ClickData>>({
        initialiseData,
        preRenderTransform: (data) => {
          // add the current value to the array
          // this is to ensure that the current value
          //   will be included in rendering
          return data
        },
        renderBackground,
        render,
        renderForeground,
        postRenderTransform: (data) => {
          // remove any "new" data from the array
          // set the current value as "new"
          // this ensures that the current value is added permanently
          //   to the array only once and only on pointer click
          return data
        }
      })

      const onPointerEnterHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
        // set the current value based on the translated coordinates
        //   since the canvas coordinates are relative to the viewport
        // flag the current value as "new" and not for display
      }

      const onPointerMoveHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
        // set the current value based on the translated coordinates
        //   since the canvas coordinates are relative to the viewport
        // flag the current value as "new"
      }

      const onPointerDownHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
        // flag the current value for display
        // this enables the coordinates of the current value
        //   to be rendered on the canvas
      }

      const onPointerUpHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
        // flag the current value as not "new"
        // this enables the current value to be added permanently to the data
        // flag the current value as not for display
        // this prevents the coordinates of the current value
        //   from being rendered on the canvas
      }

      const onPointerOutHandler: PointerEventHandler<HTMLCanvasElement> = (event) => {
        // clear the data
      }

      return <Canvas
        onPointerEnter={onPointerEnterHandler}
        onPointerMove={onPointerMoveHandler}
        onPointerDown={onPointerDownHandler}
        onPointerUp={onPointerUpHandler}
        onPointerOut={onPointerOutHandler}
      />
    }
  `

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black dark:border-gray-300'
        onPointerEnter={onPointerEnterHandler}
        onPointerMove={onPointerMoveHandler}
        onPointerDown={onPointerDownHandler}
        onPointerUp={onPointerUpHandler}
        onPointerOut={onPointerOutHandler}
      />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
