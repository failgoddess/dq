import React from 'react'
import { findDOMNode } from 'react-dom'
import Highlighter from 'react-highlight-words';
import memoizeOne from 'memoize-one'

import { Table, Input, Button, Icon } from 'antd'
import { ColumnProps, TableProps } from 'antd/lib/table'
import { PaginationConfig } from 'antd/lib/pagination'
import Styles from '../View.less'

import { IExecuteSqlResponse, ISqlColumn } from '../types'
import { DEFAULT_SQL_PREVIEW_PAGE_SIZE, SQL_PREVIEW_PAGE_SIZE_OPTIONS } from '../constants'
import { getTextWidth } from 'utils/util'

export interface ISqlPreviewProps {
  loading: boolean
  response: IExecuteSqlResponse
  height?: number
  size: TableProps<any>['size']
}

interface ISqlPreviewStates {
  tableBodyHeight: number
}

export class SqlPreview extends React.PureComponent<ISqlPreviewProps, ISqlPreviewStates> {

  private static readonly TableCellPaddingWidth = 8
  private static readonly TableCellMaxWidth = 300

  private static ExcludeElems = ['.ant-table-thead', '.ant-pagination.ant-table-pagination']

  private static basePagination: PaginationConfig = {
    pageSize: DEFAULT_SQL_PREVIEW_PAGE_SIZE,
    pageSizeOptions: SQL_PREVIEW_PAGE_SIZE_OPTIONS.map((size) => size.toString()),
    showQuickJumper: true,
    showSizeChanger: true
  }

  private prepareTable = memoizeOne((columns: ISqlColumn[], resultList: any[], rightColumns: ISqlColumn[], rightResultList: any[],totalCount) => {
    const rowKey = `rowKey_${new Date().getTime()}`
    
    for(var i=0;i<totalCount;i++){
    	var record = {}
    	if (typeof(resultList[i]) != "undefined") {
			for(var key in resultList[i]){
    			record['left.'+key] = resultList[i][key];
    		}
		}
    	if (typeof(rightResultList[i]) != "undefined") {
			for(var key in rightResultList[i]){
    			record['right.'+key] = rightResultList[i][key];
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
    		sortDirections: ['descend', 'ascend'],
    		width: leftWidth,
    		...this.getColumnSearchProps(colName)
    		
  		}
	})
	
	tableColumns = tableColumns.concat(rightColumns.map<ColumnProps<any>>((col) => {
		var colName = "right."+col.name
  		const rightWidth = SqlPreview.computeColumnWidth(resultList, colName)
  		col.name = col.name
  		return {
    		title: colName,
    		dataIndex: colName,
    		sorter: (a, b) => this.sortColumn(a,b,colName),
    		sortDirections: ['descend', 'ascend'],
    		width: rightWidth,
    		...this.getColumnSearchProps(colName)
  			}
		}
	))
    
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
  
  private distinct(a, b) {
    let arr = a.concat(b)
    arr = arr.sort()
    let result = [arr[0]]

    for (let i=1, len=arr.length; i<len; i++) {
        arr[i] !== arr[i-1] && result.push(arr[i])
    }
    return result
}

  private table = React.createRef<Table<any>>()
  public state: Readonly<ISqlPreviewStates> = { tableBodyHeight: 0, searchText: '', searchedColumn: '' }

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
  	return a[colName] - b[colName]
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

  public render () {
    const { loading, response, size } = this.props
    const { key, value } = response
    
    var totalCount = key.totalCount
    if(value.totalCount > totalCount){
    	totalCount = value.totalCount
    }

    const paginationConfig: PaginationConfig = {
      ...SqlPreview.basePagination,
      total: totalCount
    }
	
    const { tableColumns, rowKey,resultList } = this.prepareTable(key.columns, key.resultList ,value.columns, value.resultList,totalCount)
    const scroll: TableProps<any>['scroll'] = {
      x: tableColumns.reduce((acc, col) => (col.width as number + acc), 0),
      y: this.state.tableBodyHeight
    }
    
    return (
      <Table
        ref={this.table}
        className={Styles.sqlPreview}
        bordered
        size={size}
        pagination={paginationConfig}
        dataSource={resultList}
        columns={tableColumns}
        scroll={scroll}
        loading={loading}
        rowKey={rowKey}
      />
    )
  }

}

export default SqlPreview
