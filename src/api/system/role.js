import $qs from 'qs'
import { request } from '../service'
const baseUrl = process.env.VUE_APP_BASE_API
export function roleOpts (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_role/v1/getAllList?' + $qs.stringify(params),
    method: 'get'
  })
}
