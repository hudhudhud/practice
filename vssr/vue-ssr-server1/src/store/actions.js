import axios from 'axios'

function fetch (url, Data, method = 'GET') {
  const data = method === 'POST' ? Data : {}
  const params = method === 'GET' ? Data : {}
  return new Promise((resolve, reject) => {
    console.log(url)
    axios({
      url: url,
      data,
      params,
      method,
      responseType: 'json'
    })
      .then((result) => {
        const res = result.data
        if (res.errno === 0 || !res.errno) {
          resolve(res.data)
        } else {
          reject(res.errmsg || '操作失败')
        }
      })
      .catch((e) => {
        reject(new Error(e))
      })
  })
}

export default {
  getList ({ commit, state }) {
    return fetch('http://47.96.13.204:3000/api/getlist').then(res => {
      commit('GET_LIST', res)
      return res
    })
  },
  getUsers ({ commit, state }) {
    return fetch('https://reqres.in/api/users?page=1&per_page=20').then(res => {
      commit('GET_USERS', res)
      return res
    })
  },
  getUnkonw ({ commit, state }) {
    return fetch('https://reqres.in/api/unknown?per_page=100').then(res => {
      commit('GET_UNKNOW', res)
      return res
    })
  },
  getNav ({ commit, state }) {
    console.log('get nav')
    return fetch('http://47.96.13.204:3000/api/getnav').then(res => {
      commit('GET_NAV', res)
      return res
    })
  }
}
