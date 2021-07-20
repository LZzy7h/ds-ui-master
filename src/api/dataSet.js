import request from '@/utils/request'



/**
 * 数据提供方
 * @param {*} data
 */
//数据提供方数据集列表
export function getDataSetList(data){
    return request({
        url:'/console/dataset/query/list',
        method:'get',
        params:data
    })
}


//上下架
export function upDown(params){
    return request({
        url:'/console/dataset/updown',
        method:'get',
        params
    })
}

//删除数据集

export function deleteDataSet(id){
    return request({
        url:'/console/dataset/delete?id=' + id,
        method:'get'
    })
}

//数据提供方查看样例数据
export function sampleViewList(id){
    return request({
        url:'/console/dataset/getSampleData?datasetSampleId=' + id,
        method:'get'
    })
}

//数据库详情
export function getDBDetail(data){
  return request({
    url:'/console/db/detail',
    method:'get',
    params:data
  })
}

//添加数据库
export function addDB(formData){
    return request({
        url:'/console/db/save',
        method:'post',
        data:formData,
        headers:{'Content-Type':'multipart/form-data'}
    })
}

//修改数据库
export function editDB(formData){
  return request({
    url:'/console/db/modify',
    method:'post',
    data:formData,
    headers:{'Content-Type':'multipart/form-data'}
  })
}

//获取数据库表名
export function getDBTbale(data){
    return request({
        url:'/console/db/getTable',
        method:'post',
        data
    })
}

//查询所有数据库
export function getAllDB(data){
    return request({
        url:'/console/db/list',
        method:'get',
        params:data
    })
}

//添加数据集查询所有数据库
export function getAllDBForAddDataset(data){
  return request({
    url:'/console/db/queryAllDb',
    method:'get'
  })
}

//查询数据库类型
export function getDBType(){
  return request({
    url:'/console/db/types',
    method:'get'
  })
}

//删除数据库
export function deleteDB(id){
  return request({
    url:'/console/db/del/'+id,
    method:'get'
  })
}

//保存数据库信息
export function queryColumns(data){
    return request({
        url:'/console/db/columns',
        method:'post',
        data
    })
}
//获取数据集类型
export function getDataSetType(){
    return request({
        url:'/console/dataset/getDataType',
        method:'get'
    })
}

//生成数据集
export function saveDataSet(data){
    return request({
        url:'/console/dataset/save/db',
        method:'post',
        data
    })
}

//生成空数据集
export function saveEmptyDataSet(data){
  return request({
    url:'/console/dataset/save/empty',
    method:'post',
    data
  })
}

//生成样例数据集
export function saveSampelDataSet(data){
  return request({
    url:'/console/dataset/save/db/sample',
    method:'post',
    data
  })
}

//查看数据集使用情况
export function getDataSetUse(data){
  return request({
    url:'/console/dataset/getDatasetUse',
    method:'get',
    params: data
  })
}

//上传CSV
export function uploadCsv(params){
    return request({
        url:`/console/dataset/save/csv?infoKey=${params.infoKey}&md5=${params.md5}&datasetName=${params.datasetName}&datasetDescription=${params.datasetDescription}&datasetType=${params.datasetType}&line=${params.line}&column=${params.column}`,
        method:'post'
    })
}

//上传样例CSV
export function uploadSampleCsv(data,id){
    return request({
        url:'/console/dataset/save/csv/sample?id='+id,
        method:'post',
        data
    })
}

// 正式api数据集保存
export function formalAPIDatasetSaving(data){
    return request({
        url:'/console/dataset/save/api',
        method:'post',
        data
    })
}

// 样例api数据集保存
export function sampleAPIDatasetSaving(data){
    return request({
        url:'/dataset/save/api/sample',
        method:'post',
        data
    })
}


//查看数据集详情
export function getDataSetInfo(data){
  return request({
    url:'/console/dataset/getDatasetinfo',
    method:'get',
    params: data
  })
}


/**
 *
 * 运营方
 */

//查询数据集列表
export function operatorDataSetList(data){
    return request({
        url:'/operator/dataset/list',
        method:'get',
        params: data
    })
}
//运营方数据集所属机构
export function getUserCorp(){
    return request({
        url:'/console/consumer/getUserCorp',
        method:'get'
    })
}
//运营方数据集所属机构
export function operatorGetUserCorp(){
    return request({
        url:'/console/dataset/getUserCorp',
        method:'get'
    })
}





/**
 * 数据应用方
 */


 //根据目录获取数据集名称、URL、数据集ID
export function getAppDataUrl(params){
    return request({
        url:'/console/dataset/getDataUrl',
        method:'get',
        params
    })
}


 //获取数据集列表
export function appDataSetList(data){
    return request({
        url:'/console/dataset/query/list',
        method:'get',
        params:data
    })
}
//应用方数据集所属机构
export function consumerGetUserCorp(){
    return request({
        url:'/console/dataset/getUserCorp',
        method:'get'
    })
}

//应用方数据集修改目录
export function updataCatalogForDataSet(data){
  return request({
    url:'/console/dataset/changeCatalog',
    method:'get',
    params:data
  })
}

//初始化上传文件，判断其是否已经上传完成
export function intFileUpload(data){
  return request({
    url:'/console/dataset/save/csv/file/init',
    method:'get',
    params:data
  })
}
