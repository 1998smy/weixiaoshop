import { request } from "../request";

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

// 添加动态参数/静态属性
export function addParams(id, attr_name, attr_sel) {
  return request({
    url: 'categories/' + id + '/attributes',
    method: 'post',
    data: {
      attr_name,
      attr_sel
    }
  })
}

// 修改参数
export function editParams(id, attrId, attr_name, attr_sel, attr_vals) {
  return request({
    url: 'categories/' + id + '/attributes/' + attrId,
    method: 'put',
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}

// 根据id查询 分类参数
export function getParamsById(id, attrId, attr_sel) {
  return request({
    url: 'categories/' + id + '/attributes/' + attrId,
    method: 'get',
    data: {
      attr_sel
    }
  })
}

// 删除参数
export function deleteParams(id, attrId) {
  return request({
    url: 'categories/' + id + '/attributes/' + attrId,
    method: 'delete'
  })
}