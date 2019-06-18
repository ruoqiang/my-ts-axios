import axios, { AxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'

function testHeaderValue(headers: any, key: string, val?: string): void {
  let found = false
  for (const k in headers) {
    if (k.toLowerCase() === key.toLowerCase()) {
      found = true
      expect(headers[k]).toBe(val)
      break
    }
  }

  if (!found) {
    if (typeof val === 'undefined') {
      expect(headers.hasOwnProperty(key)).toBeFalsy()
    } else {
      throw new Error(key + 'was nont found in headers')
    }
  }
}

describe('headers', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should use default common headers', () => {
    const headers = axios.defaults.headers.common

    axios('/foo')

    return getAjaxRequest().then(request => {
      for (let key in headers) {
        if (headers.hasOwnProperty(key)) {
          expect(request.requestHeaders[key]).toEqual(headers[key])
        }
      }
    })
  })

  test('should add extra headers for post', done => {
    axios
      .post('/foo', 'fir=bar')
      .then(res => {
        let response = res

        // console.log('res', res)

        // testHeaderValue(response.requestHeaders,'Content-Type','application/x-www-form-urlencoded')
      })
      .catch(error => {
        console.log('error', error)
      })
    // 这个写---return
    // return getAjaxRequest().then(request=>{
    //     console.log(request.requestHeaders)
    //     testHeaderValue(request.requestHeaders,'Content-Type','application/x-www-form-urlencoded')
    // })
    // 或者这样写----done()
    getAjaxRequest().then(request => {
      // ajax先走模拟的xi相应，再走上面 axios的then()
      request.respondWith({
        status: 200
      })

      testHeaderValue(request.requestHeaders, 'Content-Type', 'application/x-www-form-urlencoded')
      done()
    })
  })

  test('should use application/json when posting an object', () => {
    axios
      .post('/foo00', {
        firstname: 'zhang',
        lastname: 'san'
      })
      .then(res => {
        // 不会走到这里了，因为 模拟响应没有返回成功的状态
        let response = res
        console.log('-----------------------------》', response)
        // expect(response.headers['content-type']).toBe('application/jsons')
      })

    return getAjaxRequest().then(request => {
      // request.respondWith({
      //     status: 200,
      //     statusText: "OK",
      //     responseText: '{"foo":"bar"}',
      //     responseHeaders: {
      //         'Content-Type': 'application/json'
      //     }
      // })
      // console.log('-----------------------------》',request)
      expect(request.requestHeaders['Content-Type']).toBe('application/json;charset=utf-8')
    })
  })
  test('should remove content-type if data is empty', () => {
    axios.post('/foo')

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', undefined)
    })
  })
  test('should preserve content-type if data is false', () => {
    axios.post('/foo', false)

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', 'application/x-www-form-urlencoded')
    })
  })

  test('should remove content-type if data is FormData', () => {
    const data = new FormData()
    axios.post('/foo', data)

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', undefined)
    })
  })
})
