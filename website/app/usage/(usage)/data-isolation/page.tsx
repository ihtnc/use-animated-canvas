'use client'

import { type AnimatedCanvasRenderFunction, use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'
import TypeScriptCode from '@/components/typescript-code'
import menu from './menu-item'
import SeeAlso from '@/components/see-also'

export default function DataIsolation() {
  type PageData = {
    isPreRenderSameAsInitial?: boolean,
    isCurrentSameAsPrevious?: boolean,
    isBackgroundSameAsInitial?: boolean,
    isBackgroundSameAsCurrent?: boolean,
    isMainSameAsInitial?: boolean,
    isMainSameAsCurrent?: boolean,
    isForegroundSameAsInitial?: boolean,
    isForegroundSameAsCurrent?: boolean,
    isPostRenderSameAsInitial?: boolean
    isPostRenderSameAsCurrent?: boolean,
  }

  let initialData: PageData = {}
  let previousFrameData: PageData | undefined = undefined
  let currentFrameData: PageData | undefined = undefined

  let renderBackgroundData: PageData | undefined = undefined
  let renderData: PageData | undefined = undefined
  let renderForegroundData: PageData | undefined = undefined

  const getLabel = (value?: boolean): string => {
    if (value === undefined) { return '-' }
    return value ? 'same' : 'different'
  }

  const { Canvas } = use2dAnimatedCanvas<PageData>({
    initialiseData: () => {
      initialData = {}
      return initialData
    },
    preRenderTransform: (data) => {
      currentFrameData = data.data
      return data
    },
    renderBackground: (context, data) => {
      renderBackgroundData = data.data
    },
    render: (context, data) => {
      if (data.data === undefined) { return }

      context.fillStyle = '#808080'
      context.textBaseline = 'top'
      context.textAlign = 'left'

      const col1 = 5
      const col2 = data.drawData.width * 0.35
      const col3 = data.drawData.width * 0.66
      let y = 5
      context.font = 'bold 15px Arial'
      context.fillText('Handler data', col1, y)
      context.fillText('Initial data', col2, y)
      context.fillText('Frame data', col3, y)
      y += 20

      context.font = '15px Arial'
      context.fillText('PreRender', col1, y)
      context.fillText(getLabel(data.data.isPreRenderSameAsInitial), col2, y)
      context.fillText(`${getLabel(data.data.isCurrentSameAsPrevious)} (prev)`, col3, y)
      y += 15

      context.fillText('Background', col1, y)
      context.fillText(getLabel(data.data.isBackgroundSameAsInitial), col2, y)
      context.fillText(getLabel(data.data.isBackgroundSameAsCurrent), col3, y)
      y += 15

      context.fillText('Main', col1, y)
      context.fillText(getLabel(data.data.isMainSameAsInitial), col2, y)
      context.fillText(getLabel(data.data.isMainSameAsCurrent), col3, y)
      y += 15

      context.fillText('Foreground', col1, y)
      context.fillText(getLabel(data.data.isForegroundSameAsInitial), col2, y)
      context.fillText(getLabel(data.data.isForegroundSameAsCurrent), col3, y)
      y += 15

      context.fillText('PostRender', col1, y)
      context.fillText(getLabel(data.data.isPostRenderSameAsInitial), col2, y)
      context.fillText(getLabel(data.data.isPostRenderSameAsCurrent), col3, y)
      y += 15

      renderData = data.data
    },
    renderForeground: (context, data) => {
      renderForegroundData = data.data
    },
    postRenderTransform: (data) => {
      if (data.data === undefined) { return data }

      data.data.isCurrentSameAsPrevious = currentFrameData === previousFrameData
      data.data.isPreRenderSameAsInitial = currentFrameData === initialData
      data.data.isBackgroundSameAsInitial = renderBackgroundData === initialData
      data.data.isBackgroundSameAsCurrent = renderBackgroundData === currentFrameData
      data.data.isMainSameAsInitial = renderData === initialData
      data.data.isMainSameAsCurrent = renderData === currentFrameData
      data.data.isForegroundSameAsInitial = renderForegroundData === initialData
      data.data.isForegroundSameAsCurrent = renderForegroundData === currentFrameData
      data.data.isPostRenderSameAsInitial = data.data === initialData
      data.data.isPostRenderSameAsCurrent = data.data === currentFrameData

      previousFrameData = data.data
      return data
    }
  })

  const code = `
    export default function DataIsolation() {
      type PageData = {
        // will store the comparison between the data received by each handler
        //   to both the initial data and the data in the current frame
      }

      let initialData: PageData = {}
      let previousFrameData: PageData | undefined = undefined
      let currentFrameData: PageData | undefined = undefined

      let renderBackgroundData: PageData | undefined = undefined
      let renderData: PageData | undefined = undefined
      let renderForegroundData: PageData | undefined = undefined

      const { Canvas } = use2dAnimatedCanvas<PageData>({
        initialiseData: () => {
          // set the initialData to new object
          return initialData
        },
        preRenderTransform: (data) => {
          // assign received data to currentFrameData
          return data
        },
        renderBackground: (context, data) => {
          // assign received data to renderBackgroundData
        },
        render: (context, data) => {
          // render values from received data
          //   the data represents the result of the comparison from the last frame

          // notice that the data received by each handler
          //   is different from the initial data
          //   and that the value received from preRenderTransform
          //   is different from the previous frame
          //   but succeeding handlers receive the same data
          // this is because a new copy of the data is made each frame

          // assign received data to renderData
        },
        renderForeground: (context, data) => {
          // assign received data to renderForegroundData
        },
        postRenderTransform: (data) => {
          // compare the instances of the data collected so far
          // assign received data to previousFrameData
          return data
        }
      })

      return <Canvas />
    }
  `

  return (<>
    <h2 className='text-2xl font-semibold mb-4'>{menu.label}</h2>
    <div className='w-80 h-32 ml-8 mb-8'>
      <Canvas className='w-full h-full border border-black dark:border-gray-300' />
    </div>
    <TypeScriptCode code={code} />
    <SeeAlso references={menu.seeAlso} />
  </>)
}
