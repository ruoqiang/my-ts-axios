import { AxiosRequestConfig } from './types'
import { processHeaders } from './helpers/headers';
import { transformRequest, transformResponse } from './helpers/data';

const defaults: AxiosRequestConfig = {
    method: 'get',
    timeout: 0,
    headers: {
        common: {
            Accept: 'application/json, text/plain, */*'
        }
    },

    transformRequest: [
        // debugger 这里headers 为undefined
        function(data: any, headers: any): any {
          processHeaders(headers, data)
          return transformRequest(data)
        }
      ],
    
      transformResponse: [
        function(data: any): any {
          return transformResponse(data)
        }
      ]
}

const methodNoData = ['delete', 'get', 'head', 'options']

methodNoData.forEach(method => {
    defaults.headers[method] = {}
})

const methodWithData = ['put', 'post', 'patch']

methodWithData.forEach(method => {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export default defaults