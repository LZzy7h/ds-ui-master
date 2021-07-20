import request from '@/utils/request'

// 获取kv
export function getKv(data) {
  return request({
    url: '/console/kv/getKV',
    method: 'get'
  })
}

// 获取某个kv
// export function getKv(data) {
//   return request({
//     url: '/kv/getValue',
//     method: 'get',
//     params: data
//   })
// }

// 添加kv
export function saveKv(data) {
  return request({
    url: '/console/kv/save',
    method: 'post',
    data
  })
}

// 修改kv
export function updateKv(data) {
  return request({
    url: '/console/kv/updateKV',
    method: 'post',
    data
  })
}

// 删除kv
export function deleteKv(data) {
  return request({
    url: '/console/kv/deleteValue',
    method: 'get',
    params: data
  })
}
