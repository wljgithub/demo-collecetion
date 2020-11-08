import {
  baseUrl,
  deBug
} from '../config'

function get(relativeUrl, param, header) {
  return requestWithModal('GET', relativeUrl, param, header)
}

function post(relativeUrl, param, header) {
  return requestWithModal('POST', relativeUrl, param, header)
}

function put(relativeUrl, param, header) {
  return requestWithModal('PUT', relativeUrl, param, header)
}

function del(relativeUrl, param, header) {
  return requestWithModal('DELETE', relativeUrl, param, header)
}

function requestWithModal(method, relativeUrl, param, header) {
  return request(method, relativeUrl, param, header).catch(err => {
    let errMsg = err && err.message ? err.message : '发生未知错误，请联系开发者'
    wx.showModal({
      showCancel: false,
      content: errMsg
    })
    return Promise.reject(err)
  })
}

function request(method, relativeUrl, param, header) {
  for ( let index in param) {
    if (!param[index]) {
      delete param[index]
    }
  }

  let response, error
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + relativeUrl,
      method: method,
      header: Object.assign({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '
      }, header),
      data: param || {},
      success: function (res) {
        if (res.data.code === 0) {
          response = res.data
          resolve(response)
        } else {
          error = res.data
          reject(error)
        }
      },
      fail: function (err) {
        error = err
        error.message = err
        reject(error)
      },
      complete: function () {
        if (!deBug) {
          return
        }
        console.info('==========>请求开始<==========')
        console.warn(method, baseUrl + relativeUrl)
        if (param) console.warn('参数：' + param)
        if (response) {
          console.warn('请求成功', response)
        } else {
          console.warn('请求失败', error)
        }
        console.info('==========>请求结束<==========')
      }
    })
  })
}
export {
  get,
  post,
  put,
  del
}