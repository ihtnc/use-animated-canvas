'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { type MouseEventHandler } from 'react'

export default function ConditionalDebug() {
  const { Canvas, debug } = use2dAnimatedCanvas({
    preRenderTransform: (data) => {
      debug.renderBreakWhen((debugData) => debugData.drawData.frame > 0 && debugData.drawData.frame % 180 === 0)
      return data
    },
    render: (context, data) => {
      const frame = data?.drawData?.frame ?? 0
      context.fillStyle = '#7B3F00'
      context.beginPath()
      context.arc(context.canvas.width / 2, context.canvas.height / 2, 20*Math.sin(frame*0.05)**2, 0, 2*Math.PI)
      context.fill()
    },
    renderEnvironmentLayer: (context, data) => {
      context.fillStyle = data.isDarkMode ? '#E5E7EB' : '#000000'
      context.font = '15px Arial'
      context.fillText(`frame: ${data.frame}`, 5, context.canvas.height - 5)
    },
    options: {
      autoStart: false,
      enableDebug: true
    }
  })

  const code = `
    export default function ConditionalDebug() {
      const { Canvas, debug } = use2dAnimatedCanvas({
        preRenderTransform: (data) => {
          // call debug.renderBreakWhen(conditionFn) to pause rendering
          //   when the specified condition function returns true
          // the condition function on renderBreakWhen will be passed the same data
          //   as the render and filter functions

          // the condition function is set to return true
          //   when the current frame is a multiple of 180
          return data
        },
        render: (context, data) => {
          // render a circle that grows/shrinks a little bit every frame
        },
        renderEnvironmentLayer: (context, data) => {
          // render frame count in the bottom left corner
        },
        options: {
          // setting this to false will prevent the animation
          //   from starting automatically
          // autoStart is set to true by default
          autoStart: false,

          enableDebug: true
        }
      })

      const onClickHandler = (event) => {
        debug.renderStart()
      }

      return <Canvas onClick={onClickHandler} />
    }
  `

  const onClickHandler: MouseEventHandler = (event) => {
    debug.renderStart()
  }

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <span className='ml-8'>Click canvas to start rendering</span>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black dark:border-gray-300'
        onClick={onClickHandler}
      />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
