import request from '@/utils/request'


// 应用方查询参与方列表
export function getParticipantsManagementByApply(data) {
  return request({
    // url: '/operator/dsRole/getListByPage',
    url: '/console/dataset/dsRole/getAllRoles/4',
    method: 'get',
    params: data
  })
}

// 运营方查询应用提供方列表
export function getProviderList(data) {
  return request({
    url: '/operator/dsRole/getAllRoles/2',
    method: 'get',
    params: data
  })
}

// 查询参与方列表
export function getParticipantsManagement(data) {
  return request({
    // url: '/operator/dsRole/getListByPage',
    url: '/operator/dsRole/getAllRoles/4',
    method: 'get',
    params: data
  })
}

// 查询参与方列表
export function getOperatorParticipantsManagement(data) {
  return request({
    // url: '/operator/dsRole/getListByPage',
    url: '/operator/dsRole/getAllRoles/0',
    method: 'get',
    params: data
  })
}

export function getParticipantsManagement1(data) {
  return request({
    url: '/operator/dsRole/getListByPage',
    method: 'get',
    params: data
  })
}

// 创建参与方
export function addParticipantsManagement(data) {
  return request({
    url: '/operator/dsRole/save',
    method: 'post',
    data
  })
}

// 删除参与方
export function delParticipantsManagement(id) {
  return request({
    url: '/operator/dsRole/del/' + id,
    method: 'post'
  })
}

// 修改参与方信息
export function editParticipantsManagement(data) {
  return request({
    url: '/operator/dsRole/update',
    method: 'post',
    data
  })
}

// 查询dsid
export function getResultTargetDsList() {
  return request({
    url: '/console/dataset/dsRole/getAllRoles/0',
    method: 'get'
  })
}
