
import React from 'react'
import { areComponentsEqual } from 'react-hot-loader'

import { uuid } from 'utils/util'
import { IViewVariable } from '../types'
import Resizable, { IResizeCallbackData } from 'libs/react-resizable/lib/Resizable'

import SourceTable from './SourceTable'
import SqlEditor from './SqlEditor'
import SqlButton, { ISqlButtonProps } from './SqlButton'
import VariableModal, { IVariableModalProps } from './VariableModal'
import ToolboxModal, { IToolboxModalProps } from './ToolboxModal'
import SqlPreview, { ISqlPreviewProps } from './SqlPreview'
import EditorBottom from './EditorBottom'

import Styles from '../View.less'

interface IEditorContainerProps {
  visible: boolean
  variable: IViewVariable[]
  children?: React.ReactNode
  onVariableChange: (variable: IViewVariable[]) => void
}

interface IEditorContainerStates {
  editorHeight: number
  siderWidth: number
  previewHeight: number
  variableModalVisible: boolean
  editingVariable: IViewVariable
  leftWidth: number
}

export class EditorContainer extends React.Component<IEditorContainerProps, IEditorContainerStates> {

  private editor = React.createRef<HTMLDivElement>()
  public static SiderMinWidth = 250
  public static EditorMinHeight = 0

  public state: Readonly<IEditorContainerStates> = {
    editorHeight: 0,
    siderWidth: EditorContainer.SiderMinWidth,
    previewHeight: 0,
    variableModalVisible: false,
    editingVariable: null,
    leftWidth: 0
  }

  public componentDidMount () {
    window.addEventListener('resize', this.setEditorHeight, false)
    // @FIX for this init height, 64px is the height of the hidden navigator in Main.tsx
    // const editorHeight = this.editor.current.clientHeight + 10
    const editorHeight = this.editor.current.clientHeight + 10
    const previewHeight = editorHeight - 80
    this.setState({
      editorHeight,
      previewHeight
    })
  }

  public componentWillUnmount () {
    window.removeEventListener('resize', this.setEditorHeight, false)
  }

  public setEditorHeight = () => {
    const editorHeight = this.editor.current.clientHeight
    const { previewHeight, editorHeight: oldEditorHeight } = this.state
    const newPreviewHeight = Math.min(Math.floor(previewHeight * (editorHeight / oldEditorHeight)), editorHeight)
    this.setState({
      editorHeight,
      previewHeight: newPreviewHeight
    })
  }

  private siderResize = (_: any, { size }: IResizeCallbackData) => {
    const { width } = size
    this.setState({ siderWidth: width })
  }

  private previewResize = (_: any, { size }: IResizeCallbackData) => {
    const { height } = size
    this.setState(({ editorHeight }) => ({ previewHeight: editorHeight - height }))
  }

  private addVariable = () => {
    this.setState({
      editingVariable: null,
      variableModalVisible: true
    })
  }

  private saveVariable = (updatedVariable: IViewVariable) => {
    const { variable, onVariableChange } = this.props
    const updatedViewVariables = [...variable]
    if (!updatedVariable.key) {
      updatedVariable.key = uuid(5)
      updatedViewVariables.push(updatedVariable)
    } else {
      const idx = variable.findIndex((v) => v.key === updatedVariable.key)
      updatedViewVariables[idx] = updatedVariable
    }
    onVariableChange(updatedViewVariables)
    this.setState({
      variableModalVisible: false
    })
  }

  private deleteVariable = (key: string) => {
    const { variable, onVariableChange } = this.props
    const updatedViewVariables = variable.filter((v) => v.key !== key)
    onVariableChange(updatedViewVariables)
  }

  private editVariable = (variable: IViewVariable) => {
    this.setState({
      editingVariable: variable,
      variableModalVisible: true
    })
  }

  private variableNameValidate = (key: string, name: string, callback: (msg?: string) => void) => {
    const { variable } = this.props
    const existed = variable.findIndex((v) => ((!key || v.key !== key) && v.name === name)) >= 0
    if (existed) {
      callback('名称不能重复')
      return
    }
    callback()
  }

  private closeVariableModal = () => {
    this.setState({ variableModalVisible: false })
  }

