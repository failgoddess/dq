
import React from 'react'
import debounce from 'lodash/debounce'

import Styles from '../View.less'

interface ISqlEditorProps {
  hints: {
    [name: string]: []
  }
  leftValue: string
  rightValue: string
  id: string
  onSqlChange: (leftSql: string,rightSql:string) => void
}

export class SqlEditor extends React.PureComponent<ISqlEditorProps> {

  private sqlEditorContainer = React.createRef<HTMLTextAreaElement>()
  private sqlEditor
  private debouncedSqlChange = debounce((leftSql: string,rightSql:string) => { this.props.onSqlChange(leftSql,rightSql) }, 500)

  constructor (props) {
    super(props)

    require([
      'codemirror/lib/codemirror',
      'codemirror/lib/codemirror.css',
      'assets/override/codemirror_theme.css',
      'codemirror/addon/hint/show-hint.css',
      'codemirror/addon/edit/matchbrackets',
      'codemirror/mode/sql/sql',
      'codemirror/addon/hint/show-hint',
      'codemirror/addon/hint/sql-hint',
      'codemirror/addon/display/placeholder'
    ], (CodeMirror) => {
      this.initEditor(CodeMirror, props.leftValue,props.rightValue)
    })
  }

  public componentDidUpdate () {
    if (this.sqlEditor) {
      const { leftValue,rightValue } = this.props
      const leftLocalValue = this.sqlEditor.doc.getValue()
      const rightLocalValue = this.sqlEditor.doc.getValue()
      if (leftValue !== leftLocalValue) {
        this.sqlEditor.doc.setValue(this.props.leftValue)
      }
      if (rightValue !== rightLocalValue) {
        this.sqlEditor.doc.setValue(this.props.rightValue)
      }
    }
  }

  private initEditor = (codeMirror, leftValue: string,rightValue: string) => {
    const { fromTextArea } = codeMirror
    const config = {
      mode: 'text/x-sql',
      theme: '3024-day',
      lineNumbers: true,
      lineWrapping: false,
      autoCloseBrackets: true,
      matchBrackets: true,
      foldGutter: true
    }
    this.sqlEditor = fromTextArea(this.sqlEditorContainer.current, config)
    this.sqlEditor.doc.setValue(leftValue)
    this.sqlEditor.on('change', (_: CodeMirror.Editor, change: CodeMirror.EditorChange) => {
    this.debouncedSqlChange(_.getDoc().getValue())
    	
      if (change.origin === '+input'
          && change.text[0] !== ';'
          && change.text[0].trim() !== ''
          && change.text[1] !== '') {
        this.sqlEditor.showHint({
          completeSingle: false,
          tables: this.props.hints
        })
      }
    })
  }

  public render () {
    return (
      <div className={Styles.sqlEditor} id={this.props.id}>
        <textarea ref={this.sqlEditorContainer} />
      </div>
    )
  }
}

export default SqlEditor
