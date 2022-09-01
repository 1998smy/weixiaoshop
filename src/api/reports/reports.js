import { request } from "../request";

export function getEchartsData() {
  return request({
    url: 'reports/type/1',
    method: 'get'
  })
}