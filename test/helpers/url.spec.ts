import { bulidURL, isAbsoluteURL, isURLSameOrigin, combineURL } from '../../src/helpers/url'

describe('helpers:url', () => {
  describe('bulidURL', () => {
    test('should no params return origin url', () => {
      expect(bulidURL('/foo')).toBe('/foo')
    })
    test('should support params', () => {
      const params = { foo: 'bar' }
      expect(bulidURL('/foo', params)).toBe('/foo?foo=bar')
    })
    test('should ignore some param is null', () => {
      const params = { foo: 'bar', baz: null }
      expect(bulidURL('/foo', params)).toBe('/foo?foo=bar')
    })
    test('should ignore the only param is null', () => {
      const params = { bar: null }
      expect(bulidURL('/foo', params)).toBe('/foo')
    })
    test('should support object params', () => {
      const params = {
        foo: {
          bar: 'baz'
        }
      }
      expect(bulidURL('/foo', params)).toBe('/foo?foo=' + encodeURI('{"bar":"baz"}'))
    })
    test('should support array params', () => {
      const params = {
        foo: ['bar', 'baz']
      }
      expect(bulidURL('/foo', params)).toBe('/foo?foo[]=bar&foo[]=baz')
    })
    test('should support Date params', () => {
      const date = new Date()
      const params = {
        date: date
      }
      expect(bulidURL('/foo', params)).toBe('/foo?date=' + date.toISOString())
    })
    test('should support special char params', () => {
      const params = {
        foo: '@:$, '
      }
      expect(bulidURL('/foo', params)).toBe('/foo?foo=@:$,+')
    })
    test('should support existing params', () => {
      const params = { foo: 'bar' }
      expect(bulidURL('/foo?baz=1', params)).toBe('/foo?baz=1&foo=bar')
    })
    test('should correct discard url hash mark', () => {
      const params = { foo: 'bar' }
      expect(bulidURL('/foo?baz=1#hash', params)).toBe('/foo?baz=1&foo=bar')
    })
    test('should use seralizer if provided', () => {
      const seralizer = jest.fn(() => {
        return 'foo=bar'
      })
      const params = { foo: 'bar' }
      expect(bulidURL('/foo', params, seralizer)).toBe('/foo?foo=bar')
      expect(seralizer).toHaveBeenCalled()
      expect(seralizer).toHaveBeenCalledWith(params)
    })
    test('should support URLSearchParams', () => {
      const params = new URLSearchParams('foo=bar')
      expect(bulidURL('/foo', params)).toBe('/foo?foo=bar')
    })
  })

  describe('isAbsoluteURL', () => {
    test('should return true if url begain with valid scheme name', () => {
      expect(isAbsoluteURL('https://api.github.com/users')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-v1.0://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://example.com/')).toBeTruthy()
    })
    test('should return false if url begain with invalid scheme name', () => {
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
    })
    test('should return true if url is protocol-relative', () => {
      expect(isAbsoluteURL('//example.com/')).toBeTruthy()
    })
    test('should return false if url is relative', () => {
      expect(isAbsoluteURL('/foo')).toBeFalsy()
      expect(isAbsoluteURL('foo')).toBeFalsy()
    })
  })

  describe('isURLSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })
    test('should detect diffenent origin', () => {
      expect(isURLSameOrigin('https://github.com/axios/axios')).toBeFalsy()
    })
  })
  // 不要使用汉字描述，这样不利于英语的提高
  describe('combineURL', () => {
    // test('should combine URL',()=> {
    //     expect(combineURL('https://api.github.com','/user')).toBe('https://api.github.com/user')
    // })
    // test('should BaseURL 末尾有斜杠，relativeURL开头无斜杠',()=> {
    //     expect(combineURL('https://api.github.com/','user')).toBe('https://api.github.com/user')
    // })
    // test('should BaseURL 末尾有斜杠，relativeURL开头有斜杠',()=> {
    //     expect(combineURL('https://api.github.com/','/user')).toBe('https://api.github.com/user')
    // })
    // test('should BaseURL 末尾无斜杠，relativeURL开头无斜杠',()=> {
    //     expect(combineURL('https://api.github.com','user')).toBe('https://api.github.com/user')
    // })
    // test('should BaseURL 末尾无斜杠，relativeURL为空',()=> {
    //     expect(combineURL('https://api.github.com','')).toBe('https://api.github.com')
    // })
    test('should combine URL', () => {
      expect(combineURL('https://api.github.com', '/user')).toBe('https://api.github.com/user')
    })
    test('should BaseURL ends has slashes, relativeURL begining no slashes', () => {
      expect(combineURL('https://api.github.com/', 'user')).toBe('https://api.github.com/user')
    })
    test('should BaseURL ends has slashes杠，relativeURL begining no slashes', () => {
      expect(combineURL('https://api.github.com/', '/user')).toBe('https://api.github.com/user')
    })
    test('should BaseURL ends no slashes，relativeURL begining has slashes', () => {
      expect(combineURL('https://api.github.com', 'user')).toBe('https://api.github.com/user')
    })
    test('should BaseURL ends no slashes，relativeURL is null', () => {
      expect(combineURL('https://api.github.com', '')).toBe('https://api.github.com')
    })
  })
})
