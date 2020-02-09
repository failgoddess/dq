import { useState, useCallback, useEffect } from 'react'

import { PaginationConfig } from 'antd/lib/table'

const defaultSimpleWidth = 768
const basePagination: PaginationConfig = {
  defaultPageSize: 20,
  showSizeChanger: true
}

function useTablePagination(
  simpleWidth: number,
  baseConfig?: PaginationConfig
) {
  const [screenWidth, setScreenWidth] = useState(
    document.documentElement.clientWidth
  )
  const updateScreenWidth = useCallback(() => {
    setScreenWidth(document.documentElement.clientWidth)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', updateScreenWidth, false)

    return function cleanup() {
      window.removeEventListener('resize', updateScreenWidth, false)
    }
  }, [])
  const simple =
    screenWidth <= (simpleWidth <= 0 ? defaultSimpleWidth : simpleWidth)

  const pagination: PaginationConfig = {
    ...basePagination,
    ...baseConfig,
    simple
  }

  return pagination
}

export default useTablePagination
