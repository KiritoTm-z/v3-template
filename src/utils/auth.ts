import { Local } from './storage'

const ACCESS_TOKEN_KEY = 'access_token'

export const getAccessToken = () => Local.getItem(ACCESS_TOKEN_KEY) ?? null

export const setAccessToken = (token: string) => {
  Local.setItem(ACCESS_TOKEN_KEY, token)
}