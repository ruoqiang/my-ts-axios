import axios from '../src/index'
import { getAjaxRequest } from './helper'

describe('cancel', () => {
  const CancelToken = axios.CancelToken
  const Cancel = axios.Cancel

  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })
  describe('when called before sending request', () => {
    test('should reject Promise with a Cancel object', () => {
      const source = CancelToken.source()
      source.cancel('Operation has been cancelled')

      return axios
        .get('/foo', {
          cancelToken: source.token
        })
        .catch(reason => {
          expect(reason).toEqual(expect.any(Cancel))
          expect(reason.message).toBe('Operation has been cancelled')
        })
    })
  })
  describe('when called after request has been sent', () => {
    test('should reject Promise with a Cancel object', done => {
      const source = CancelToken.source()
      source.cancel('Operation has been cancelled.')

      axios
        .get('/foo', {
          cancelToken: source.token
        })
        .catch(reason => {
          expect(reason).toEqual(expect.any(Cancel))
          expect(reason.message).toBe('Operation has been cancelled.')
          done()
        })

      getAjaxRequest().then(request => {
        source.cancel('Operation has been cancelled.')
        setTimeout(() => {
          request.respondWith({
            status: 200,
            responseText: 'OK'
          })
        }, 100)
      })
    })

    test('should calls abort on request object', done => {
      let source = CancelToken.source()
      let request: any
      axios
        .get('/foo.bar', {
          cancelToken: source.token
        })
        .catch(() => {
          expect(request.statusText).toBe('abort')
        })

      getAjaxRequest().then(res => {
        source.cancel()
        request = res
        done()
      })
    })
  })
  describe('when called after response has been received', () => {
    test('should not cause unhandled rejection', done => {
      const source = CancelToken.source()
      axios
        .get('/foo', {
          cancelToken: source.token
        })
        .then(() => {
          window.addEventListener('unhandledrejection', () => {
            done.fail('unhandled rejection.')
          })
          source.cancel()
          setTimeout(done, 100)
        })
      getAjaxRequest().then(res => {
        res.respondWith({
          status: 200,
          responseText: 'OK'
        })
      })
    })
  })
})
