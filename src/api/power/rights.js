import { request } from "../request";

export function getRightsList(type) {
  return request({
    url: 'rights/' + type,
    method: 'get'
  })
}