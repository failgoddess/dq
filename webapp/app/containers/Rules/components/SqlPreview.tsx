import React from 'react'
import { findDOMNode } from 'react-dom'
import Highlighter from 'react-highlight-words';
import memoizeOne from 'memoize-one'

import { Table, Input, Button, Icon } from 'antd'
import { ColumnProps, TableProps } from 'antd/lib/table'
import { PaginationConfig } from 'antd/lib/pagination'
import Styles from '../View.less'

import { IExecuteSqlResponse, ISqlColumn, IViewCorrelation } from '../types'
import { DEFAULT_SQL_PREVIEW_PAGE_SIZE, SQL_PREVIEW_PAGE_SIZE_OPTIONS } from '../constants'
import { getTextWidth } from 'utils/util'
import evaluate from 'simple-evaluate';
// import sqlparser 
export interface ISqlPreviewProps {
  loading: boolean
  response: IExecuteSqlResponse
  height?: number
  size: TableProps<any>['size']
  updatedCorrelation: IViewCorrelation
}

interface ISqlPreviewStates {
  tableBodyHeight: number
}

export class SqlPreview extends React.PureComponent<ISqlPreviewProps, ISqlPreviewStates> {

  private static readonly TableCellPaddingWidth = 8
  private static readonly TableCellMaxWidth = 300

  private static ExcludeElems = ['.ant-table-thead', '.ant-pagination.ant-table-pagination']

  private prepareListTable = memoizeOne((columns: ISqlColumn[], leftResultList: any[], rightColumns: ISqlColumn[], rightResultList: any[],totalCount, correlation: IViewCorrelation,sortedInfo) => {
    const rowKey = `rowKey_${new Date().getTime()}`
    var resultList: any[] = []
    for(var i=0;i<totalCount;i++){
    	var record = {}
    	if (typeof(leftResultList[i]) != "undefined") {
			for(var key in leftResultList[i]){
    			record['left.'+key] = leftResultList[i][key];
    		}
		}
    	if (typeof(rightResultList[i]) != "undefined") {
			for(var key in rightResultList[i]){
    			record['right.'+key] = rightResultList[i][key];
    		}
		} 
		
		if(typeof(correlation) != "undefined"){
			for(var key in correlation['expressionPair']){
				record[key] = evaluate(record,correlation['expressionPair'][key]);
			}
		}
		
		record[rowKey] = Object.values(record).join('_') + i;
		resultList[i]=record;
    }
	
	var tableColumns = columns.map<ColumnProps<any>>((col) => {
	    var colName = "left."+col.name
  		const leftWidth = SqlPreview.computeColumnWidth(resultList, colName)
  		return {
    		title: colName,
    		dataIndex: colName,
    		sorter: (a, b) => this.sortColumn(a,b,colName),
    		sortOrder: sortedInfo.columnKey === colName && sortedInfo.order,
    		sortDirections: ['descend', 'ascend'],
    		width: leftWidth,
    		...this.getColumnSearchProps(colName)
  		}
	})
	
	tableColumns = tableColumns.concat(rightColumns.map<ColumnProps<any>>((col) => {
		var colName = "right."+col.name
  		const rightWidth = SqlPreview.computeColumnWidth(resultList, colName)
  		return {
    		title: colName,
    		dataIndex: colName,
    		sorter: (a, b) => this.sortColumn(a,b,colName),
    		sortOrder: sortedInfo.columnKey === colName && sortedInfo.order,
    		sortDirections: ['descend', 'ascend'],
    		width: rightWidth,
    		...this.getColumnSearchProps(colName)
  			}
		}
	))
	
	if(typeof(correlation) != "undefined"){
		var expressionArr = []
		for(var colName in correlation['expressionPair']){
			const rightWidth = SqlPreview.computeColumnWidth(resultList, colName)
			expressionArr.unshift({
				title: colName,
				dataIndex: colName,
				sorter: (a, b) => this.sortColumn(a,b,colName),
				sortOrder: sortedInfo.columnKey === colName && sortedInfo.order,
				sortDirections: ['descend', 'ascend'],
				width: rightWidth,
				...this.getColumnSearchProps(colName)
			})
		}
		tableColumns = tableColumns.length === 0 ? tableColumns : tableColumns.concat(expressionArr)
	}
	
    return { tableColumns, rowKey, resultList }
  })
  
