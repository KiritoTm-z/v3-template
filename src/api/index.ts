import type { loginData, userLoginReturn } from '@/interfaces'
import request from '@/plugins/axios'

// 示例
export const login = (data: loginData) => request<userLoginReturn>('/login', 'post', data)
export const refreshToken = () => request<{ access_token: string }>('/auth/refreshToken', 'get')
