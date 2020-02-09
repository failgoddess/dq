
import isEmpty from 'lodash/isEmpty'
import invariant from 'invariant'

export const promiseDispatcher = (dispatch, action, ...params) =>
  new Promise((resolve, reject) => {
    dispatch(action(resolve, reject, ...params))
  })

export const promiseActionCreator = (type, payload = []) =>
  (resolve, reject, ...params) => {
    const paramArr = [...params]

    invariant(
      !isEmpty(type),
      `(app/utils/reduxPromisation...) promiseActionCreator: Received an empty action type.
       action type 不能为空`
    )

    invariant(
      payload.length === paramArr.length,
      `(app/utils/reduxPromisation...) promiseActionCreator: Expected ${payload.length} payloads but got ${paramArr.length}.
       预期有 ${payload.length} 个 payloads 但确拿到了 ${paramArr.length} 个`
    )
    return {
      type: type,
      payload: payload.reduce((obj, name, index) => {
        obj[name] = paramArr[index]
        return obj
      }, {
        resolve,
        reject
      })
    }
  }

export const promiseSagaCreator = (resolve, reject) =>
  function* ({ payload }) {
    try {
      const result = yield resolve(payload)
      payload.resolve(result)
    } catch (err) {
      reject(err)
      payload.reject(err)
    }
  }