  private prepareCombineTable = memoizeOne((columns: ISqlColumn[], leftResultList: any[], rightColumns: ISqlColumn[], rightResultList: any[],totalCount, correlation: IViewCorrelation,sortedInfo) => {
    const rowKey = `rowKey_${new Date().getTime()}`
    var resultList: any[] = []
    for(var i=0;i<totalCount;i++){
    	var record = {}
    	if (typeof(leftResultList[i]) != "undefined") {
			for(var key in leftResultList[i]){
    			record['left.'+key] = leftResultList[i][key];
    		}
		}
    	if (typeof(rightResultList[i]) != "undefined") {
			for(var key in rightResultList[i]){
    			record['right.'+key] = rightResultList[i][key];
    		}
		} 
		
		if(typeof(correlation) != "undefined"){
			for(var key in correlation['expressionPair']){
				record[key] = evaluate(record,correlation['expressionPair'][key]);
			}
		}
		record[rowKey] = Object.values(record).join('_') + i;
		resultList[i]=record;
    }
	
	columns = this.distinct(columns,rightColumns)
    
    var tableColumns = columns.map<ColumnProps<any>>((col) => {
		var leftColName = "left."+col.name
     	const leftWidth = SqlPreview.computeColumnWidth(resultList, leftColName)
     	var rightColName = "right."+col.name
     	const rightWidth = SqlPreview.computeColumnWidth(resultList, rightColName)
     	return {
      		title: col.name,
      		width: leftWidth+rightWidth,
       		children: [
         	{
           		title: "left",
           		dataIndex: leftColName,
           		key: leftColName,
           		sorter: (a, b) => this.sortColumn(a,b,leftColName),
           		sortOrder: sortedInfo.columnKey === leftColName && sortedInfo.order,
           		sortDirections: ['descend', 'ascend'],
           		...this.getColumnSearchProps(leftColName)
         	},
         	{
           		title: "right",
           		dataIndex: rightColName,
           		key: rightColName,
           		sorter: (a, b) => this.sortColumn(a,b,rightColName),
           		sortOrder: sortedInfo.columnKey === rightColName && sortedInfo.order,
           		sortDirections: ['descend', 'ascend'],
           		...this.getColumnSearchProps(rightColName)
         	}]
    	}
 	})
 	console.log("------------------")
 	console.log(correlation)
 	if(typeof(correlation) != "undefined"){
 		var expressionArr = []
		for(var colName in correlation['expressionPair']){
			const rightWidth = SqlPreview.computeColumnWidth(resultList, colName)
			expressionArr.unshift({
				title: colName,
				dataIndex: colName,
				key: colName,
				sorter: (a, b) => this.sortColumn(a,b,colName),
				sortOrder: sortedInfo.columnKey === colName && sortedInfo.order,
				sortDirections: ['descend', 'ascend'],
				width: rightWidth,
				...this.getColumnSearchProps(colName)
			})
		}
		tableColumns = tableColumns.length === 0 ? tableColumns : tableColumns.concat(expressionArr)
	}
		
    return { tableColumns, rowKey, resultList }
  })

  private static computeColumnWidth = (resultList: any[], columnName: string) => {
    let textList = resultList.map((item) => item[columnName])
    textList = textList.filter((text, idx) => textList.indexOf(text) === idx)
    const contentMaxWidth = textList.reduce((maxWidth, text) =>
      Math.max(maxWidth, getTextWidth(text, '700', '14px')), -Infinity)
    const titleWidth = getTextWidth(columnName, '500', '14px')
    let maxWidth = Math.max(contentMaxWidth, titleWidth) + (2 * SqlPreview.TableCellPaddingWidth) + 2
    maxWidth = Math.min(maxWidth, SqlPreview.TableCellMaxWidth)
    return maxWidth
  }
  
  private distinct(a: ISqlColumn[], b: ISqlColumn[]) {
    let d:any[] = []
    let f:any[] = []
    for(let i of a){
    	if(!f.includes(i.name)){
    		d.unshift(i)
    		f.unshift(i.name)
    	}
    }
    
    for(let i of b){
    	if(!f.includes(i.name)){
    		d.unshift(i)
    		f.unshift(i.name)
    	}
    }
    
    return d
  }

