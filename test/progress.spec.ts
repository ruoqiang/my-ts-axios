import axios from '../src/index'
import { getAjaxRequest } from './helper'

describe('progress', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should add a download process handler', () => {
    const processSpy = jest.fn()

    axios('/foo', { onDownloadProgress: processSpy })

    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK'
      })
      expect(processSpy).toHaveBeenCalled()
    })
  })

  test('should add a upload progress handler', () => {
    const progressSpy = jest.fn()

    axios('/foo', { onUploadProgress: progressSpy })

    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK'
      })
      // Jasmine AJAX doesn't trigger upload events.Waiting for jest-ajax fix
      // expect(progressSpy).toHaveBeenCalled()
    })
  })
})
