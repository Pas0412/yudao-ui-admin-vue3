import request from '@/config/axios'

export interface AreaAgentUserVO {
  id: number
  bindUserId: number
  bindUserTime: Date
  areaAgentEnabled: boolean
  areaAgentTime: Date
  price: number
  frozenPrice: number
  region: string // 代理地区
  level: number // 代理级别

  nickname: string
  avatar: string
}

// 创建地区代理用户
export const createAreaAgentUser = (data: any) => {
  return request.post({ url: '/trade/area-agent-user/create', data })
}

// 查询地区代理用户列表
export const getAreaAgentUserPage = async (params: any) => {
  return await request.get({ url: `/trade/area-agent-user/page`, params })
}

// 查询地区代理用户详情
export const getAreaAgentUser = async (id: number) => {
  return await request.get({ url: `/trade/area-agent-user/get?id=` + id })
}

// 修改上级地区代理
export const updateBindUser = async (data: any) => {
  return await request.put({ url: `/trade/area-agent-user/update-bind-user`, data })
}

// 清除上级地区代理
export const clearBindUser = async (data: any) => {
  return await request.put({ url: `/trade/area-agent-user/clear-bind-user`, data })
}

// 修改地区代理资格
export const updateAreaAgentEnabled = async (data: any) => {
  return await request.put({ url: `/trade/area-agent-user/update-area-agent-enable`, data })
}