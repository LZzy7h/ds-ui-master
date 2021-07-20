import request from '@/utils/request'

//添加算法
export function addAlgorithm(data){
  return request({
    url:'/console/algorithm/save',
    method:'post',
    data
  })
}

//获取算法列表
export function getAlgorithmList(data){
  return request({
    url:'/console/algorithm/getAlgorithmList',
    method:'get',
    params:data
  })
}

//修改算法
export function updateAlgorithm(data){
  return request({
    url:'/console/algorithm/update',
    method:'post',
    data
  })
}

//删除算法
export function deleteAlgorithm(id){
  return request({
    url:'/console/algorithm/del/' + id,
    method:'post'
  })
}

//获取算法目录
export function getFileList(data){
  return request({
    url:'/console/algorithm/getJupyterFileList',
    method:'post',
    data
  })
}

//获取算法内容
export function getFileContent(data){
  return request({
    url:'/console/algorithm/getJupyterFile',
    method:'post',
    data
  })
}

