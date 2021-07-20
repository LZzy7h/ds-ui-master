import request from '@/utils/request'

// 查询应用目录列表
export function getScenarioSetting(data) {
  return request({
    url: '/operator/scenario/getList',
    method: 'post',
    data
  })
}

// 查询应用目录列表
export function getScenarioSettingForConsole() {
  return request({
    url: '/console/scenario/getList',
    method: 'post'
  })
}

// 查询运营方数据目录列表
export function getOperatorDatasetCatalog(data) {
  return request({
    url: '/operator/datasetCatalog/getList',
    method: 'post',
    data
  })
}

// 查询其他方数据目录列表
export function getDatasetCatalog() {
  return request({
    url: '/console/datasetCatalog/getList',
    method: 'post',
  })
}

// 删除应用目录
export function delScenarioSetting(id) {
  return request({
    url: '/operator/scenario/del/' + id,
    method: 'post'
  })
}

// 新增应用目录
export function addScenarioSetting(data) {
  return request({
    url: '/operator/scenario/save',
    method: 'post',
    headers:{
        'Content-Type':'application/json;charset=UTF-8'
    },
    data
  })
}

// 修改应用目录
export function updateScenarioSetting(data) {
  return request({
    url: '/operator/scenario/update',
    method: 'post',
    data
  })
}

// 新增数据目录
export function addDataDirectory(data) {
  return request({
    url: '/operator/datasetCatalog/save',
    method: 'post',
    headers:{
        'Content-Type':'application/json;charset=UTF-8'
    },
    data
  })
}

// 修改数据目录
export function updateDataDirectory(data) {
  return request({
    url: '/operator/datasetCatalog/update',
    method: 'post',
    data
  })
}

// 删除数据目录
export function delDataDirectory(id) {
  return request({
    url: '/operator/datasetCatalog/del/' + id,
    method: 'post'
  })
}

