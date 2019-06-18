import { transformRequest, transformResponse } from '../../src/helpers/data'

describe('helpers:data', () => {
  describe('transformRequest', () => {
    test('should turn string object if data is PlainObject', () => {
      const a = { foo: 123 }
      expect(transformRequest(a)).toBe('{"foo":123}')
    })

    test('should do null if data is not PlainObject', () => {
      const a = new URLSearchParams('a=b')
      expect(transformRequest(a)).toBe(a)
    })
  })

  describe('transformResponse', () => {
    test('should transform response data to Object if data is JSON string', () => {
      const a = '{"a":123}'
      expect(transformResponse(a)).toEqual({ a: 123 })
    })

    test('should do nothing if data is not string', () => {
      const a = { a: 222 }
      expect(transformResponse(a)).toBe(a)
    })
  })
})
