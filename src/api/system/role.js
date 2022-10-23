import $qs from 'qs'
import { request } from '../service'
const baseUrl = 'https://mini.lidaokoi.com'
export function getList (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_role/v1/getRoleList?' + $qs.stringify(params),
    method: 'get'
  })
}
export function save (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_role/v1/add',
    method: 'post',
    data: $qs.stringify(params)
  })
}
export function update (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_role/v1/update',
    method: 'post',
    data: $qs.stringify(params)
  })
}
export function remove (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_role/v1/delete',
    method: 'post',
    data: $qs.stringify(params)
  })
}

export function getRolePermission (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_role/v1/getFunItemList?' + $qs.stringify(params),
    method: 'get'
  })
}
export function updateRolePerms (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_role/v1/addRoleToFun',
    method: 'post',
    data: $qs.stringify(params)
  })
}
