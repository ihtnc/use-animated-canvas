'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function CustomGrid() {
  const { Canvas } = use2dAnimatedCanvas({
    renderBackground: (context) => {
      context.fillStyle = '#E5E7EB'
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    },
    render: (context, data) => {
      const frame = data?.drawData?.frame ?? 0
      context.fillStyle = '#7B3F00'
      context.beginPath()
      context.arc(context.canvas.width / 2, context.canvas.height / 2, 20*Math.sin(frame*0.05)**2, 0, 2*Math.PI)
      context.fill()
    },
    renderGridLayer: (context) => {
      context.strokeStyle = '#000000'
      context.beginPath()

      let width = context.canvas.width
      while(width / 2 > 5) {
        context.moveTo(width, 0)
        context.lineTo(width, context.canvas.height)
        width /= 2
      }

      let height = context.canvas.height
      while(height / 2 > 5) {
        context.moveTo(0, height)
        context.lineTo(context.canvas.width, height)
        height /= 2
      }

      context.stroke()
    }
  })

  const code = `
    export default function CustomGrid() {
      const { Canvas } = use2dAnimatedCanvas({
        renderBackground: (context) => {
          // render a gray square that covers the whole canvas
        },
        render: (context, data) => {
          // render a circle that grows/shrinks a little bit every frame
        },
        renderGridLayer: (context) => {
          // this function replaces the internal grid layer render function
          //   and gets called every frame
          //   after all other rendering functions
          //   but before the environment details layer render function

          // render a grid with user-defined divisions
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
