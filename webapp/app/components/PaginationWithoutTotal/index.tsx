
import React, { PureComponent } from 'react'
import classnames from 'classnames'

import { ButtonSize } from 'antd/lib/button'
import { Button, Select, Input, Icon } from 'antd'
const Option = Select.Option

const styles = require('./PaginationWithoutTotal.less')

interface IPaginationWithoutTotalProps {
  dataLength: number
  loading?: boolean
  size?: ButtonSize
  defaultPageSize?: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  pageSizeOptions?: string[]
  className?: string
  onChange: (current: number, pageSize: number) => void
}

interface IPaginationWithoutTotalStates {
  current: number
  pageSize: number
  jumpTo: string
}

export class PaginationWithoutTotal extends PureComponent<IPaginationWithoutTotalProps, IPaginationWithoutTotalStates> {
  constructor (props) {
    super(props)
    this.state = {
      current: 1,
      pageSize: 0,
      jumpTo: ''
    }
  }

  private static defaultProps = {
    loading: false,
    size: 'default',
    defaultPageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '30', '40']
  }

  public componentWillMount () {
    this.setState({
      pageSize: this.props.defaultPageSize
    })
  }

  public componentWillReceiveProps (nextProps) {
    if (nextProps.defaultPageSize !== this.props.defaultPageSize) {
      this.setState({
        pageSize: nextProps.defaultPageSize
      })
    }
  }

  private changeJumpToValue = (e) => {
    this.setState({
      jumpTo: e.target.value
    })
  }

  private change = (action: string) => (val) => {
    let { current, pageSize, jumpTo } = this.state
    switch (action) {
      case 'prev':
        current -= 1
        break
      case 'next':
        current += 1
        break
      case 'jump':
        if (!Number(jumpTo) || Number(jumpTo) === current) {
          this.setState({
            jumpTo: ''
          })
          return
        } else {
          current = Number(jumpTo)
          jumpTo = ''
          break
        }
      default:
        pageSize = Number(val)
        current = 1
        break
    }
    this.props.onChange(current, pageSize)
    this.setState({
      current,
      pageSize,
      jumpTo
    })
  }

  public render () {
    const { loading, size, dataLength, showSizeChanger, showQuickJumper, pageSizeOptions, className } = this.props
    const { current, pageSize, jumpTo } = this.state
    const paginationClass = classnames({
      [styles.pagination]: true,
      [className]: true
    })

    return (
      <div className={paginationClass}>
        <Button
          loading={loading}
          size={size}
          disabled={current === 1}
          onClick={this.change('prev')}
        >
          <Icon type="left" />上一页
        </Button>
        <Button
          loading={loading}
          size={size}
          disabled={dataLength < pageSize}
          onClick={this.change('next')}
        >
          下一页<Icon type="right" />
        </Button>
        {showSizeChanger && (
          <Select
            value={`${pageSize}`}
            size={size}
            className={styles.sizer}
            onChange={this.change('')}
          >
            {
              pageSizeOptions.map((p) => (
                <Option key={p} value={p}>{`${p} / Page`}</Option>
              ))
            }
          </Select>
        )}
        {showQuickJumper && (
          <div className={styles.quickJumper}>
            跳至
            <Input
              value={jumpTo}
              size={size}
              onChange={this.changeJumpToValue}
              onPressEnter={this.change('jump')}
            />
            页
          </div>
        )}
      </div>
    )
  }
}

export default PaginationWithoutTotal
