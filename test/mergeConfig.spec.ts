import axios from '../src/index'
import mergeConfig from '../src/core/mergeConfig'

describe('mergeConfig', () => {
  const defaults = axios.defaults

  test('should accept undefined for second argument', () => {
    expect(mergeConfig(defaults, undefined)).toEqual(defaults)
  })

  test('should accept an empty object for second argument', () => {
    expect(mergeConfig(defaults, {})).toEqual(defaults)
  })

  test('should not leave references', () => {
    const merged = mergeConfig(defaults, {})
    expect(merged).not.toBe(defaults)
    expect(merged.headers).not.toBe(defaults.headers)
  })

  test('should allow setting request options', () => {
    const config = {
      url: '__simple url__',
      params: '__simple params__',
      data: { foo: true }
    }
    const merged = mergeConfig(defaults, config)

    expect(merged.url).toBe(config.url)
    expect(merged.params).toBe(config.params)
    expect(merged.data).toEqual(config.data)
  })

  test('should not inherit request options', () => {
    const localDefaults = {
      url: '__simple url__',
      params: '__simple params__',
      data: { foo: true }
    }
    let parsed = mergeConfig(localDefaults, {})
    expect(parsed.url).toBeUndefined()
    expect(parsed.params).toBeUndefined()
    expect(parsed.data).toBeUndefined()
  })

  test('should return default headers if pass config2 wit undefined', () => {
    let config = { headers: 'x-mock-header' }
    let parsed = mergeConfig(config, undefined)
    expect(parsed.headers).toBe('x-mock-header')
  })

  test('should merge with auth,header with defaults', () => {
    let config = {
      auth: undefined
    }
    let header = {
      auth: {
        username: 'foo',
        password: 'bar'
      }
    }
    let header2 = {
      auth: {
        username: 'foo2',
        password: 'bar2'
      }
    }
    let parsed = mergeConfig(config, header)

    expect(parsed).toEqual({
      auth: {
        username: 'foo',
        password: 'bar'
      }
    })
    let parsed2 = mergeConfig(config, header2)
    expect(parsed2).toEqual({
      auth: {
        username: 'foo2',
        password: 'bar2'
      }
    })
  })

  test('should overwrite auth, headers with a non-object value', () => {
    let configDefaults = {
      headers: {
        common: {
          Accept: 'application/json,text/plain,*/*'
        }
      }
    }
    let configDefaults2 = {
      headers: null
    }
    expect(mergeConfig(configDefaults, configDefaults2)).toEqual({
      headers: null
    })
  })

  test('should allow setting other options', () => {
    const merged = mergeConfig(defaults, { timeout: 123 })
    expect(merged.timeout).toBe(123)
  })
})