  private table = React.createRef<Table<any>>()
  public state: Readonly<ISqlPreviewStates> = { tableBodyHeight: 0, searchText: '', searchedColumn: '',pageSize: DEFAULT_SQL_PREVIEW_PAGE_SIZE,currentPage: 1,sortedInfo: null }

  public componentDidMount () {
    const tableBodyHeight = this.computeTableBody()
    this.setState({ tableBodyHeight })
  }

  public componentDidUpdate () {
    const newTableBodyHeight = this.computeTableBody()
    if (Math.abs(newTableBodyHeight - this.state.tableBodyHeight) > 5) { // FIXED table body compute vibration
      this.setState({ tableBodyHeight: newTableBodyHeight })
    }
  }

  private computeTableBody = () => {
    const tableDom = findDOMNode(this.table.current) as Element
    if (!tableDom) { return 0 }
    const excludeElemsHeight = SqlPreview.ExcludeElems.reduce((acc, exp) => {
      const elem = tableDom.querySelector(exp)
      if (!elem) { return acc }
      const style = window.getComputedStyle(elem)
      const { marginTop, marginBottom } = style
      const height = elem.clientHeight + parseInt(marginTop, 10) + parseInt(marginBottom, 10)
      return acc + height
    }, 0)
    const tableBodyHeight = this.props.height - excludeElemsHeight
    return tableBodyHeight
  }
  
  sortColumn = (a:any,b:any,colName) => {
    if(typeof(a[colName])=="string"){
    	return a[colName]> b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0;
    }else if(typeof(a[colName])=="number"){
    	return a[colName] - b[colName];
    }
    return 1;
  }
  
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div >
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={ <Icon type="search" />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <Icon type="search" title="搜索" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => typeof(record[dataIndex]) != "undefined" ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : false,
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={typeof(text) == "undefined" ? "" :text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
  
  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter,
    });
  };

  public render () {
  	console.log("-------------------")
    const { loading, response, size,updatedCorrelation,toolbox } = this.props
    const { key, value } = response
    const { pageSize,currentPage } = this.state
    let sortedInfo = this.state.sortedInfo || {};
    
    var correlation = this.props.correlation
    if(updatedCorrelation){
    	correlation = updatedCorrelation
    }
    
    var totalCount = key.totalCount
    if(value.totalCount > totalCount){
    	totalCount = value.totalCount
    }

    const paginationConfig: PaginationConfig = {
    	pageSize: pageSize,
    	pageSizeOptions: SQL_PREVIEW_PAGE_SIZE_OPTIONS.map((size) => size.toString()),
//        locale: { items_per_page: "" },
    	showQuickJumper: true,
    	showSizeChanger: true,
    	onShowSizeChange: (current, pageSize) => {
  			this.setState({ pageSize: pageSize,currentPage: current });
    	},
    	onChange: (page, size) => {
			this.setState({ currentPage: page });
		},
//		current: currentPage,
      	total: totalCount
    }
	
	var ftableColumns,frowKey,fresultList
	if(typeof(toolbox) != "undefined" && toolbox['slide']=='list'){
		const { tableColumns, rowKey,resultList } = this.prepareListTable(key.columns, key.resultList ,value.columns, value.resultList,totalCount,correlation,sortedInfo)
		ftableColumns = tableColumns
		frowKey = rowKey
		fresultList = resultList
	}else{
		const { tableColumns, rowKey,resultList } = this.prepareCombineTable(key.columns, key.resultList ,value.columns, value.resultList,totalCount,correlation,sortedInfo)
		ftableColumns = tableColumns
		frowKey = rowKey
		fresultList = resultList
	}
    const scroll: TableProps<any>['scroll'] = {
      x: ftableColumns.reduce((acc, col) => (col.width as number + acc), 0),
      y: this.state.tableBodyHeight
    }
    
    return (
      <Table
        ref={this.table}
        className={Styles.sqlPreview}
        bordered
        size={size}
        pagination={paginationConfig}
        dataSource={fresultList}
        columns={ftableColumns}
        scroll={scroll}
        loading={loading}
        rowKey={frowKey}
        onChange={this.handleChange}
      />
    )
  }

}

export default SqlPreview
