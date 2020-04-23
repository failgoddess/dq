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
  private debouncedGroupSqlChange = debounce((val: string,name: string) => { 
  	if(name==="leftSql") 
  		this.props.onSqlGroupChange(val,null); 
  	else if(name === 'rightSql')
  		this.props.onSqlGroupChange(null,val);
  	}, 500)
  	
  	private debouncedSqlChange = debounce((val: string) => { 
  	    this.props.onSqlChange(val);
  	}, 500)

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
      console.log("-------SqlEditor---constructor---------")
      console.log(props)
      
      if(props.name==="leftSql" || props.name==="rightSql" )
      	this.initGroupEditor(CodeMirror, props.leftSql,props.rightSql)
      else if(props.name==="sql" )
      	this.initEditor(CodeMirror, props.sql)
    })
  }

  public componentDidUpdate () {
    if (this.sqlEditor) {
      console.log("-------SqlEditor---componentDidUpdate---------")
      console.log(this.props)
      console.log(this.sqlEditor.options.name)
      const { leftSql, rightSql, sql } = this.props
      const localValue = this.sqlEditor.doc.getValue()
      const name = this.sqlEditor.options.name
      if (name==="leftSql" && leftSql != null && leftSql !== localValue) {
        console.log("=============")
        console.log(leftSql)
        this.sqlEditor.doc.setValue(leftSql)
      }
      if (name==="rightSql" && rightSql !=null && rightSql !== localValue) {
        console.log("=============")
        console.log(rightSql)
        this.sqlEditor.doc.setValue(rightSql)
      }
      if (name==="sql" && sql !=null && sql !== localValue) {
        console.log("=============")
        console.log(sql)
        this.sqlEditor.doc.setValue(sql)
      }
    }
  }

  private initGroupEditor = (codeMirror, leftSql: string,rightSql: string) => {
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
    const name = this.sqlEditor.options.name
    if (name==="leftSql" && leftSql != null) {
      this.sqlEditor.doc.setValue(leftSql)
    }
    if (name==="rightSql" && rightSql != null) {
      this.sqlEditor.doc.setValue(rightSql)
    }
    this.sqlEditor.on('change', (_: CodeMirror.Editor, change: CodeMirror.EditorChange) => {
      this.debouncedGroupSqlChange(_.getDoc().getValue(),_.options.name)
    	
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
  
  private initEditor = (codeMirror,sql: string) => {
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
    
    console.log("==================")
    console.log(sql)
    
    this.sqlEditor.doc.setValue(sql)
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
      <div className={Styles.sqlEditor} id={this.props.id} style={this.props.styleDict}>
        <textarea ref={this.sqlEditorContainer} />
      </div>
    )
  }
}

export default SqlEditor
