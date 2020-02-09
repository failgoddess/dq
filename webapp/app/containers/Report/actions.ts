

import { LOAD_SIDEBAR } from './constants'

export function loadSidebar (sidebar) {
  return {
    type: LOAD_SIDEBAR,
    sidebar
  }
}
