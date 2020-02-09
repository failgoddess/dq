import React from 'react'
import DownloadList from '../DownloadList'
import { Icon, Button } from 'antd'
import { IDownloadRecord } from 'app/containers/App/types'
const styles = require('./EditorHeader.less')
const utilStyles = require('assets/less/util.less')

interface IEditorHeaderProps {
  currentType: string
  name: string
  description: string
  placeholder?: {
    name: string
    description: string
  }
  className: string
  loading?: boolean
  downloadList?: IDownloadRecord[]
  onNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDescriptionChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSave?: () => void
  onCancel: () => void
  onSetting?: () => void
  onLoadDownloadList?: () => void
  onDownloadFile?: (id) => void
}

export function EditorHeader (props: IEditorHeaderProps) {
  const {
    currentType,
    name,
    description,
    className,
    loading,
    downloadList,
    onNameChange,
    onDescriptionChange,
    onSave,
    onCancel,
    onSetting,
    onLoadDownloadList,
    onDownloadFile
  } = props

  const placeholder = props.placeholder || {
    name: '请输入名称',
    description: '请输入描述…'
  }

  return (
    <div className={`${styles.editorHeader} ${className}`}>
      <Icon type="left" className={styles.back} onClick={onCancel} />
      <div className={styles.title}>
        <div className={styles.name}>
          <input
            type="text"
            placeholder={placeholder.name}
            value={name}
            onChange={onNameChange}
            readOnly={currentType === 'dashboard'}
          />
          <span>{name || placeholder.name}</span>
        </div>
        <div className={styles.desc}>
          <input
            type="text"
            placeholder={currentType === 'dashboard' ? '' : placeholder.description}
            value={description}
            onChange={onDescriptionChange}
            readOnly={currentType === 'dashboard'}
          />
          <span>{description || placeholder.description}</span>
        </div>
      </div>
      {
        currentType === 'dashboard'
          ? (
            <ul className={styles.tools}>
              <li>
                <DownloadList
                  downloadList={downloadList}
                  onLoadDownloadList={onLoadDownloadList}
                  onDownloadFile={onDownloadFile}
                />
              </li>
            </ul>
          )
          : (
            <div className={`${currentType === 'dashboard' ? utilStyles.hide : styles.actions}`}>
              <Button onClick={onSetting}>设置</Button>
              <Button
                type="primary"
                loading={loading}
                disabled={loading}
                onClick={onSave}
              >
                保存
              </Button>
            </div>
          )
      }
    </div>
  )
}

export default EditorHeader
