import $qs from 'qs'
import { request } from '../service'
const baseUrl = process.env.VUE_APP_BASE_API
export function getList (params) {
  return request({
    url: baseUrl + '/luckyfish/manage_user/v1/getManagerList?' + $qs.stringify(params),
    method: 'get'
  })
}
export function userAdd (params) {
  return request({
    url: baseUrl + '/luckyfish/manage_user/v1/managerAdd',
    method: 'post',
    data: $qs.stringify(params)
  })
}
export function remove (params) {
  return request({
    url: baseUrl + '/luckyfish/manage_user/v1/managerDelete',
    method: 'post',
    data: $qs.stringify(params)
  })
}
export function update (params) {
  return request({
    url: baseUrl + '/luckyfish/manage_user/v1/managerUpdate',
    method: 'post',
    data: $qs.stringify(params)
  })
}
export function roleOpts (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_role/v1/getAllList?' + $qs.stringify(params),
    method: 'get'
  })
}
