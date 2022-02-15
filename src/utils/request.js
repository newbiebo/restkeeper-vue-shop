import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import { getStoreToken} from '@/utils/storeToken'
import { logout } from '@/api/user'
import { resetRouter } from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (getToken()) {
      config.headers['jwtToken'] = getToken();
      console.log('jwtToken设置头部传递：' + config.headers['jwtToken'])
    }
    if (getStoreToken()) {
      config.headers['storeToken'] = getStoreToken();
      console.log('storeToken设置头部传递:' + config.headers['storeToken'])
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    console.log(response)
    const res = response.data
    console.log(res.code)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== '200') {
      if (res.code === '1007') {
        MessageBox.confirm('超时，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeToken()
          resetRouter()
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      } else if (res.code === '1004') {
        logout().then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      } else {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.message || 'Error'))
      }
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: '请求出错，请联系管理员!',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
