import { request } from '../request.js'

export function getUsersInfo(query, pagenum, pagesize) {
  return request({
    url: 'users',
    method: 'get',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}