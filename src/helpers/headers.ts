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

import { isPlainObject } from './util'

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
