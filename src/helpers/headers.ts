import { isPlainObject, deepMerge } from './util'
import { Method } from '../types'

function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]

      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    // 如果{a:1}经过qs处理了就会变成a=1就不满足
    if (headers && !headers['Content-Type']) {
      // headers默认给来一个空对象 {}。如果不给空对象 会是undefined 结果就会很大偏差--->结论：这句代码很精妙 ---屁 是你自己transformHeaders时  return processHeaders(headers, data)传递错了写成了processHeaders(config.headers, data)
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  headers.split('\r\n').forEach(line => {
    // 分割 date: 'Fri, 05 Apr 2019 12:40:49 GMT' \r\n etag: 'W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"',
    let [key, ...vals] = line.split(':') // 解构数组
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    let val = vals.join(':').trim()
    parsed[key] = val
  })

  return parsed
}
export function flattenHeaders(headers: any, method: Method): any {
  // 通过 deepMerge 的方法把 common、post 的属性拷贝到 headers 这一级，然后再把 common、post 这些属性删掉

  if (!headers) {
    // 没有headers 为什么还要return headers? ----老师的解释：相当于不处理了 headers 是什么就是什么
    // 再问：那什么情况下能满足!headers的情况呢
    // 答：把 headers 设置为 null
    // 但设置为null xhr.js中Object.keys(headers)会出错
    // 没啥大问题 就是一个容错性差一点而已，不要太计较。。headers别传null就是了

    return headers
  }
  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)
  // headers = deepMerge(headers.common || {}, headers, headers[method] || {})
  const methodToDelete = ['delete', 'get', 'head', 'options', 'post', 'patch', 'put', 'common']
  methodToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
