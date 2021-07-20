import request from '@/utils/request'

//获取执行记录列表 运营方
export function getExecutionRecordList(data){
  return request({
    // url:'/console/contractExecution/listByPage',
    url:'/operator/execution/list',
    method:'get',
    params: data
  })
}
//获取执行记录列表 数据方
export function getExecutionRecordListForData(data){
  return request({
    url:'/console/contractExecution/listByPage',
    method:'get',
    params: data
  })
}

//获取执行记录列表 应用方
export function getExecutionRecordListForConsole(data){
  return request({
    url:'/console/contractExecution/listByPage',
    method:'get',
    params: data
  })
}

//获取执行结果列表
export function getExecutionResult(id){
  return request({
    url:'/console/dataConsumerContractExecutionResult/' + id,
    method:'get'
  })
}

//查看失败原因
export function queryFailReason(data){
  return request({
    url:'/console/dataConsumerContractExecutionResult/queryFailReason',
    method:'get',
    params: data
  })
}
