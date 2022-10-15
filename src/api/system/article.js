import $qs from 'qs'
import { request } from '../service'
const baseUrl = process.env.VUE_APP_BASE_API
export function getList (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_ot/v1/getManagerOtList?' + $qs.stringify(params),
    method: 'get'
  })
}
