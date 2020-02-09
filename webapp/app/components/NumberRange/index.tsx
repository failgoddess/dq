import React, { PureComponent } from 'react'

import { Input } from 'antd'
const InputGroup = Input.Group

const styles = require('./NumberRange.less')

interface INumberRangeProps {
  placeholder?: string
  value?: string[]
  onChange?: (value: string[]) => void
  onSearch: (value: string[]) => void
}

interface INumberRangeStates {
  value: string[]
}

export class NumberRange extends PureComponent<INumberRangeProps, INumberRangeStates> {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value ? props.value.slice() : ['', '']
    }
  }

  private static defaultProps = {
    placeholder: ''
  }

  public componentWillReceiveProps (nextProps) {
    const nextValue = nextProps.value
    const { value } = this.state

    if (nextValue) {
      if (nextValue[0] !== value[0] || nextValue[1] !== value[1]) {
        this.setState({
          value: nextValue.slice()
        })
      }
    }
  }

  private inputChange = (dir) => {
    const { onChange } = this.props
    const { value } = this.state

    return function (e) {
      if (dir === 'from') {
        onChange([e.target.value.trim(), value[1]])
      } else {
        onChange([value[0], e.target.value.trim()])
      }
    }
  }

  private inputSearch = () => {
    this.props.onSearch(this.state.value)
  }

  public render () {
    const { placeholder } = this.props
    const { value } = this.state

    return (
      <InputGroup className={styles.range} compact>
        <Input
          className={styles.number}
          value={value[0]}
          placeholder={`${placeholder || ''}从`}
          onChange={this.inputChange('from')}
          onPressEnter={this.inputSearch}
        />
        <Input className={styles.numberDivider} placeholder="-" readOnly tabIndex={-1} />
        <Input
          className={styles.number}
          value={value[1]}
          placeholder="到"
          onChange={this.inputChange('to')}
          onPressEnter={this.inputSearch}
        />
      </InputGroup>
    )
  }
}

export default NumberRange
