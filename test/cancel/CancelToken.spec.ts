import Cancel from '../../src//cancel/Cancel'
import CancelToken from '../../src/cancel/CancelToken'
import { Canceler } from '../../src/types/index'

describe('CancelToken', () => {
  describe('reason', () => {
    test('should return a Cancel if cancellation has been requested', () => {
      let cancel: Canceler
      let token = new CancelToken(c => {
        cancel = c
      })
      cancel!('Opertion has been canceled')

      expect(token.reason).toEqual(expect.any(Cancel))

      expect(token.reason!.message).toBe('Opertion has been canceled')
    })

    test('should has no slide effect if call cancellation for mutil times', () => {
      let cancel: Canceler
      let token = new CancelToken(c => {
        cancel = c
      })
      cancel!('Opertion has been canceled')
      cancel!('Opertion has been canceled')

      expect(token.reason).toEqual(expect.any(Cancel))

      expect(token.reason!.message).toBe('Opertion has been canceled')
    })

    test('should return undefined if cancelation has not been cancelled', () => {
      const token = new CancelToken(c => {
        // do nothing
      })
      expect(token.reason).toBeUndefined()
    })
  })

  describe('promise', () => {
    test('should return a Promise that resolves when cancellation is requested', done => {
      let cancel: Canceler
      const token = new CancelToken(c => {
        cancel = c
      })

      token.promise.then(value => {
        expect(value).toEqual(expect.any(Cancel))
        expect(value.message).toBe('Operation has been canceled.')
        done()
      })
      cancel!('Operation has been canceled.')
    })
  })
  describe('throwIfRequested   ', () => {
    test('should throw if cancellation has been requested', () => {
      let cancel: Canceler
      const token = new CancelToken(c => {
        cancel = c
      })
      cancel!('Operation has been canceled.')
      try {
        token.throwIfRequested()
        fail('Excepted throwIfRequested to throw.')
      } catch (thrown) {
        if (!(thrown instanceof Cancel)) {
          fail('Expected throwIfRequested to throw a Cancel, but test thrown ' + thrown + '.')
        }
        expect(thrown.message).toBe('Operation has been canceled.')
      }
    })
    test('should not thrown if cancellation has not been requested', () => {
      let token = new CancelToken(() => {
        // do nothing
      })
      token.throwIfRequested()
    })
  })
  describe('source', () => {
    test('should return an object containing token and cancel function', () => {
      const source = CancelToken.source()
      expect(source.token).toEqual(expect.any(CancelToken))
      expect(source.cancel).toEqual(expect.any(Function))
      expect(source.token.reason).toBeUndefined()
      source.cancel('Operation has been canceled.')
      expect(source.token.reason).toEqual(expect.any(Cancel))
      expect(source.token.reason!.message).toBe('Operation has been canceled.')
    })
  })
})
