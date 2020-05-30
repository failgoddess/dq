import React from 'react'
import { Steps } from 'antd'
const Step = Steps.Step

interface IEditorStepProps {
  current: number
}

export const EditorSteps: React.FunctionComponent<IEditorStepProps> = (props) => {
  const { current } = props

  return (
    <Steps current={current}>
      <Step title="编写SQL" />
      <Step title="编辑动作与权限" />
    </Steps>
  )
}

export default EditorSteps
