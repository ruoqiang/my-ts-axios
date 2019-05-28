import { AxiosRequestConfig, AxiosResponse } from '../types'

import { AxiosPromise } from '../types/index'

import { parseHeaders } from '../helpers/headers'

import { CrateError } from '../helpers/error'
// export default function xhr(config: AxiosRequestConfig): void {
//   const { data = null, url, method = 'get', headers={} } = config

//   const request = new XMLHttpRequest()

//   request.open(method.toUpperCase(), url, true)

//   Object.keys(headers).forEach(name => {
//     if (data === null && name.toLowerCase() === 'content-type') {
//       delete headers[name]
//     } else {
//       request.setRequestHeader(name, headers[name])
//     }
//   })
//   request.send(data)
// }
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config

    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    request.open(method.toUpperCase(), url!, true)

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) { // meaning the load is complete
        return
      }
      if (request.status === 0) {
        return
      }

      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType && responseType !== 'text' ? request.response : request.responseText

      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      // resolve(response)
      handleResponse(response)
    }
    function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status < 300) { // 注意这里是>= 200 而不是 > 200, 200状态表示成功，否则当请求状态码刚好为200时也会判为出错--> Request failed with status code 200
        resolve(response)
      } else {
        // reject(new Error(`Request failed with status code ${response.status}`))
        reject(CrateError(`Request failed with status code ${response.status}`,config,null,request,response))
      }
    }
    // 网络错误
    request.onerror = function handleError() {
      // reject(new Error('Network Error'))
      reject(CrateError('Network Error', config, null, request))
    }
    // 超时错误
    request.ontimeout = function handleTimeout() {
      if (timeout) {
        // reject(new Error(`Timeout of ${timeout}ms exceeded `))
        reject(CrateError(`Timeout of ${timeout}ms exceeded `,config,'ECONNABORTED',request))
      }
    }
    Object.keys(headers).forEach((name) => {
      
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)
  })
}