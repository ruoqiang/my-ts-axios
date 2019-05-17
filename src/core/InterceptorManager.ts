import { ResolvedFn, RejectedFn } from '../types/'

interface Interceptor<T> {
    resolved: ResolvedFn
    rejected?: RejectedFn
}

export default class InterceptorManager<T> {
    private interceptors: Array<Interceptor<T> | null>

    constructor() {
        this.interceptors = []
    }
    // 添加拦截器到 interceptors 中
    use(resolved: ResolvedFn, rejected?: RejectedFn): number {
        this.interceptors.push({
            resolved,
            rejected
        })
        return this.interceptors.length - 1
    }
    // 遍历 interceptors
    forEach(fn: (interceptor: Interceptor<T>) => void): void {
        
        this.interceptors.forEach(interceptor => {
            if (interceptor !== null) {
                fn(interceptor)
            }
        })
    }
    // 删除一个拦截器
    eject(id:number):void {
        if(this.interceptors[id]) {
            this.interceptors[id] = null
        }
    }
}