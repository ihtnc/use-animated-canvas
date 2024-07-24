'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function Grid() {
  const { Canvas } = use2dAnimatedCanvas({
    renderBackground: (context) => {
      context.save()
      context.fillStyle = '#E5E7EB'
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)
      context.restore()
    },
    render: (context, data) => {
      const frame = data?.drawData?.frame ?? 0
      context.fillStyle = '#7B3F00'
      context.beginPath()
      context.arc(context.canvas.width / 2, context.canvas.height / 2, 20*Math.sin(frame*0.05)**2, 0, 2*Math.PI)
      context.fill()
    },
    renderGridLayer: true
  })

  const code = `
    export default function Grid() {
      const { Canvas } = use2dAnimatedCanvas({
        renderBackground: (context) => {
          // draw a gray square that covers the whole canvas
        },
        render: (context, data) => {
          // draw a circle that grows/shrinks a little bit every frame
        },

        // the internal grid layer render function is called every frame
        //   after all other rendering functions
        //   but before the environment details layer render function
        renderGridLayer: true
        /*
        the following achieves the same result:
          renderGridLayer: true
          renderGridLayer: "#000000"
          renderGridLayer: 50
          renderGridLayer: { width: 50, height: 50 }
          renderGridLayer: {
            size: 50,
            color: "#000000",
            opacity: 1,
            dashLength: 0
          }
        */
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
