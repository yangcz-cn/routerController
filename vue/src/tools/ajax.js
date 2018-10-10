import Interface from '../interface/allInterface'
import axios from 'axios'

let cancel, promiseArr = {}
const CancelToken = axios.CancelToken;
//请求拦截器
axios.interceptors.request.use(config => {
  //发起请求时，取消掉当前正在进行的相同请求
  if (promiseArr[config.url]) {
    promiseArr[config.url]('操作取消')
    promiseArr[config.url] = cancel
  } else {
    promiseArr[config.url] = cancel
  }
  return config
}, error => {
  return Promise.reject(error)
})

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
  return response
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '错误请求'
        break;
      case 401:
        err.message = '未授权，请重新登录'
        break;
      case 403:
        err.message = '拒绝访问'
        break;
      case 404:
        err.message = '请求错误,未找到该资源'
        break;
      case 405:
        err.message = '请求方法未允许'
        break;
      case 408:
        err.message = '请求超时'
        break;
      case 500:
        err.message = '服务器端出错'
        break;
      case 501:
        err.message = '网络未实现'
        break;
      case 502:
        err.message = '网络错误'
        break;
      case 503:
        err.message = '服务不可用'
        break;
      case 504:
        err.message = '网络超时'
        break;
      case 505:
        err.message = 'http版本不支持该请求'
        break;
      default:
        err.message = `连接错误${err.response.status}`
    }
  } else {
    return Promise.reject({ status: status, message: err.message })
  }
  return Promise.reject({ status: err.response.status, message: err.message })
})

// axios.defaults.baseURL = '/api'
//设置默认请求头
// axios.defaults.headers = {
//   'X-Requested-With': 'XMLHttpRequest'
// }
axios.defaults.timeout = 10000

export default {

  ajax(url, params, callback) {
    let interfaceInfo = Interface[url];
    let obj = {
      method: interfaceInfo.method || 'get',
      url: interfaceInfo.url,
      data: params || {},
      cancelToken: new CancelToken(c => {
        cancel = c
      })
    };
    if (!!interfaceInfo.responseType) {
      obj.responseType = interfaceInfo.responseType;
      axios(obj).then(res => {
        callback({ success: true, data: res.data })
      }).catch((res) => {
        callback({ success: false, message: '异常信息：' + res.message + '，异常编码：' + res.status });
      })
    }
    else {
      axios(obj).then(res => {
        // switch (res.data.code) {
        //   case 200: callback({ success: true, data: res.data }); break;
        //   case 400: callback({ success: false, message: res.data.msg || res.data.message || "未知错误，错误编码：400", code: res.data.code }); break;
        //   default: callback({ success: false, message: "错误请求，错误编码:" + res.data.code, code: res.data.code }); break;
        // }
        callback(res.data);
      }).catch(res => {
        callback({ success: false, message: '异常信息：' + res.message + '，异常编码：' + res.status });
      })
    }
  }
}