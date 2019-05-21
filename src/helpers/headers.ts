// import { isPlainObject } from './util'

// function normalizeHeaderName(headers: any, normalizedName: string): void {
//     if (!headers) return
//     Object.keys(headers).forEach(name => {
//         if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
//             headers[normalizedName] = headers[name]
//             delete headers[name]
//         }
//     })
// }
// export function processHeaders(headers: any, data: any): any {
//     normalizeHeaderName(headers, 'Content-Type')
//     if (isPlainObject(data)) {
//         if (headers && !headers['Content-Type']) {
//             headers['Content-Type'] = 'application/json;charset=utf-8'
//         }
//     }
//     return headers
// }

import { isPlainObject, deepMerge } from './util'
import { Method } from '../types';

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
    if (headers && !headers['Content-Type']) { // headers默认给来一个空对象 {}。如果不给空对象 会是undefined 结果就会很大偏差--->结论：这句代码很精妙 ---屁 是你自己transformHeaders时  return processHeaders(headers, data)传递错了写成了processHeaders(config.headers, data)
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

  headers.split('\r\n').forEach((line) => { // 分割 date: 'Fri, 05 Apr 2019 12:40:49 GMT' \r\n etag: 'W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"',
    let [key, val] = line.split(':') // 结构数组
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })

  return parsed
}
export function flattenHeaders(headers: any, method: Method): any { // 通过 deepMerge 的方式把 common、post 的属性拷贝到 headers 这一级，然后再把 common、post 这些属性删掉
  if (!headers) { // 没有headers 为什么还要return headers?
    return headers
  }
  headers = deepMerge(headers.common || {}, headers[method] || {}, {}, headers)

  const methodToDelete = ['delete', 'get', 'head', 'options', 'post', 'patch', 'put', 'common']
  methodToDelete.forEach(method => {
    delete headers[method]
  })
  
  return headers
}