import { request } from "../request";

// 请求商品分类数据列表
export function getGoodsCate(params) {
  return request({
    url: 'categories',
    method: 'get',
    params
  })
}

// 添加分类
export function addGoodsCate(data) {
  return request({
    url: 'categories',
    method: 'post',
    data
  })
}

// 编辑分类
export function editGoodsCate(id, cat_name) {
  return request({
    url: 'categories/' + id,
    method: 'put',
    data: {
      cat_name
    }
  })
}

// 删除分类
export function deleteGoodsCate(id) {
  return request({
    url: 'categories/' + id,
    method: 'delete'
  })
}