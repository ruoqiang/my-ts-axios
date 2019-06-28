import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'

import defaults from './defaults'
import mergeConfig from './core/mergeConfig'

import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'
// function createInstance(): AxiosInstance {
//   const context = new Axios
//   const instance = Axios.prototype.request.bind(context)

//   extend(instance, context)

//   return instance as AxiosInstance
// }

// const axios = createInstance()

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  // 注意这里返回类型AxiosStatic了 才会有create方法
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)
  // debugger
  return instance as AxiosStatic
  // return instance as AxiosStatic
}

const axios = createInstance(defaults) // 把默认配置传进去

axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

axios.all = function all(promises) {
  return Promise.all(promises)
}

axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.Axios = Axios

export default axios
