import { request } from "../request";

// 获取全部商品列表
export function getGoodsList(params) {
  return request({
    url: 'goods',
    method: 'get',
    params
  })
}

// 根据id查询商品
export function getGoodsById(id) {
  return request({
    url: 'goods/' + id,
    method: 'get'
  })
}

// 删除商品
export function deleteGoods(id) {
  return request({
    url: 'goods/' + id,
    method: 'delete'
  })
}

// 编辑提交商品
export function editGoods(id, data) {
  return request({
    url: 'goods/' + id,
    method: 'put',
    data
  })
}