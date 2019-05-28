const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

export function isURLSearchParams(val: any): val is URLSearchParams { // typeof 只能检测 基本数据类型，包括boolean、undefined、string、number、symbol，而null ,Array、function、Object ,使用typeof出来都是Objec。无法检测具体是哪种引用类型。
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

export function deepMerge(...objs:any[]):any{
  const result = Object.create(null)
  objs.forEach(obj=>{
    if(obj) {
      Object.keys(obj).forEach(key=>{ // Object.keys(obj) obj的key集合
        const val = obj[key] // 每一项的值
        if(isObject(val)) {
          if(isObject(result[key])) {
            result[key] =deepMerge(result[key],val) // 递归
          }else {
            result[key] = deepMerge({},val)
          }
        }else {
          result[key] = val
        }
      })
    }
  })
return result
}
