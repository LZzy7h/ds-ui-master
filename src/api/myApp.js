import request from '@/utils/request'

//创建应用
export function createApp(data){
    return request({
        url:'/console/app/save',
        method:'post',
        data
    })
}

//应用方查询应用列表
export function getAppList(data){
    return request({
        url:'/console/app/getAppList',
        method:'get',
        params:data
    })
}

//运营方 查询应用列表
export function getAppViewList(data){
    return request({
        url:'/console/app/getAppList',
        method:'get',
        params:data
    })
}

export function getAppViewListForOperator(data){
  return request({
      url:'/operator/app/getAppList',
      method:'get',
      params:data
  })
}

//修改应用
export function editApp(data){
    return request({
        url:'/console/app/update',
        method:'post',
        data
    })
}

//删除应用
export function delApp(id){
    return request({
        url:'/console/app/del/' + id ,
        method:'post'
    })
}

// // 获取创建方
// export function getAppListForOperator(){
//   return request({
//     url:'/console/app/getCreatorForAppListForOperator',
//     method:'post'
//   })
// }


// 获取应用方应用列表中的合约列表
export function getContractListOfApp(id){
  return request({
    url:'/contract/listForApp/'+id+'/2',
    method:'post'
  })
}

// 获取运营方应用列表中的合约列表
export function getOperatorContractListOfApp(id){
  return request({
    url:'/contract/listForApp/'+id+'/1',
    method:'post'
  })
}

