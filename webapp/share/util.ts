import { uuid } from 'app/utils/util'
import { message } from 'antd'

export function getShareClientId (): string {
  let shareClientId = ''
  try {
    shareClientId = localStorage.getItem('SHARE_CLIENT_ID')
    if (!shareClientId) {
      shareClientId = uuid(32)
      localStorage.setItem('SHARE_CLIENT_ID', shareClientId)
    }
  } catch (err) {
    message.error(`获取分享页客户端ID失败：${err.message}`)
  }
  return shareClientId
}
