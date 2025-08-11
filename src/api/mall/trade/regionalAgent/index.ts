import request from '@/config/axios'

// 地区代理 VO
export interface RegionalAgentVO {
  id: number
  userId: number
  userNickname: string
  areaId: number
  areaType: number
  areaName: string
  status: number
  auditRemark: string
  createTime: Date
}

// 地区代理提现 VO
export interface RegionalAgentWithdrawVO {
  id: number
  userId: number
  userNickname: string
  price: number
  type: number
  status: number
  auditReason: string
  createTime: Date
}

// 地区代理佣金记录 VO
export interface RegionalAgentRecordVO {
  id: number
  userId: number
  userNickname: string
  bizId: number
  bizType: number
  price: number
  title: string
  description: string
  status: number
  createTime: Date
}

// 地区代理管理
export const createRegionalAgent = (data: RegionalAgentVO) => {
  return request.post({ url: '/product/regional-agent/create', data })
}

export const updateRegionalAgent = (data: RegionalAgentVO) => {
  return request.put({ url: '/product/regional-agent/update', data })
}

export const deleteRegionalAgent = (id: number) => {
  return request.delete({ url: '/product/regional-agent/delete?id=' + id })
}

export const approveRegionalAgent = (data: { id: number; status: number; auditRemark: string }) => {
  return request.put({ url: '/product/regional-agent/approve', data })
}

export const getRegionalAgent = (id: number) => {
  return request.get({ url: '/product/regional-agent/get?id=' + id })
}

export const getRegionalAgentPage = (params: any) => {
  return request.get({ url: '/product/regional-agent/page', params })
}

export const exportRegionalAgent = (params: any) => {
  return request.get({ url: '/product/regional-agent/export', params })
}

// 地区代理提现管理
export const approveRegionalAgentWithdraw = (data: { id: number; status: number; auditReason: string }) => {
  return request.put({ url: '/product/regional-agent-withdraw/approve', data })
}

export const rejectRegionalAgentWithdraw = (id: number, auditReason: string) => {
  return request.put({ url: '/product/regional-agent-withdraw/reject', data: { id, auditReason } })
}

export const getRegionalAgentWithdrawPage = (params: any) => {
  return request.get({ url: '/product/regional-agent-withdraw/page', params })
}

// 地区代理佣金记录管理
export const getRegionalAgentRecord = (id: number) => {
  return request.get({ url: '/product/regional-agent-record/get?id=' + id })
}

export const getRegionalAgentRecordPage = (params: any) => {
  return request.get({ url: '/product/regional-agent-record/page', params })
}

export const exportRegionalAgentRecord = (params: any) => {
  return request.get({ url: '/product/regional-agent-record/export', params })
}