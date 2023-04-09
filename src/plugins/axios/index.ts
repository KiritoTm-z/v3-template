import axios, { type AxiosInstance, type Method, type AxiosRequestConfig, type ResponseType } from 'axios'
import { getAccessToken, setAccessToken } from '@/utils/auth'
import { handleNetworkError, handleAuthError } from './handleError'
import { refreshToken } from '@/api'
// 请求/响应 加解密
// import Crypto from '@/utils/crypto'

// 根据具体情况修改
export interface HttpResponse<T = any> {
  statusCode: number
  message: string
  successFlag: boolean
  result: T
}

// 是否正在刷新 token
let isRefreshing: boolean = false

// 存储待重发的请求
let requestsQueue: ((token: string) => any)[] = []

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_PREFIX,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000
})

http.interceptors.request.use(
  config => {
    // 根据具体情况修改
    config.headers['authorization'] = `Bearer ${getAccessToken()}`
    return config
  }, err => {
    return Promise.reject(err)
  }
)

http.interceptors.response.use(
  res => {
    if (res.data.statusCode === 200 || res.data.statusCode === 201) return res;

    if(res.data.statusCode === 401 && !res.config.url?.includes('/auth/refreshToken')) {
      const { config } = res
      if(!isRefreshing) {
        isRefreshing = true
        return refreshToken().then(async rftRes => {
          const { access_token } = rftRes.result
          setAccessToken(access_token)
          config.headers['authorization'] = `Bearer ${access_token}`
          // 重新请求一下第一个 401 的接口
          const firstReqRes = await http.request(config)
          // token 刷新后将数组的方法重新执行
          requestsQueue.forEach((cb: any) => cb(access_token))
          // 队列中的请求执行完毕后，清空数组
          requestsQueue = []
          return firstReqRes
        }).catch(rftErr => {
          // 参数依据接口返回状态码字段
          handleNetworkError(res.data.statusCode)
          return Promise.reject(rftErr)
        }).finally(() => {
          isRefreshing = false
        })
      } else {
        // 如果正在 refreshToken

        // 如果有多个请求同时发起，第一个请求 401 了，refreshToken 又正在进行中
        // 那么把第一个以外的请求暂存起来
        return new Promise(resolve => {
          // 用函数形式将 resolve 存入，等待 refreshToken 完成后再执行
          requestsQueue.push((token: string) => {
              config.headers['authorization'] = `Bearer ${token}`
              resolve(http.request(config))
          })
        })
      }
    }

    handleAuthError(res.data.statusCode)
    return Promise.reject(res.data);
  }, err => {
    if(!err.response) return Promise.reject(err);
    return Promise.reject(err)
  }
)

/**
 * @description 泛型 T 代表接口返回数据的类型； 泛型 D 代表参数的类型
 * @param url 请求路径
 * @param method 请求方式
 * @param data 请求参数
 * @param responseType 响应中的数据类型
 * @returns 接口返回值
 */
export default async function request<T, D = any>(
  url: string,
  method: Method,
  data?: D | undefined,
  responseType?: ResponseType | undefined
): Promise<HttpResponse<T>> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await http.request({
        url,
        method,
        [method.toLowerCase() === 'get' ? 'params' : 'data']: data,
        responseType
      } as AxiosRequestConfig)
      resolve(response.data)
    } catch (error) {
      reject(error)
    }
  })
}
