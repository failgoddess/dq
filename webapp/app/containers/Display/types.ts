
import { ISlideParams } from './components/types'

export { ISlideParams } from './components/types'

export interface IDisplay {
  id: number
  name: string
  avatar: string
  description: string
  projectId: number
  publish: boolean
}

interface ISlideBase {
  id: number
  displayId: number
  index: number
}

export interface ISlideRaw extends ISlideBase {
  config: string
}

export interface ISlide extends ISlideBase {
  config: {
    slideParams: ISlideParams
  }
}
