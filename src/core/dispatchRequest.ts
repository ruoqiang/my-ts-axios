import { AxiosRequestConfig,AxiosPromise, AxiosResponse } from '../types'
import { bulidURL } from '../helpers/url'
import xhr from './xhr'
import { transformRequest } from '../helpers/data'
import { flattenHeaders } from '../helpers/headers'
import transform from './transform';

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then((res)=>{ // 由原来的return xhr(config)-所有返回项 变成现在的return transformResponseData(res) 只有data项
    return transformResponseData(res)
  })
}

function processConfig (config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  // config.headers = transformHeaders(config)
  // config.data = transformRequestData(config)   -->
  config.data = transform(config.data,config.headers,config.transformRequest)

  config.headers = flattenHeaders(config.headers,config.method!) // flattenHeaders拍平config.headers中的默认配置与自定义Method相关配置
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return bulidURL(url!, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

// function transformHeaders (config: AxiosRequestConfig) {
//   const { headers = {}, data } = config
//   return processHeaders(headers, data) // processHeaders转换headers的函数放到transformRequest里面处理了
// }

function transformResponseData(res: AxiosResponse): AxiosResponse {
  
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}
export default dispatchRequest