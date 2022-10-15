import $qs from 'qs'
import { request } from '../service'
const baseUrl = process.env.VUE_APP_BASE_API
export function getList (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_ad/v1/getManagerAdList?' + $qs.stringify(params),
    method: 'get'
  })
}
export function save (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_ad/v1/addAd',
    method: 'post',
    data: $qs.stringify(params)
  })
}
