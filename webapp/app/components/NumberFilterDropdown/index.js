import React from 'react'
import PropTypes from 'prop-types'

import NumberRange from '../NumberRange'

import utilStyles from 'assets/less/util.less'

export function NumberFilterDropdown (props) {
  return (
    <div className={utilStyles.searchFilterDropdown}>
      <NumberRange {...props} />
    </div>
  )
}

NumberFilterDropdown.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.array,
  onChange: PropTypes.func,
  onSearch: PropTypes.func
}

export default NumberFilterDropdown
