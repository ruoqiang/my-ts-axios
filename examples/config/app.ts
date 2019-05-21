import axios from '../../src/index'
import qs from 'qs'

axios.defaults.headers.common['test2'] = 123 // 类型“AxiosInstance”上不存在属性“defaults”。  ----> types 下interface Axios 中没有定义defaults
debugger
axios({
  url: '/config/post',
  method: 'post',
//   data: qs.stringify({
//     a: 1
//   }),
    data:{a:1},
  headers: {
    test: '321'
  }
}).then((res) => {
    debugger
  console.log(res.data)
})