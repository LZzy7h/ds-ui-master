import request from '@/utils/request'

export function getEvidenceList(data){
  return request({
    url:'/block',
    method:'get',
    params:data
  })
}
