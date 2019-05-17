import { config, head } from "shelljs";
import { request } from "http";
import { puts } from "util";

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any,
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number

  [propName: string]: any
}

export interface AxiosResponse<T=any> {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}
export interface AxiosPromise extends Promise<AxiosResponse> { }

export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse
  isAxiosError: boolean
}

// 定义一个 Axios 类型接口，它描述了 Axios 类中的公共方法
export interface Axios{


  interceptors: {
    request:AxiosInterceptorManager<AxiosRequestConfig>
    response:AxiosInterceptorManager<AxiosResponse>
  }

  request(config:AxiosRequestConfig):AxiosPromise

  get(url:string,config?:AxiosRequestConfig):AxiosPromise

  delete(url:string,config?:AxiosRequestConfig):AxiosPromise

  head(url:string,config?:AxiosRequestConfig):AxiosPromise

  options(url:string,config?:AxiosRequestConfig):AxiosPromise

  post(url:string,data?:any,config?:AxiosRequestConfig):AxiosPromise

  put(url:string,data?:any,config?:AxiosRequestConfig):AxiosPromise

  patch(url:string,data?:any,config?:AxiosRequestConfig):AxiosPromise

}

export interface AxiosInstance extends Axios{

  (config:AxiosRequestConfig):AxiosPromise

}

// 拦截器管理对象对外的接口
export interface AxiosInterceptorManager<T> {
  use(resolve:ResolvedFn<T>,rejected?:RejectedFn):number

  eject(id:number):void
}
export interface ResolvedFn<T=any> {
  (val:T):T | Promise<T>
}

export interface RejectedFn<T=any> {
  (error:any):any
}