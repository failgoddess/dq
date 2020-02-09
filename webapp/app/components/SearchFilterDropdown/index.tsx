
import * as React from 'react'

import { Input } from 'antd'
const Search = Input.Search

const utilStyles = require('assets/less/util.less')

interface ISearchFilterDropdownProps {
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearch: (value: string) => void
}

export function SearchFilterDropdown (props: ISearchFilterDropdownProps) {
  return (
    <div className={utilStyles.searchFilterDropdown}>
      <Search
        size="large"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        onSearch={props.onSearch}
      />
    </div>
  )
}

export default SearchFilterDropdown
