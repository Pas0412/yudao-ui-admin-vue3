import request from '@/config/axios'

export interface RegionalAgentVO {
  id: number
  userId: number
  provinceId: number
  cityId: number
  areaId: number
  agentLevel: number
  status: number
  applyTime: Date
  auditTime: Date
  auditReason: string
  // 用户信息
  nickname?: string
  avatar?: string
  // 地区信息
  provinceName?: string
  cityName?: string
  areaName?: string
}

export interface RegionalAgentPageReqVO {
  pageNo: number
  pageSize: number
  userId?: number
  provinceId?: number
  cityId?: number
  areaId?: number
  agentLevel?: number
  status?: number
  applyTime?: Date[]
  auditTime?: Date[]
}

export interface RegionalAgentAuditReqVO {
  id: number
  auditStatus: number
  auditReason?: string
}

export interface RegionalAgentUpdateStatusReqVO {
  id: number
  status: number
}

// 查询地区代理分页列表
export const getRegionalAgentPage = async (params: RegionalAgentPageReqVO) => {
  return await request.get({ url: `/trade/regional-agent/page`, params })
}

// 查询地区代理详情
export const getRegionalAgent = async (id: number) => {
  return await request.get({ url: `/trade/regional-agent/get?id=` + id })
}

// 审核地区代理
export const auditRegionalAgent = async (data: RegionalAgentAuditReqVO) => {
  return await request.put({ url: `/trade/regional-agent/audit`, data })
}

// 更新地区代理状态
export const updateRegionalAgentStatus = async (data: RegionalAgentUpdateStatusReqVO) => {
  return await request.put({ url: `/trade/regional-agent/update-status`, data })
}

// 更新地区代理
export const updateRegionalAgent = async (data: RegionalAgentVO) => {
  return await request.put({ url: '/trade/regional-agent/update', data })
}

// 删除地区代理
export const deleteRegionalAgent = async (id: number) => {
  return await request.delete({ url: `/trade/regional-agent/delete?id=` + id })
}