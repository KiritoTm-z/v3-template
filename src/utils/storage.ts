import Crypto from '@/utils/crypto'
/**
 * window.localStorage 本地本地缓存
 * @method set 设置本地缓存
 * @method get 获取本地缓存
 * @method remove 移除本地缓存
 * @method clear 移除全部本地缓存
 */
export interface hasExpireTime {
  value: any
  expireTime?: number
}
export const Local = {
  // 设置本地缓存
  /**
   *
   * @param key 键名
   * @param value 值
   * @param expireTime 过期时间 单位: 秒
   */
  setItem(key: string, value: any, expireTime?: number) {
    if (expireTime) {
      let cache: hasExpireTime = {
        value,
        expireTime: new Date().getTime() + expireTime * 1000
      }
      window.localStorage.setItem(key, Crypto.encrypt(cache))
    } else window.localStorage.setItem(key, Crypto.encrypt(value))
  },
  // 获取本地缓存
  getItem(key: string) {
    let data: any = window.localStorage.getItem(key)
    if (data) {
      const decryptData = Crypto.decrypt(data)
      if (decryptData.expireTime && decryptData.expireTime < new Date().getTime()) {
        window.localStorage.removeItem(key)
        return undefined
      } else return decryptData
    } else return undefined
  },
  // 移除本地缓存
  removeItem(key: string) {
    window.localStorage.removeItem(key)
  },
  // 移除全部本地缓存
  clear() {
    window.localStorage.clear()
  }
}

/**
 * window.sessionStorage 浏览器会话缓存
 * @method set 设置会话缓存
 * @method get 获取会话缓存
 * @method remove 移除会话缓存
 * @method clear 移除全部会话缓存
 */
export const Session = {
  // 设置会话缓存
  setItem(key: string, value: any) {
    window.sessionStorage.setItem(key, Crypto.encrypt(value))
  },
  // 获取会话缓存
  getItem(key: string) {
    const handleData: any = window.sessionStorage.getItem(key)
    const decryptData = Crypto.decrypt(handleData)
    return decryptData
  },
  // 移除会话缓存
  removeItem(key: string) {
    window.sessionStorage.removeItem(key)
  },
  // 移除全部会话缓存
  clear() {
    window.sessionStorage.clear()
  }
}