  private getChildren = (props: IEditorContainerProps, state: IEditorContainerStates) => {
    let sourceTable: React.ReactElement<any>
    let rightSqlEditor: React.ReactElement<any>
    let leftSqlEditor: React.ReactElement<any>
    let sqlPreview: React.ReactElement<ISqlPreviewProps>
    let editorBottom: React.ReactElement<any>
    let sqlButton: React.ReactElement<ISqlButtonProps>
    let variableModal: React.ReactElement<IVariableModalProps>
    let toolboxModal: React.ReactElement<IToolboxModalProps>

    React.Children.forEach(props.children, (child) => {
      const c = child as React.ReactElement<any>
      const type = c.type as React.ComponentClass<any>
      if (areComponentsEqual(type, SourceTable)) {
        sourceTable = c
      } else if (areComponentsEqual(type, SqlEditor)) {
        // sqlEditor = c
        const { leftWidth } = state
        leftSqlEditor = React.cloneElement<ISqlEditorProps>(c, { id: "leftSql",name:"leftSql" })
        rightSqlEditor = React.cloneElement<ISqlEditorProps>(c, { id: "rightSql",name:"rightSql" })
      } else if (areComponentsEqual(type, SqlPreview)) {
        const { previewHeight } = state
        sqlPreview = React.cloneElement<ISqlPreviewProps>(c, { height: previewHeight })
      } else if (areComponentsEqual(type, EditorBottom)) {
        editorBottom = c
      } else if (areComponentsEqual(type, SqlButton)) {
        sqlButton = React.cloneElement<ISqlButtonProps>(c, {
          className: Styles.viewVariable,
          onAdd: this.addVariable,
          onDelete: this.deleteVariable,
          onEdit: this.editVariable
        })
      } else if (areComponentsEqual(type, VariableModal)) {
        const { variableModalVisible, editingVariable } = this.state
        variableModal = React.cloneElement<IVariableModalProps>(c, {
          visible: variableModalVisible,
          variable: editingVariable,
          nameValidator: this.variableNameValidate,
          onCancel: this.closeVariableModal,
          onSave: this.saveVariable
        })
      } else if (areComponentsEqual(type, ToolboxModal)) {
        toolboxModal = React.cloneElement<IToolboxModalProps>(c, {
          nameValidator: this.variableNameValidate,
          onAdd: this.addVariable,
          onCancel: this.closeVariableModal,
          onSave: this.saveVariable
        })
      }
    })

    return { sourceTable, rightSqlEditor, leftSqlEditor , sqlPreview, editorBottom, sqlButton, variableModal, toolboxModal }
  }

  public render () {
    const { visible } = this.props
    const { editorHeight, siderWidth, previewHeight } = this.state
    const style = visible ? {} : { display: 'none' }
    const { sourceTable, rightSqlEditor, leftSqlEditor, sqlPreview, editorBottom, sqlButton, variableModal ,toolboxModal } = this.getChildren(this.props, this.state)

    return (
      <>
        <div className={Styles.containerVertical} style={style}>
          <div className={Styles.sider} style={{ width: siderWidth }}>
            <Resizable
              axis="x"
              width={siderWidth}
              height={0}
              minConstraints={[EditorContainer.SiderMinWidth, 0]}
              maxConstraints={[EditorContainer.SiderMinWidth * 2, 0]}
              onResize={this.siderResize}
            >
              <div>{sourceTable}</div>
            </Resizable>
          </div>
          <div className={Styles.containerHorizontal}>
            <div className={Styles.containerHorizontal} ref={this.editor}>
              <div className={Styles.right} style={{ height: editorHeight - previewHeight }}>
                <Resizable
                  axis="y"
                  width={0}
                  height={editorHeight - previewHeight}
                  minConstraints={[0, EditorContainer.EditorMinHeight]}
                  maxConstraints={[0, editorHeight]}
                  onResize={this.previewResize}
                >
                  <div className={Styles.containerVertical}>
                    {leftSqlEditor}
                    {rightSqlEditor}
                  </div>
                </Resizable>
              </div>
              <div className={Styles.toolbox}>{toolboxModal}</div>
              <div className={Styles.preview} style={{height: previewHeight}}>
                  {sqlPreview}
              </div>
            </div>
            {editorBottom}
          </div>
        </div>
      </>
    )
  }
}

export default EditorContainer
