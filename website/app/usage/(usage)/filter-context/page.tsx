'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function FilterContext() {
  let isDarkMode: boolean = false

  const globalFilter = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = isDarkMode ? '#FFBF00' : '#FF0000'
    context.lineWidth = 2
    context.fillStyle = '#68CDFE'
    context.font = '30px Arial'
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

      context.save()
      context.translate(center, center)
      context.rotate(Math.PI / 2)
    },
    renderBackground: (context) => {
      context.beginPath()
      context.strokeText('back', 0, 0)
      context.fillText('back', 0, 0)
      context.restore()
    },
    renderFilter: (context) => {
      context.lineWidth += 2
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
      context.globalAlpha = 0.5
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
        // set the line color, line width, fill color, and font for the entire canvas
      }

      const { Canvas } = use2dAnimatedCanvas({
        globalFilter,

        renderBackgroundFilter: (context) => {
          // like the render functions, when the autoResetContext option is set to false,
          //   changes to the context made by filters will apply to succeeding layers

          // set text alignment to left

          // save the current settings of the context so we can restore it later
          // note that the text alignment changes made by this layer
          //   will be included in the saved settings
          context.save()

          // rotate the canvas 90 degrees clockwise
        },
        renderBackground: (context, data) => {
          // notice that the context changes defined
          //   from the global filter are applied here
          //   as well as the additional changes made in the background filter
          //   (i.e.: rotation)

          // render text in the canvas

          // revert any changes made since the last context save call
          // notice that an assumption is made here that context.save()
          //   has been called from previous functions
          // this essentially reverts the rotation made in the background filter
          //   but keeps the text alignment change
          context.restore()
        },

        renderFilter: (context) => {
          // when the autoResetContext option is set to false,
          //   changes to the context made by filters will apply to succeeding layers

          // increase the line width of the canvas
        },
        render: (context, data) => {
          // notice that the line color, fill color, and font
          //   defined from the global filter are applied here
          //   as well as the text alignment defined in the background filter
          //   and the line width defined in the main filter

          // render text in the canvas
        },

        renderForegroundFilter: (context) => {
          // when the autoResetContext option is set to false,
          //   changes to the context made by filters will apply to succeeding layers

          // set the fill color of the canvas
        },
        renderForeground: (context, data) => {
          // notice that all the context changes made so far are applied here

          // set the opacity of the canvas

          // render a circle in the bottom right of the canvas
          //   that grows a little bit every frame
        },

        options: {
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
