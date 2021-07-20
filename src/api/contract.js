import request from '@/utils/request'

//创建合约
export function createContract(formData){
    return request({
        url:'/contract/create',
        method:'post',
        data:formData,
        headers:{'Content-Type':'multipart/form-data'}
    })
}

//获取合约列表
export function getContractList(dataVal,data){
    return request({
        url:'/contract/list',
        method:'post',
        params: dataVal,
        data
    })
}

//获取合约详情(应用方)
export function getContractDetails(id){
  return request({
    url:'/contract/detail/' + id,
    method:'post'
  })
}

//获取合约详情(数据方)
export function getProviderContractDetails(id){
  return request({
    url:'/contract/detail/' + id,
    method:'post'
  })
}
//获取合约审批列表(数据方)
export function getContractApprove(dataVal,data){
  return request({
    url:'/contractApprove/approveList',
    method:'post',
    params: dataVal,
    data


  })
}
//查询发起方列表
export function getDsList(){
  return request({
    url:'/console/dataset/dsRole/getAllRoles/2',
    method:'get'
  })
}
//获取合约详情(运营方)
export function getOperatorContractDetails(id){
  return request({
    url:'/contract/detail/' + id,
    method:'post'
  })
}

//执行合约
export function executeContract(id){
  return request({
    url:'/console/contractExecution/execute/' + id,
    method:'post'
  })
}

// 删除合约
export function deleteApproval(id){
  return request({
    url:'/contract/delete/' + id,
    method:'post'
  })
}

//提交送审
export function submitApproval(id){
  return request({
    url:'/contractApprove/submitApproval/' + id,
    method:'post'
  })
}

//合约审批列表
export function approveList(status){
  return request({
    url:'/contractApprove/approveList/' + status,
    method:'post'
  })
}

//合约审批
export function approveContract(data,id,data1){
  return request({
    url:'/contractApprove/approveAction/'+id,
    method:'post',
    data:data,
    headers:{'data':data1}
  })
}

//应用方获取合约详情中的code
export function getContractCode(id){
  return request({
    url:'/contract/algorithm/' + id,
    method:'post'
  })
}

//数据方获取合约详情中的code
export function getDataContractCode(id){
  return request({
    url:'/contract/algorithm/' + id,
    method:'post'
  })
}

//运营方获取合约详情中的code
export function getOperatorContractCode(id){
  return request({
    url:'/contract/algorithm/' + id,
    method:'post'
  })
}

//应用方合约中api详情
export function getApiInfo(id){
  return request({
    url:'/contract/apiInfo/' + id,
    method:'post',
  })
}
