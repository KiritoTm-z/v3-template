// 示例（可删除，按自己具体项目需求更改）
import { login } from '@/api'
import Cookie from 'js-cookie'
import Crypto from '@/utils/crypto'

interface userInfo {
  username: string
  sex: string
  phoneNumber: string
  avatar_url: string
  roles: string[]
  create_time: string
  update_time: string
}

const useLoginStore = defineStore('LoginStore', {
  state: () => ({
    userInfo: {} as userInfo
  }),

  actions: {
    handleLogin() {
      login({
        username: 'username',
        password: 'password'
      })
        .then(res => {
          // cookie 1天后过期
          Cookie.set('TOKEN', Crypto.encrypt(res.result.token), { expires: 1 })
        })
        .catch(err => err)
    }
  }
})
export default useLoginStore
