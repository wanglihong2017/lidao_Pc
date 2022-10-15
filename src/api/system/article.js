import $qs from 'qs'
import { request } from '../service'
const baseUrl = process.env.VUE_APP_BASE_API
export function getList (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_ot/v1/getManagerOtList?' + $qs.stringify(params),
    method: 'get'
  })
}
export function addOt (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_ot/v1/addOt',
    method: 'post',
    data: $qs.stringify(params)
  })
}
