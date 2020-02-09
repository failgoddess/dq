

import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef
} from 'react'
import debounce from 'lodash/debounce'

import { Tag, AutoComplete, Input, Icon } from 'antd'
const { Option } = AutoComplete
import { SelectValue } from 'antd/lib/select'
import Avatar from 'components/Avatar'

import { IUserInfo } from '../types'

import Styles from './MailTag.less'

interface IMailTagProps {
  dataSource: IUserInfo[]
  value?: string
  allowCreate?: boolean
  onLoadDataSource: (keyword: string) => void
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

// http://emailregex.com/
const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const MailTag: React.FC<IMailTagProps> = (props, ref) => {
  const {
    dataSource,
    value,
    allowCreate,
    onLoadDataSource,
    onChange,
    onFocus,
    onBlur
  } = props
  const options = useMemo(
    () =>
      dataSource.map(({ id, username, email, avatar }) => (
        <Option key={id} value={email}>
          <div className={Styles.mailOption}>
            <Avatar path={avatar} size="small" />
            <span>{username}</span>
            <span>{email}</span>
          </div>
        </Option>
      )),
    [dataSource]
  )
  const [keyword, setKeyword] = useState<SelectValue>('')
  useEffect(
    () => {
      setKeyword('')
    },
    [value]
  )
  const appendOptions = useMemo(() => {
    if (!allowCreate) {
      return []
    }
    const newEmail = keyword as string
    if (!regexEmail.test(newEmail) || ~dataSource.findIndex(({ email }) => email === newEmail) < 0) {
      return []
    }
    return [(
      <Option key={newEmail} value={newEmail}>
        <div className={Styles.mailOption}>
          <Avatar path={null} size="small" />
          <span>{newEmail.split('@')[0]}</span>
          <span>{newEmail}</span>
        </div>
      </Option>
    )]
  }, [allowCreate, keyword])
  const autoCompleteOptions = appendOptions.concat(options)

  const emails = useMemo(() => (value ? value.split(';').filter((val) => !!val) : []), [value])

  const removeEmail = useCallback(
    (email) => () => {
      const newValue = emails.filter((val) => val !== email).join(';')
      onChange(newValue)
    },
    [value, onChange]
  )

  const loadDataSource = useCallback(
    debounce((keyword: string) => {
      onLoadDataSource(keyword)
    }, 800),
    [onLoadDataSource]
  )

  const selectEmail = useCallback(
    (email: string) => {
      const newEmails = [...emails]
      const idx = newEmails.indexOf(email)
      if (idx >= 0) {
        newEmails.splice(idx, 1)
      }
      newEmails.push(email)
      onChange(newEmails.join(';'))
    },
    [value, onChange, setKeyword]
  )

  useImperativeHandle(ref, () => ({}))

  return (
    <>
      {emails.map((email) => (
        <Tag closable key={email} color="blue" onClose={removeEmail(email)}>
          {email}
        </Tag>
      ))}
      <AutoComplete
        placeholder="输入邮箱或姓名关键字查找..."
        value={keyword}
        dataSource={autoCompleteOptions}
        optionLabelProp=""
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={setKeyword}
        onSearch={loadDataSource}
        onSelect={selectEmail}
      >
        <Input suffix={<Icon type="search" />} />
      </AutoComplete>
    </>
  )
}

export default forwardRef(MailTag)
