import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

//创建用户
export function createUser(data){
  return request({
    url:'/user/save',
    method:'post',
    data
  })
}

//修改用户
export function updatePassword(data){
  return request({
    url:'/user/updatePassword',
    method:'post',
    data
  })
}

//查询用户列表
export function getUserList(data){
  return request({
    url:'/user/getList',
    method:'post',
    data
  })
}

//删除用户
export function deleteUser(uid){
  return request({
    url:'/user/del/' + uid ,
    method:'post'
  })
}
