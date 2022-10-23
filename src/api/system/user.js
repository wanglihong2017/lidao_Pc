import $qs from 'qs'
import { request } from '../service'
const baseUrl = 'https://mini.lidaokoi.com'
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

// 关键字管理小 keyword
export function getKeywordList (params) {
  return request({
    url: baseUrl + '/luckyfish/keyword/v1/getList?' + $qs.stringify(params),
    method: 'get'
  })
}
// 关键字删除 luckyfish/keyword/v1/delete
export function keyworDelete (params) {
  return request({
    url: baseUrl + '/luckyfish/keyword/v1/delete',
    method: 'post',
    data: $qs.stringify(params)
  })
}
// 关键字添加 luckyfish/keyword/v1/delete
export function keyworAdd (params) {
  return request({
    url: baseUrl + '/luckyfish/keyword/v1/add',
    method: 'post',
    data: $qs.stringify(params)
  })
}
// 鱼友圈管理
export function fishFriendsList (params) {
  return request({
    url: baseUrl + '/luckyfish/manage_user/v1/getList?' + $qs.stringify(params),
    method: 'get'
  })
}
export function fishFriendsupdateType (params) {
  return request({
    url: baseUrl + '/luckyfish/manage_user/v1/updateType',
    method: 'post',
    data: $qs.stringify(params)
  })
}
