'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function FilterContext() {
  let isDarkMode: boolean = false

  const globalFilter = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = isDarkMode ? '#FFBF00' : '#FF0000'
    context.fillStyle = '#68CDFE'
    context.font = '30px Arial'
    context.textAlign = 'center'
  }

  const { Canvas } = use2dAnimatedCanvas({
    preRenderTransform: (data) => {
      isDarkMode = data.drawData.isDarkMode
      return data
    },
    globalFilter,
    renderBackgroundFilter: (context) => {
      const center = context.canvas.width / 8
      context.textAlign = 'left'
      context.translate(center, center)
      context.rotate(Math.PI / 2)
    },
    renderBackground: (context) => {
      context.beginPath()
      context.strokeText('back', 0, 0)
      context.fillText('back', 0, 0)
      context.fill()
    },
    renderFilter: (context) => {
      context.globalAlpha = 0.5
    },
    render: (context) => {
      context.strokeText('main', context.canvas.width / 2, context.canvas.height * 0.75)
      context.fillText('main', context.canvas.width / 2, context.canvas.width * 0.75)
    },
    renderForegroundFilter: (context) => {
      context.fillStyle = '#7B3F00'
    },
    renderForeground: (context, data) => {
      const frame = data?.drawData?.frame ?? 0
      const center = context.canvas.width * 0.75
      const radius = context.canvas.width / 4
      const current = frame % radius
      context.beginPath()
      context.arc(center, center, current, 0, 2*Math.PI)
      context.fill()
      context.stroke()
    },
    options: {
      autoResetContext: false
    }
  })

  const code = `
    export default function FilterContext() {
      const globalFilter = (context) => {
        // set the line color, fill color, font, and text alignment
        //   for the entire canvas
      }

      const { Canvas } = use2dAnimatedCanvas({
        globalFilter,
        renderBackgroundFilter: (context) => {
          // regardless of the autoResetContext value,
          //   changes to the context here will only apply to the background layer

          // rotate the background layer 90 degrees clockwise
        },
        renderBackground: (context, data) => {
          // notice that the line color, fill color, font, and text alignment
          //   defined from the global filter are applied here
          //   as well as the rotation defined in the corresponding layer filter

          // render text in the canvas
        },
        renderFilter: (context) => {
          // regardless of the autoResetContext value,
          //   changes to the context here will only apply to the main layer

          // set opacity for the main layer
        },
        render: (context, data) => {
          // notice that the line color, fill color, font, and text alignment
          //   defined from the global filter are applied here
          //   as well as the opacity defined in the corresponding layer filter
          // however, the rotation defined in the previous layer filter
          //   did not persist to this layer

          // render text in the canvas
        },
        renderForegroundFilter: (context) => {
          // regardless of the autoResetContext value,
          //   changes to the context here will only apply to the foreground layer

          // set the fill color for the foreground layer
        },
        renderForeground: (context, data) => {
          // notice that the line color, font, and text alignment
          //   defined from the global filter are applied here
          // however, the fill color defined in the global filter was
          //   replaced with the fill color defined in the corresponding layer filter
          // moreover, the rotation or opacity defined in previous layer filters
          //   did not persist to this layer

          // render a circle in the bottom right of the canvas
          //   that grows a little bit every frame
        },
        options: {
          // notice that even if we set autoResetContext to false,
          //   changes to the context from the layer-specific filters
          //   did not persist to succeeding layers
          // layer-specific filters are applied only to that layer
          //   and are reverted after the render function for that layer is called
          // however, changes to the context from the layer-specific render function
          //   will persist into succeeding layers if autoResetContext is set to false
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
