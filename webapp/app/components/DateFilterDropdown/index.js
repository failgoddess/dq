
import React from 'react'
import PropTypes from 'prop-types'

import { Input, DatePicker } from 'antd'
import { uuid } from 'utils/util'
const InputGroup = Input.Group
const RangePicker = DatePicker.RangePicker

import utilStyles from 'assets/less/util.less'

export function DateFilterDropdown (props) {
  const key = `dfd${uuid(8, 16)}`
  return (
    <div className={`${utilStyles.searchFilterDropdown} ${key}`}>
      <InputGroup size="large" compact>
        <RangePicker
          format={'YYYY-MM-DD'}
          onChange={props.onChange}
          onOk={props.onSearch}
          getCalendarContainer={() => document.querySelector(`.${key}`)}
        />
      </InputGroup>
    </div>
  )
}

DateFilterDropdown.propTypes = {
  // from: PropTypes.string,
  // to: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func
}

export default DateFilterDropdown
