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