import React from 'react'
import debounce from 'lodash/debounce'

import Styles from '../Rule.less'

interface IPythonEditorProps {
  hints: {
    [name: string]: []
  }
  id: string
  onPythonChange: (pythonCode: string) => void
}

export class PythonEditor extends React.PureComponent<IPythonEditorProps> {

  public render () {
    return (
      <div>
      </div>
    )
  }
}

export default PythonEditor
