import React from 'react'
import debounce from 'lodash/debounce'

import Styles from '../View.less'

interface ISqlEditorProps {
  hints: {
    [name: string]: []
  }
  leftSql: string
  rightSql: string
  sql: string
  id: string
  onSqlGroupChange: (leftSql: string,rightSql: string) => void
  onSqlChange: (sql: string) => void
}

export class SqlEditor extends React.PureComponent<ISqlEditorProps> {

  private sqlEditorContainer = React.createRef<HTMLTextAreaElement>()
  private sqlEditor
  private debouncedSqlChange = debounce((val: string,name: string) => { 
  	if(name==="leftSql") 
  		this.props.onSqlGroupChange(val,null); 
  	else if (type === 'rightSql')
  		this.props.onSqlGroupChange(null,val);
  	else
  	    this.props.onSqlChange(sql);
  	}, 500)

  constructor (props) {
    super(props)
    console.log("-------SqlEditor---constructor---------")
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
      this.initEditor(CodeMirror, props.leftSql,props.rightSql)
    })
  }

  public componentDidUpdate () {
    if (this.sqlEditor) {
      console.log("-------SqlEditor---componentDidUpdate---------")
      const { leftSql, rightSql, sql } = this.props
      const localValue = this.sqlEditor.doc.getValue()
      const name = this.sqlEditor.options.name
      if (name==="leftSql" && leftSql != null && leftSql !== localValue) {
        this.sqlEditor.doc.setValue(this.props.leftSql)
      }
      if (name==="rightSql" && rightSql !=null && rightSql !== localValue) {
        this.sqlEditor.doc.setValue(this.props.rightSql)
      }
      if (sql !=null && sql !== localValue) {
        this.sqlEditor.doc.setValue(this.props.sql)
      }
    }
  }

  private initEditor = (codeMirror, leftSql: string,rightSql: string,sql: string) => {
    console.log("-------SqlEditor---initEditor---------")
    const { fromTextArea } = codeMirror
    const config = {
      mode: 'text/x-sql',
      theme: '3024-day',
      lineNumbers: true,
      lineWrapping: false,
      autoCloseBrackets: true,
      matchBrackets: true,
      foldGutter: true,
      name: this.props.name
    }
    this.sqlEditor = fromTextArea(this.sqlEditorContainer.current, config)
    if (typeof(this.props['height']) != "undefined") {
      this.sqlEditor.setSize(null, this.props['height']);
    }
    const name = this.sqlEditor.options.name
    if (name==="leftSql" && leftSql != null) {
      this.sqlEditor.doc.setValue(leftSql)
    }
    if (name==="rightSql" && rightSql != null) {
      this.sqlEditor.doc.setValue(rightSql)
    }
    if (sql != null) {
      this.sqlEditor.doc.setValue(sql)
    }
    this.sqlEditor.on('change', (_: CodeMirror.Editor, change: CodeMirror.EditorChange) => {
      this.debouncedSqlChange(_.getDoc().getValue(),_.options.name)
    	
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
    console.log("---------------")
    return (
      <div className={Styles.sqlEditor} id={this.props.id} style={this.props.styleDict}>
        <textarea ref={this.sqlEditorContainer} />
      </div>
    )
  }
}

export default SqlEditor
