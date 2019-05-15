import { AxiosRequestConfig,AxiosPromise, AxiosResponse } from '../types'
import { bulidURL } from '../helpers/url'
import xhr from './xhr'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders } from '../helpers/headers'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then((res)=>{ // 由原来的return xhr(config)-所有返回项 变成现在的return transformResponseData(res) 只有data项
    return transformResponseData(res)
  })
}

function processConfig (config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return bulidURL(url!, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

// function transformHeaders(config: AxiosRequestConfig): any {
//   const { headers = {}, data } = config
//   return processHeaders(config.headers, data) ///config.headers这个坑导致返回结果为空
// }

function transformHeaders (config: AxiosRequestConfig) {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformResponseData (res:AxiosResponse) :AxiosResponse{
  return res.data = transformResponse(res.data)
}

export default dispatchRequest