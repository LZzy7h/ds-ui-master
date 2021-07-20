import axios from 'axios'
import { Notification, MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken,removeToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { tansParams } from "@/utils/ruoyi";
import router from '../router'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 10000
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?';
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName];
      var part = encodeURIComponent(propName) + "=";
      if (value !== null && typeof(value) !== "undefined") {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + "=";
            url += subPart + encodeURIComponent(value[key]) + "&";
          }
        } else {
          url += part + encodeURIComponent(value) + "&";
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  // config.headers['login-token'] = getToken()

  return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    // const msg = errorCode[code] || res.data.msg || errorCode['default']
    let msg = '';
    if (errorCode[code]) {
      msg = errorCode[code];
    } else if (res.data.msg) {
      msg = res.data.msg
    } else if (code != 200) {
      msg = code.split(":")[0];
    } else {
      msg = errorCode['default'];
    }
    if (code === 401) {
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
        cancelButtonClass: "btn-custom-cancel",
        cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      })
    } else if (code === 500) {
      if ( res.data.msg == '登录状态已过期') {
        removeToken()
        router.push({
          path:'/login',
        })
      } else if (msg == '用户名或密码错误'
        || msg == '验证码错误'
        || msg == '用户不存在/密码错误'
        || msg == '用户/密码必须填写'
        || msg == '用户名不在指定范围'
        || msg == '用户密码不在指定范围'
        || msg == '验证码已失效'
        || msg == '验证码不能为空'
        || msg == '未获取到有效的角色，请联系管理员解决'){
        let errorNum = 0
        let num =  window.localStorage.getItem('errorNum') || undefined
        if (num) {
          errorNum = Number(num) + 1
        } else {
          errorNum = 1
        }
        window.localStorage.setItem('errorNum', errorNum)
        Message({
          message: msg,
          type: 'error'
        })
      } else {
        Message({
          message: msg,
          type: 'error'
        })
        return Promise.reject(new Error(msg))
      }
    } else if (code !== 200) {
      Notification.error({
        title: msg
      })
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    }
    else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    }
    else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 通用下载方法
export function download(url, params, filename, method) {
  return service[method || "post"](url, params, {
    transformRequest: [(params) => {
      return tansParams(params)
    }],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    responseType: 'blob'
  }).then((data, header) => {
    const content = data
    const blob = new Blob([content])
    if ('download' in document.createElement('a')) {
      const elink = document.createElement('a')
      elink.download = filename
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    } else {
      navigator.msSaveBlob(blob, filename)
    }
  }).catch((r) => {
    console.error(r)
  })
}

export default service
