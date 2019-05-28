import { AxiosRequestConfig } from "../types";
import { isPlainObject, deepMerge } from "../helpers/util";

const strats = Object.create(null)

function defaultStrat(val1: any, val2: any): any { // 优先选2
    return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}
const stratKeysFromVal2 = ['url', 'data', 'params'] // 因为对于 url、params、data 这些属性，默认配置显然是没有意义的，它们是和每个请求强相关的，所以我们只从自定义配置中获取

stratKeysFromVal2.forEach((key) => {
    strats[key] = fromVal2Strat
})

function deepMergeStrat(val1:any,val2:any):any {
    if(isPlainObject(val2)) {
        return deepMerge(val1,val2)
    }else if(typeof val2 !=='undefined') { // 存在且排查isPlainObject的情况
        return val2
    }else if(isPlainObject(val1)) { // val2不存在且排查val2是isPlainObject的情况
        return deepMerge(val1) // 注意这里少了return的坑
    } else if(typeof val1 !== 'undefined') {
        return val1
    }
}
// function deepMergeStrat(val1: any, val2: any): any {
//   if (isPlainObject(val2)) {
//     return deepMerge(val1, val2)
//   } else if (typeof val2 !== 'undefined') {
//     return val2
//   } else if (isPlainObject(val1)) {
//     return deepMerge(val1)
//   } else if (typeof val1 !== 'undefined') {
//     return val1
//   }
// }


const stratKeysDeepMerge = ['headers']

stratKeysDeepMerge.forEach(key=>{
    strats[key] = deepMergeStrat
})

export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
    if (!config2) {
        config2 = {}
    }

    const config = Object.create(null)

    for (let key in config2) {
        mergerField(key)
    }

    for (const key in config1) {
        if (!config2[key]) { // 避免1的配置覆盖2的配置
            mergerField(key)
        }
    }

    function mergerField(key: string): void { // mergeField 方法做合并
        const strat = strats[key] || defaultStrat
        config[key] = strat(config1[key], config2![key]) // start是什么方法？在哪里定义的
    }
    return config
}

