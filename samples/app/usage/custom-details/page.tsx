'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { useDarkMode } from 'usehooks-ts'

export default function CustomDetails() {
  const { isDarkMode } = useDarkMode()

  const { Canvas } = use2dAnimatedCanvas({
    render: (context, data) => {
      const frame = data?.drawData?.frame ?? 0
      context.fillStyle = '#7B3F00'
      context.beginPath()
      context.arc(context.canvas.width / 2, context.canvas.height / 2, 20*Math.sin(frame*0.05)**2, 0, 2*Math.PI)
      context.fill()
    },
    renderEnvironmentLayer: (context, data) => {
      context.fillStyle = isDarkMode ? '#E5E7EB' : '#000000'

      const offset = 5
      context.fillText(`fps: ${data.fps}; frame: ${data.frame}`, offset, offset * 2)
      context.fillText(`size: ${data.width}x${data.height}`, offset, data.clientHeight * 0.50)
      context.fillText(`client: ${data.clientWidth}x${data.clientHeight}`, offset, data.clientHeight * 0.75)
      context.fillText(`ratio: ${data.pixelRatio}`, offset, context.canvas.height - offset)
    }
  })

  const code = `
    export default function CustomDetails() {
      const { Canvas } = use2dAnimatedCanvas({
        render: (context, data) => {
          // render a circle that grows/shrinks a little bit every frame
        },
        renderEnvironmentLayer: (context, data) => {
          // this function replaces the internal environment details layer render function
          //   and gets called every frame
          //   after all other rendering functions
          //   including the grid layer render function
          // render environment details on a user-defined format
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
