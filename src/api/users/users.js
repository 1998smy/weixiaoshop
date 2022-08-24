import { request } from '../request.js'

// 请求用户数据列表
export function getUsersInfo(query, pagenum, pagesize) {
  return request({
    url: 'users',
    method: 'get',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

// 修改用户状态
export function getUsersState(uId, type) {
  return request({
    url: 'users/' + uId + '/state/' + type,
    method: 'put'
  })
}

// 添加用户
export function addUser(data) {
  return request({
    url: 'users',
    method: 'post',
    data
  })
}

// 根据 id 查询用户信息
export function searchUserInfo(id) {
  return request({
    url: 'users/' + id,
    method: 'get'
  })
}

// 修改用户请求
export function editUserInfo(id, email, mobile) {
  return request({
    url: 'users/' + id,
    method: 'put',
    data: {
      email,
      mobile
    }
  })
}

export function deleteUser(id) {
  return request({
    url: 'users/' + id,
    method: 'delete'
  })
}

