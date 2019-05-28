import axios, { AxiosTransformer } from '../../src/index'
import qs from 'qs'

// axios.defaults.headers.common['test2'] = 123 // 类型“AxiosInstance”上不存在属性“defaults”。  ----> types 下interface Axios 中没有定义defaults

// axios({
//   url: '/config/post',
//   method: 'post',
//   data: qs.stringify({
//     a: 1
//   }),
//     // data:{a:1},
//   headers: {
//     test: '321'
//   }
// }).then((res) => {
    
//   console.log(res.data)
// })
// // debugger
// axios({
//   transformRequest: [(function(data) {
//     return data = qs.stringify(data)
//   }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
//   transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function(data) {
//     if (typeof data === 'object') {
//       data.b = 2
//     }
//     return data
//   }],
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1
//   }
// }).then((res) => {
//   console.log(res.data)
// })

const instance = axios.create({
  transformRequest: [(function(data) {
    return qs.stringify(data)
  }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
  transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function(data) {
    if (typeof data === 'object') {
      data.b = 2
    }
    return data
  }]
})

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then((res) => {
  console.log(res.data)
})


axios({
  transformRequest: [(function(data) {
    return data = qs.stringify(data)
  }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
  transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function(data) {
    if (typeof data === 'object') {
      data.b = 3
    }
    return data
  }],
  url: '/config/post',
  method: 'post',
  data: {
    a: 5
  }
}).then((res) => {
  console.log(res.data)
})
