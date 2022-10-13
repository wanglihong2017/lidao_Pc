import { getToken } from '../api/api'
export function getTokens () {
  getToken().then((res) => {
    console.log('wwwqq', res)
  })
}
