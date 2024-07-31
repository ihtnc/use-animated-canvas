'use client'

import { type AnimatedCanvasRenderFunction, use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { type MouseEventHandler } from 'react'

export default function Click() {
  type ClickData = { x: number, y: number, radius: number, opacity: number }
  let current: ClickData | null = null
  const opacityOffset = 0.02

  const initialiseData = () => []

  const renderBackground: AnimatedCanvasRenderFunction<Array<ClickData>> = (context, data) => {
    context.fillStyle = '#808080'
    context.font = '15px Arial'
    context.textBaseline = 'top'
    context.fillText('Click me a lot', 5, 5)
  }

  const render: AnimatedCanvasRenderFunction<Array<ClickData>> = (context, data) => {
    const current = data?.data ?? []
    if (current.length === 0) { return }

    context.fillStyle = data.drawData.isDarkMode ? '#E5E7EB' : '#000000'

    for(let i = 0; current.length > i; i++) {
      context.save()
      const item = current[i]
      context.globalAlpha = item.opacity
      context.beginPath()
      context.arc(item.x, item.y, 20*Math.sin(item.radius*0.05)**2, 0, 2*Math.PI)
      context.fill()
      context.restore()
    }
  }

  const { Canvas } = use2dAnimatedCanvas<Array<ClickData>>({
    initialiseData,
    preRenderTransform: (data) => {
      const list = data.data ?? []
      if (current !== null) { list.push(current) }

      for(let i = 0; list.length > i; i++) {
        list[i].radius += 1
        list[i].opacity = Math.max(list[i].opacity - opacityOffset, 0)
      }

      data.data = list
      return data
    },
    renderBackground,
    render,
    postRenderTransform: (data) => {
      if (data.data !== undefined) {
        data.data = data.data.filter((item) => item.opacity > 0)
      }

      current = null
      return data
    }
  })

  const onClickHandler: MouseEventHandler = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    current = { x, y, radius: 0, opacity: 1 }
  }

  const code = `
    export default function Click() {
      type ClickData = { x: number, y: number, radius: number, opacity: number }

      // will store the initial value for the current click
      let current: ClickData | null = null

      const initialiseData = () => []

      const renderBackground = (context, data) => {
        // render instructions in the top left corner
      }
      const render = (context, data) => {
        // for each click data in the array, render a circle
        //   with the coordinate, radius, and opacity
        //   as specified in the data
      }

      // expected data is an array of ClickData
      const { Canvas } = use2dAnimatedCanvas<Array<ClickData>>({
        initialiseData,
        preRenderTransform: (data) => {
          // add the current value to the array if not null
          // for each click data in the array
          //   adjust the radius and opacity values a little bit
          return data
        },
        renderBackground,
        render,
        postRenderTransform: (data) => {
          // remove items in data that have faded out (opacity <= 0)
          // clear the current value
          // this ensures that the current value is only added once per click
          return data
        }
      })

      // the idea here is to let the render functions
      //   focus on rendering objects on the canvas based on a set of data
      // external factors (like click events), can then update the data
      // these changes on the data are fed back to the render functions
      //   via the transform functions
      // this makes the responsibilities of both the render functions
      //   and the event handlers more defined and straightforward
      const onClickHandler = (event) => {
        // set the initial data value based on the translated coordinates
        //   since the canvas coordinates are relative to the viewport
      }

      return <Canvas onClick={onClickHandler} />
    }
  `

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black dark:border-gray-300'
        onClick={onClickHandler}
      />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
