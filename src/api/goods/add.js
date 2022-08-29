import { request } from "../request";

// 添加商品
export function addGoods(data) {
  return request({
    url: 'goods',
    method: 'post',
    data
  })
}

// 参数列表
export function getCateAttributes(id, selname) {
  return request({
    url: 'categories/' + id + '/attributes',
    method: 'get',
    params: {
      sel: selname
    }
  })
}

