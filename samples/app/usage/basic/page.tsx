'use client'

import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'
import { useDarkMode } from 'usehooks-ts'

export default function Basic() {
  const { isDarkMode } = useDarkMode()

  const { Canvas } = use2dAnimatedCanvas({
    render: (context, data) => {
      const frame = data?.drawData?.frame ?? 0
      context.fillStyle = isDarkMode ? '#E5E7EB' : '#000000'
      context.beginPath()
      context.arc(context.canvas.width / 2, context.canvas.height / 2, 20*Math.sin(frame*0.05)**2, 0, 2*Math.PI)
      context.fill()
    }
  })

  const code = `
    export default function Basic() {
      const { Canvas } = use2dAnimatedCanvas({
        render: (context, data) => {
          // this function gets called every frame
          // use context to draw on the canvas
          // use data to access details like frame count, fps, etc
          // data can also include a user-defined value if supplied

          // render a circle that grows/shrinks a little bit every frame
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
