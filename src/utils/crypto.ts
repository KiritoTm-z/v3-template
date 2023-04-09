import CryptoJS from 'crypto-js'

const key = CryptoJS.enc.Utf8.parse('sdhio1u2ioeuwajd')
const iv = CryptoJS.enc.Utf8.parse('8g0s7u1w2hjrklhs')

const Crypto = {
  // 加密
  encrypt(data: any) {
    let handleData: any
    if (Object.prototype.toString.call(data) === '[object Object]' || Object.prototype.toString.call(data) === '[object Array]')
      handleData = JSON.stringify(data)
    else handleData = data

    const parseData = CryptoJS.enc.Utf8.parse(handleData)
    const encrypted = CryptoJS.AES.encrypt(parseData, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.ciphertext.toString()
  },

  // 解密
  decrypt(data: any) {
    const encryptedHexData = CryptoJS.enc.Hex.parse(data)
    const getData = CryptoJS.enc.Base64.stringify(encryptedHexData)
    const decrypt = CryptoJS.AES.decrypt(getData, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    try {
      return JSON.parse(decrypt.toString(CryptoJS.enc.Utf8))
    } catch (error) {
      return decrypt.toString(CryptoJS.enc.Utf8)
    }
  }
}

export default Crypto
