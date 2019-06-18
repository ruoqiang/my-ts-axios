import axios, { AxiosResponse, AxiosError } from '../src/index'
import { getAjaxRequest } from './helper'

describe('request', () => {
  beforeAll(() => {
    jasmine.Ajax.install()
  })
  afterAll(() => {
    jasmine.Ajax.uninstall()
  })

  test('should treat single string arg as url', () => {
    axios('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
    })
  })

  test('should treat method value as lowercase string', done => {
    // 每个测试用例函数有一个 done 参数，一旦我们使用了该参数，只有当 done 函数执行的时候表示这个测试用例结束
    axios({
      url: '/foo',
      method: 'POST'
    }).then(response => {
      expect(response.config.method).toBe('post')
      done() //  done 函数执行的时候表示这个测试用例结束。
    })

    // 模拟一个请求结果，并返回 200状态
    return getAjaxRequest().then(request => {
      request.respondWith({ status: 200 })
    })
  })

  test('should reject when request timeout', done => {
    let err: AxiosError
    axios('/foo', {
      timeout: 2000,
      method: 'POST'
    }).catch(error => {
      err = error
    })

    getAjaxRequest().then(request => {
      // @ts-ignore
      request.eventBus.trigger('timeout')

      setTimeout(() => {
        expect(err instanceof Error).toBeTruthy()
        expect(err.message).toBe('Timeout of 2000 ms exceeded')
        done()
      }, 100)
    })
  })

  test('should rejected on network errors', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })

    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    jasmine.Ajax.uninstall()

    axios('/foo')
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    function next(reason: AxiosResponse | AxiosError) {
      expect(resolveSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Network Error')
      expect(reason.request).toEqual(expect.any(XMLHttpRequest))

      jasmine.Ajax.install()
      done()
    }
  })
  // 开始报错console.error node_modules/jsdom/lib/jsdom/virtual-console.js:29
  // Error: Error: connect ECONNREFUSED 127.0.0.1:80
  // 无视上面的报错
  test('should resolve when validateStatus return true', done => {
    const resolveSpy = jest.fn((res: AxiosResponse) => {
      return res
    })
    const rejectSpy = jest.fn((e: AxiosError) => {
      return e
    })

    axios('/foo', {
      validateStatus(status) {
        return status === 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(next)

    function next(res: AxiosResponse | AxiosError) {
      expect(resolveSpy).toHaveBeenCalled()
      expect(rejectSpy).not.toHaveBeenCalled()
      expect(res.config.url).toBe('/foo')

      done()
    }

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
    })
  })

  test('should return JSON when resolved', done => {
    let response: AxiosResponse

    axios('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).then(res => {
      response = res

      expect(response.data).toEqual({ a: 1 })
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"a":1}'
      })
      // setTimeout(()=> {
      //     expect(response.data).toEqual({a:1})
      //     done()
      // },100)
      done()
    })
  })

  test('should return JSON when rejecting', () => {
    let response: AxiosResponse
    axios('/api/account/signup', {
      auth: {
        username: '',
        password: ''
      },
      method: 'post',
      headers: {
        Accept: 'application/json'
      }
    }).catch(error => {
      response = error.response
      expect(typeof response.data).toBe('object')
      expect(response.data.error).toBe('Bad USERNAME')
      expect(response.data.code).toBe(1)
    })

    return getAjaxRequest().then(request => {
      // getAjaxRequest前面如果不加return 或者内部不使用done()结束掉 会影响后面的模拟请求结果
      request.respondWith({
        status: 400,
        statusText: 'Bad Request',
        responseText: '{"error":"Bad USERNAME","code": 1}'
      })
    })
  })

  test('should supply correct response', done => {
    axios.post('/foo').then(res => {
      let response = res
      expect(response.status).toBe(200)
      expect(response.data.foo).toBe('bar')
      expect(response.statusText).toBe('OK')
      expect(response.headers['content-type']).toBe('application/json')
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"foo":"bar"}',
        responseHeaders: {
          'Content-Type': 'application/json'
        }
      })
      done()
    })
  })

  test('should allow overriding Content-Type header case-insensitive', () => {
    let response: AxiosResponse
    axios
      .post(
        '/foo',
        { prop: 'value' },
        {
          headers: {
            'content-type': 'application/json'
          }
        }
      )
      .then(res => {
        response = res
      })

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['Content-Type']).toBe('application/json')
    })
  })
  // jest 非常好地支持异步测试代码。通常有 2 种解决方案。
  // 第一种是利用 done 参数，每个测试用例函数有一个 done 参数，一旦我们使用了该参数，只有当 done 函数执行的时候表示这个测试用例结束。
  // 第二种是我们的测试函数返回一个 Promise 对象，一旦这个 Promise 对象 resolve 了，表示这个测试结束
})
