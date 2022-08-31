import { request } from "../request";

// 添加商品
export function addGoods(data) {
  return request({
    url: 'goods',
    method: 'post',
    data
  })
}



