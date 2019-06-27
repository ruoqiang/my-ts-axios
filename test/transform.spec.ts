import axios, { AxiosResponse, AxiosTransformer } from '../src/index'
import { getAjaxRequest } from './helper'

describe('transform', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should transform JSON to string', () => {
    const data = {
      foo: 'bar'
    }
    axios.post('/foo', data)
    return getAjaxRequest().then(request => {
      // console.log(request);
      expect(request.params).toBe('{"foo":"bar"}')
    })
  })
  test('should transform string to JSON', () => {
    let response: AxiosResponse
    axios('/foo').then(res => {
      response = res
      expect(typeof res.data).toBe('object')
      expect(res.data.foo).toBe('bar')
    })

    return getAjaxRequest().then(res => {
      res.respondWith({
        status: 200,
        responseText: '{"foo": "bar"}'
      })
    })
  })

  test('should override default transform', () => {
    const data = {
      foo: 'bar'
    }
    axios.post('/foo', data, {
      transformRequest(data) {
        return data
      }
    })
    return getAjaxRequest().then(res => {
      expect(res.params).toEqual({ foo: 'bar' })
    })
  })
  test('should all an array of transforms', () => {
    const data = {
      foo: 'bar'
    }
    axios.post('/foo', data, {
      transformRequest: (axios.defaults.transformRequest as AxiosTransformer[]).concat(function(
        data
      ) {
        return data.replace('bar', 'baz')
      })
    })
    return getAjaxRequest().then(res => {
      expect(res.params).toBe('{"foo":"baz"}')
    })
  })
  test('should all mutating headers', () => {
    const token = Math.floor(Math.random() * Math.pow(2, 64)).toString(36)
    axios('/foo', {
      transformRequest: (data, headers) => {
        headers['X-Authorization'] = token
        return data
      }
    })
    return getAjaxRequest().then(res => {
      // console.log(res.requestHeaders['X-Authorization']);
      expect(res.requestHeaders['X-Authorization']).toEqual(token)
    })
  })
})
