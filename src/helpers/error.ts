import { AxiosRequestConfig, AxiosResponse } from '../types/index'

export class AxiosError extends Error {
    isAxiosError: boolean
    config?: AxiosRequestConfig
    code?: string | null
    request?: any
    response?: AxiosResponse
    constructor(
        message: string,
        config: AxiosRequestConfig,
        code?: string | null,
        request?: any,
        response?: AxiosResponse
    ) {
        super(message)

        this.config = config
        this.code = code
        this.request = request
        this.response = response
        this.isAxiosError = true

        Object.setPrototypeOf(this, AxiosError.prototype) // 为了解决 TypeScript 继承一些内置对象的时候的坑
    }
}

export function CrateError(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
): AxiosError {
    let error = new AxiosError(message, config, code, request.response)
    return error
}