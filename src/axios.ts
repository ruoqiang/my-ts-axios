import { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'

import defaults from './defaults'
// function createInstance(): AxiosInstance {
//   const context = new Axios
//   const instance = Axios.prototype.request.bind(context)

//   extend(instance, context)

//   return instance as AxiosInstance
// }

// const axios = createInstance()

function createInstance(config:AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return instance as AxiosInstance
}

const axios = createInstance(defaults) // 把默认配置传进去
export default axios
