import { request } from "../request.js";

export function login(data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}