import $qs from 'qs'
import { request } from './service'
const baseUrl = process.env.VUE_APP_BASE_API
export function login (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_login/v1/login',
    method: 'post',
    data: $qs.stringify(params)
  })
}
export function getList (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_comment/v1/getManagerList?' + $qs.stringify(params),
    method: 'get'
  })
}
export function remove (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_comment/v1/deleteM',
    method: 'post',
    data: $qs.stringify(params)
  })
}
// 获取token
export function getToken (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_qiniu/v1/getToken?' + $qs.stringify(params),
    method: 'get'
  })
}
// 帖子列表
export function getManagerList (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_fisharticle/v1/getManagerList?' + $qs.stringify(params),
    method: 'get'
  })
}
// 删除帖子
export function deleteM (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_fisharticle/v1/deleteM',
    method: 'post',
    data: $qs.stringify(params)
  })
}
// 帖子置顶
export function updateTop (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_fisharticle/v1/updateTop',
    method: 'post',
    data: $qs.stringify(params)
  })
}
// 修改帖子类型 https://mini.lidaokoi.com/luckyfish/manager_fisharticle/v1/updateType
export function updateType (params) {
  return request({
    url: baseUrl + '/luckyfish/manager_fisharticle/v1/updateType',
    method: 'post',
    data: $qs.stringify(params)
  })
}
