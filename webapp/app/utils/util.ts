
import { removeToken } from './request'
import { DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, DEFAULT_FONT_WEIGHT } from 'app/globalConstants'
import { message } from 'antd'

/**
 * UUID生成器
 * @param len 长度 number
 * @param radix 随机数基数 number
 * @returns {string}
 */
export const uuid = (len: number, radix: number = 62) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid = []
  let i

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = chars[Math.floor(Math.random() * radix)]
    }
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = Math.floor(Math.random() * 16)
        uuid[i] = chars[(i === 19) ? ((r % 4) % 8) + 8 : r]
      }
    }
  }
  return uuid.join('')
}

export function safeAddition (num1, num2) {
  const decimalDigits = Math.max(
    `${num1}`.indexOf('.') >= 0 ? `${num1}`.substr(`${num1}`.indexOf('.') + 1).length : 0,
    `${num2}`.indexOf('.') >= 0 ? `${num2}`.substr(`${num2}`.indexOf('.') + 1).length : 0
  )
  if (decimalDigits) {
    const times = Math.pow(10, decimalDigits)
    return (Math.round(num1 * times) + Math.round(num2 * times)) / times
  } else {
    return num1 + num2
  }
}

/**
 * 通用saga异常处理
 * @param error 异常内容: Error
 */
export function errorHandler (error) {
  console.log("---------------------------")
  console.log(error)
  if (error.response) {
    switch (error.response.status) {
      case 403:
        message.error('未登录或会话过期，请重新登录', 1)
        removeToken()
        break
      case 401:
        message.error('您没有权限访问此数据', 2)
        break
      default:
        message.error(
          error.response.data.header
            ? error.response.data.header.msg
            : error.message,
          3
        )
        break
    }
  } else if (error.message) {
    message.error(error.message, 3)
  }
}

export function getErrorMessage (error) {
  return error.response
    ? error.response.data.header
      ? error.response.data.header.msg
      : error.message
    : error.message
}

export function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

let utilCanvas = null

export const getTextWidth = (
  text: string,
  fontWeight: string = DEFAULT_FONT_WEIGHT,
  fontSize: string = DEFAULT_FONT_SIZE,
  fontFamily: string = DEFAULT_FONT_FAMILY
): number => {
  const canvas = utilCanvas || (utilCanvas = document.createElement('canvas'))
  const context = canvas.getContext('2d')
  context.font = `${fontWeight} ${fontSize} ${fontFamily}`
  const metrics = context.measureText(text)
  return Math.ceil(metrics.width)
}

/**
 * View 组件
 */
export function generateData (sourceData) {
  const tableArr = []
  if (sourceData.length) {
    sourceData.forEach((i) => {
      const children = []
      if (i.columns && i.columns.length) {
        i.columns.forEach((j) => {
          children.push({
            title: j.name,
            key: j.name
          })
        })
      }
      tableArr.push({
        title: i.tableName,
        key: i.tableName,
        children
      })
    })
  }
  return tableArr
}
/**
 * 判断对象是否为空
 */
export function isBlank (value: any):boolean {
  if (value === null || value == undefined || value === "") {
	return true;
  }
  return false;
}
/**
 * 判断对象的属性是否为空
 */
export function isNotEmptyObject (obj: any):boolean {
  if (typeof obj === "object") {
	if (Object.keys(obj).length > 0) {
		return true;
	}
  }
  return false;
}
/**
 * 判断对象是否为空对象
 */
export function isNotBlankAndEmptyObject (value):boolean {
  if (value === null || value == undefined || value === "") {
	return false;
  }
  if (this.isNotEmptyObject(value)) {
	return true;
  } else {
	return false;
  }
}
/**
 * 判断对象所有属性值是否都为空
 */
export function isAllEmptyValue (value):boolean {
  // 若对象为空则返回true
  if (this.isBlank(value)) {
	return true;
  }
  if (typeof value === "object") {
	if (Object.keys(value).every(item => this.isBlank(value[item]))) {
	  return true;
	} else {
	  return false;
	}
  } else {
	return true;
  }
}