[![build](https://github.com/ihtnc/use-animated-canvas/actions/workflows/build-package.yml/badge.svg)](https://github.com/ihtnc/use-animated-canvas/actions/workflows/build-package.yml)
[![publish](https://github.com/ihtnc/use-animated-canvas/actions/workflows/publish-package.yml/badge.svg)](https://github.com/ihtnc/use-animated-canvas/actions/workflows/publish-package.yml)
[![npm version](https://img.shields.io/npm/v/@ihtnc/use-animated-canvas)](https://www.npmjs.com/package/@ihtnc/use-animated-canvas)

#### Release Notes (v1.0.9)
* **FEATURE** TBD

Previous release notes are available [here](https://github.com/ihtnc/use-animated-canvas/releases).

### Use Animated Canvas

A React hook to create a canvas element with a built-in render loop. Useful for creating animations, games, and other interactive graphics.

#### Installation

```console
npm install @ihtnc/use-animated-canvas
```

#### Usage

```jsx
import { use2dAnimatedCanvas } from '@ihtnc/use-animated-canvas'

const App = () => {
  const { Canvas } = use2dAnimatedCanvas({
    render: (context, data) => {
      // this function gets called every frame
      // use context to draw on the canvas
      // use data to access details like frame count, fps, etc
      // data can also include a user-defined value if supplied
    }
  })

  return <Canvas />
};
```
More usage examples are available [here](https://ihtnc.github.io/use-animated-canvas/).

#### Animation
The HTML canvas element allows us to render objects (images, lines, shapes, text, etc) through code. Animation in a canvas is achieved by rendering a series of images (frames) in quick succession. This gives the illusion of movement (think zoetrope).

The `@ihtnc/use-animated-canvas` package provides React hooks as a way to create animations by calling various handlers to render a single frame in a canvas HTML element. The hook will then start a loop (render loop) that calls each of these handlers perpetually. The idea is that by adding some logic, the handlers will "slightly modify" the frame rendered to the canvas on each iteration. And since the loop calls these handlers in rapid succession, the image rendered on the canvas will appear to animate.

#### Rendering loop
Below are handlers exposed by the hook and the order in which they are called in the render loop. Every handler except `initialiseData` is called on each iteration of the render loop.
|   | Handler                | Purpose               | Notes                                |
|---|:-----------------------|:----------------------|:-------------------------------------|
| - | initialiseData         | for initialising data | called before the render loop starts |
| 1 | preRenderTransform     | for transforming data before any rendering operations |      |
| 2 | globalFilter           | for applying filter operations on all layers |               |
| 3 | renderBackgroundFilter | for applying filter operations on the background layer |     |
| 4 | renderBackground       | for rendering elements on the background layer |             |
| 5 | renderFilter           | for applying filter operations on the main layer | these "layers" are just added for logical grouping as they are essentially the same as their background/foreground counterparts |
| 6 | render                 | for rendering elements on the main layer | these "layers" are just added for logical grouping as they are essentially the same as their background/foreground counterparts |
| 7 | renderForegroundFilter | for applying filter operations on the foreground layer |     |
| 8 | renderForeground       | for rendering elements on the foreground layer |             |
| 9 | postRenderTransform    | for transforming data before the next frame | ideally for data clean ups |

> [!IMPORTANT]
> Pay close attention to the order on which you render objects on the canvas. Like drawing on a paper, the last thing you draw would overlap the previous drawings. The rendering handlers are grouped into 3 layers (background, main, and foreground) to help clearly facilitate this order.

#### Stay a while and listen...

This is a port of the rendering framework developed as part of the [canvas-concoctions](https://github.com/ihtnc/canvas-concoctions) project. It has since then been modified to add more features, refactor functionalities, and fix several issues.