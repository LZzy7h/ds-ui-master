import request from '@/utils/request'

// 查询操作日志列表
export function list(query) {
  return request({
    url: '/system/operlog/list',
    method: 'get',
    params: query
  })
}

// 删除操作日志
export function delOperlog(operId) {
  return request({
    url: '/system/operlog/' + operId,
    method: 'delete'
  })
}

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/system/operlog/clean',
    method: 'delete'
  })
}

//数据方和应用方 查询操作日志列表
export function dataAppList(query) {
  return request({
    url: '/console/log/list',
    method: 'get',
    params: query
  })
}
//数据方和应用方 删除操作日志
export function delDataApplog(operId) {
  return request({
    url: '/console/log/' + operId,
    method: 'delete'
  })
}

//数据方和应用方 清空操作日志
export function cleanDataApplog() {
  return request({
    url: '/console/log/clean',
    method: 'delete'
  })
}