import axios, { AxiosRequestConfig, AxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'

describe('instance', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should make a http request without verb helper', () => {
    const instance = axios.create()

    instance('/foo')

    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
    })
  })

  test('should make a get http request', () => {
    const instance = axios.create()
    instance('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('GET')
    })
  })

  test('should make a post http request', () => {
    const instance = axios.create()
    instance.post('/foo')
    return getAjaxRequest().then(request => {
      expect(request.method).toBe('POST')
    })
  })
  test('should make a put request', () => {
    const instance = axios.create()

    instance.put('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('PUT')
    })
  })

  test('should make a patch request', () => {
    const instance = axios.create()

    instance.patch('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('PATCH')
    })
  })

  test('should make a options request', () => {
    const instance = axios.create()

    instance.options('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('OPTIONS')
    })
  })

  test('should make a delete request', () => {
    const instance = axios.create()

    instance.delete('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('DELETE')
    })
  })

  test('should make a head request', () => {
    const instance = axios.create()

    instance.head('/foo')

    return getAjaxRequest().then(request => {
      expect(request.method).toBe('HEAD')
    })
  })

  //   test('should use instance options',(done)=> {
  //     const instance = axios.create({ timeout: 1000 })

  //     instance.get('/foo')

  //     return getAjaxRequest().then(request => {
  //         console.log(request);

  //       setTimeout(()=> {
  //         expect(request.timeout).toBe(10001)
  //         done()
  //       },1100)

  //     })
  //   })
  test('should use instance options', done => {
    const instance = axios.create({ timeout: 1000 })

    let response: AxiosResponse
    instance.get('/foo').then(res => {
      response = res
    })

    return getAjaxRequest().then(request => {
      request.respondWith({ status: 200 })

      setTimeout(() => {
        // console.log(response);
        expect(response.config.timeout).toBe(1000)
        done()
      }, 100)
      // expect(response.config.timeout).toBe(10001)

      // console.log(request);
      // // @ts-ignore
      //  request.eventBus.trigger('timeout')
      //   expect(request.timeout).toBe(1000)
    })
  })
  test('should have defaults.headers', () => {
    const instance = axios.create({ baseURL: 'https://api.example.com' })

    expect(typeof instance.defaults.headers).toBe('object')
    expect(typeof instance.defaults.headers.common).toBe('object')
  })

  test('should get the computed uri', () => {
    const fakeConfig: AxiosRequestConfig = {
      baseURL: 'https://api.example.com',
      url: 'user/1234',
      params: {
        idClinet: 1,
        idTest: 2,
        testString: 'thisIsTest'
      }
    }
    expect(axios.getUri(fakeConfig)).toBe(
      'https://api.example.com/user/1234?idClinet=1&idTest=2&testString=thisIsTest'
    )
  })
  // 一旦我们修改了 axios 的默认配置，会影响所有的请求。我们希望提供了一个 axios.create 的静态接口允许我们创建一个新的 axios 实例
  test('should have interceptors on the instance', done => {
    axios.interceptors.request.use(config => {
      config.timeout = 2000
      return config
    })
    const instance = axios.create()

    instance.interceptors.request.use(config => {
      config.withCredentials = true
      return config
    })

    let response: AxiosResponse
    // 这里是新创建的instance 配置是一个新的全新的与前面的axios被修改了的配置无关 --->全新的
    instance.get('/foo').then(res => {
      response = res
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })
      setTimeout(() => {
        expect(response.config.timeout).toBe(0)
        expect(response.config.withCredentials).toBe(true)
        done()
      }, 100)
    })
  })
})
