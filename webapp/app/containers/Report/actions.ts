

import { LOAD_SIDEBAR } from './constants'

export function loadSidebar (sidebar) {
  console.log("------------112-----")
  console.log(sidebar)
  return {
    type: LOAD_SIDEBAR,
    sidebar
  }
}
