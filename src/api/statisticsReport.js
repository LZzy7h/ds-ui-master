import request from '@/utils/request'


export function getStatisticsReport(params) {
    return request({
      url: '/operator/getReport',
      method: 'get',
      params
    })
  }

  export function getDatasetReport(params) {
    return request({
      url: `/operator/getDatasetReport`,
      method: 'get',
      params
    })
  }
