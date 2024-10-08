'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function RenderContext() {
  const globalFilter = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = '#7B3F00'
    context.lineWidth = 1
  }

  const { Canvas } = use2dAnimatedCanvas({
    globalFilter,
    renderBackground: (context, data) => {
      context.lineWidth += 2

      const frame = data?.drawData?.frame ?? 0
      const center = context.canvas.width / 4
      const radius = center
      const current = (frame + radius * 0.5) % radius
      context.beginPath()
      context.arc(center, center, current, 0, 2*Math.PI)
      context.stroke()
    },
    render: (context, data) => {
      context.lineWidth += 2

      context.save()
      context.strokeStyle = data.drawData.isDarkMode ? '#E5E7EB' : '#000000'
      const frame = data?.drawData?.frame ?? 0
      const center = context.canvas.width / 2
      const radius = context.canvas.width / 4
      const current = (frame) % radius
      context.beginPath()
      context.arc(center, center, current, 0, 2*Math.PI)
      context.stroke()
      context.restore()
    },
    renderForeground: (context, data) => {
      context.lineWidth += 2

      const frame = data?.drawData?.frame ?? 0
      const center = context.canvas.width * 0.75
      const radius = context.canvas.width / 4
      const current = (frame + radius * 1.75) % radius
      context.beginPath()
      context.setLineDash([current / 2])
      context.arc(center, center, current, 0, 2*Math.PI)
      context.stroke()
    },
    options: {
      autoResetContext: false
    }
  })

  const code = `
    export default function RenderContext() {
      const globalFilter = (context) => {
        // set the line color and line width for the entire canvas
      }

      const { Canvas } = use2dAnimatedCanvas({
        globalFilter,
        renderBackground: (context, data) => {
          // increase the line width of the canvas
          // render a circle in the top left of the canvas
          //   that grows a little bit every frame
        },
        render: (context, data) => {
          // increase the line width of the canvas

          // when the autoResetContext option is set to false,
          //   it is important to save and restore the context
          //   to prevent layer-specific context changes from persisting to other layers

          // save the current settings of the context so we can restore it later
          // note that the increased line width made by this layer
          //   will be included in the saved settings
          context.save()

          // set the line color of the canvas
          // render a circle in the middle of the canvas
          //   that grows a little bit every frame

          // revert any changes made since the last context save call
          context.restore()
        },
        renderForeground: (context, data) => {
          // because the main layer has saved the context
          //   prior to making changes to the line color,
          //   and since it has restored the context at the end,
          //   the line color defined from the global filter
          //   will be reapplied to this layer
          // also, the line width defined by the main layer will not be reset

          // increase the line width of the canvas
          // set the line dash pattern of the canvas
          // render a circle in the bottom right of the canvas
          //   that grows a little bit every frame
        },
        options: {
          // by default, the context is reset after each layer is rendered
          // setting autoResetContext to false will prevent the context from being reset
          // this is useful when you want changes from one layer
          //   to persist into other layers
          // if this was set to true, the resulting render would be that
          //   each layer will have the same line width
          //   instead of the layers having progressively increasing line width
          autoResetContext: false

          // also, notice that even if autoResetContext is set to false,
          //   the line dash changes to the context from the last render function
          //   did not persist on succeeding frames
          // this is because the context is automatically reset before the start of each frame
          // if it didn't, then the line dash pattern would have been applied to all layers
          //   after the first frame
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
