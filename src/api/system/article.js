import $qs from 'qs'
import { request } from '../service'
const baseUrl = 'https://mini.lidaokoi.com'
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
export function remove (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_ad/v1/deleteOt',
    method: 'post',
    data: $qs.stringify(params)
  })
}
export function save (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_ad/v1/updateDelete',
    method: 'post',
    data: $qs.stringify(params)
  })
}
