// import { AxiosTransformer } from "../types";

// export default function transform(data: any, headers: any, fns?: AxiosTransformer | AxiosTransformer[]): any {
    
//     if (!fns) { return data }

//     if(!Array.isArray(fns)) { // 处理为数组方便后面遍历
//         fns =[fns]
//     }
//     fns.forEach(fn=>{
        
//         data = fn(data,headers) // 每个转换函数返回的 data 会作为下一个转换函数的参数 data 传入 -----实现数据的管道处理
//     })
//     return data
// }


import { AxiosTransformer } from '../types'

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}