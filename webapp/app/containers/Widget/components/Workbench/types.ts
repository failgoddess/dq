
export enum WorkbenchQueryMode {
  Immediately,
  Manually
}

export interface IWorkbenchSettings {
  queryMode: WorkbenchQueryMode
  multiDrag: boolean
}