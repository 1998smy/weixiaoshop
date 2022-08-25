import { request } from "../request";

// 所有角色列表
export function getRolesList() {
  return request({
    url: 'roles',
    method: 'get'
  })
}

// 删除角色指定权限
export function deleteRoleRight(roleId, rightId) {
  return request({
    url: 'roles/' + roleId + '/rights/' + rightId,
    method: 'delete'
  })
}

// 角色授权 权限请求
export function conRolesRights(roleId, rids) {
  return request({
    url: 'roles/' + roleId + '/rights',
    method: 'post',
    data: {
      rids
    }
  })
}

// 添加角色请求
export function addRole(data) {
  return request({
    url: 'roles',
    method: 'post',
    data
  })
}

// 编辑提交角色
export function editRole(id, data) {
  return request({
    url: 'roles/' + id,
    method: 'put',
    data
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: 'roles/' + id,
    method: 'delete',
  })
}