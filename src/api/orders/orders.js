import { request } from "../request";

export function getOrders(params) {
  return request({
    url: 'orders',
    method: 'get',
    params
  })
}

// 查看订单详情
export function checkOrdersInfo(id) {
  return request({
    url: 'orders/' + id,
    method: 'get'
  })
}

// 查询物流进度
export function checkPogress(id) {
  return request({
    url: '/kuaidi/' + id,
    method: 'get'
  })
}

// 修改订单状态
export function editStatus(id, data) {
  return request({
    url: 'orders/' + id,
    method: 'put',
    data
  })
}