import axios from "axios";
export function request(config) {

  const instance = axios.create({
    baseURL: '/api', // 通过/api别名指定后端路由
    timeout: 5000,
    headers: {
    },
  })

  // axios的拦截器(类似python的中间件的request)
  instance.interceptors.request.use(config => {
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 多用于登录时的cookies判断
    return config
  }, err => {
    console.log(err);
  })
  // 数据返回拦截
  instance.interceptors.response.use(aaa => {
    // 多用于登录时的cookies判断
    return aaa.data
  }, err => {
    console.log(err);
  })
  // 直接返回
  return instance(config)

}

// axios.defaults.withCredentials = true
// const request = axios.create({
//   baseURL: 'http://127.0.0.1:8888/api/private/v1/'
// })

// export default request
