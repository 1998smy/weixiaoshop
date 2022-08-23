import { request } from "../request.js";

export function getMenus() {
  return request({
    url: 'menus',
    method: 'get',
  })
}