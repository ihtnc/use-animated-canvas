'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function UtilityContext() {
  let isDarkMode: boolean = false

  const globalFilter = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = isDarkMode ? '#B6391F' : '#FF0000'
    context.fillStyle = '#7B3F00'
  }

  const { Canvas } = use2dAnimatedCanvas({
    preRenderTransform: (data) => {
      isDarkMode = data.drawData.isDarkMode
      return data
    },
    globalFilter,
    renderBackground: (context) => {
      context.save()
      context.fillStyle = '#E5E7EB'
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)
      context.restore()
    },
    render: (context, data) => {
      const frame = data?.drawData?.frame ?? 0
      context.beginPath()
      context.arc(context.canvas.width / 2, context.canvas.height / 2, 20*Math.sin(frame*0.05)**2, 0, 2*Math.PI)
      context.fill()

      context.font = '25px Arial'
      context.strokeText('Main', 5, 30)
    },
    renderGridLayer: "#68CDFE",
    renderEnvironmentLayer: (context, data) => {
      context.beginPath()
      context.fillRect(context.canvas.width - 25, context.canvas.height - 25, 25, 25)

      context.font = '15px Arial'
      context.strokeText(`fps: ${data.fps}`, 5, context.canvas.height - 5)
    },
    options: {
      autoResetContext: false
    }
  })

  const code = `
    export default function UtilityContext() {
      const globalFilter = (context) => {
        // set the fill color and line color for the entire canvas
      }

      const { Canvas } = use2dAnimatedCanvas({
        globalFilter,
        renderBackground: (context, data) => {
          // when the autoResetContext option is set to false,
          //   it is important to save and restore the context
          //   to prevent layer-specific context changes from persisting to other layers
          context.save()

          // render a gray square that covers the whole canvas

          context.restore()
        },
        render: (context, data) => {
          // notice that the fill color and line color
          //   defined from the global filter are applied here
          // however, the context changes defined in the previous layer render function
          //   did not persist to this layer

          // set the font for the main layer
          // render text in the main layer
          // render a circle that grows/shrinks a little bit every frame
        },

        // this value will end up being the line color for the grid layer
        renderGridLayer: "#68CDFE",

        renderEnvironmentLayer: (context, data) => {
          // even with autoResetContext set to false,
          //   notice that the context changes defined from the global filter
          //   or the grid layer render function did not persist to this layer
          // this is because both the grid and environment details layers
          //   are isolated from the other rendering functions and filters
          // they are even isolated from each other
          // this means that changes to the context made
          //   on either the grid or environment details layer
          //   are not persisted to any other layers

          // render a circle that grows/shrinks a little bit every frame
          // render fps
          // render a small square
        },
        options: {
          // notice that autoResetContext did not affect
          //   how the grid and environment details layers
          //   persisted their corresponding context changes
          autoResetContext: false
        }
      })

      return <Canvas />
    }
  `

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-32 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black dark:border-gray-300' />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
