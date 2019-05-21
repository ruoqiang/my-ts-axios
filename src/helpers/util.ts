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