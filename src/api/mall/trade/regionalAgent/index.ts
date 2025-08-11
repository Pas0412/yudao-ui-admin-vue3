import request from '@/config/axios'

export interface RegionalAgentVO {
  id: number
  userId: number
  areaId: number
  areaType: number
  areaName: string
  status: number
  applyTime: Date
  auditTime: Date
  auditRemark: string
  // 用户信息
  nickname?: string
  avatar?: string
  // 地区信息
  provinceName?: string
  cityName?: string
}

export interface RegionalAgentPageReqVO {
  pageNo: number
  pageSize: number
  userId?: number
  areaId?: number
  areaType?: number
  areaName?: string
  status?: number
  applyTime?: Date[]
  auditTime?: Date[]
}

export interface RegionalAgentCreateReqVO {
  userId: number
  areaId: number
  areaType: number
  areaName: string
  auditRemark?: string
}

export interface RegionalAgentUpdateReqVO {
  id: number
  areaId: number
  areaType: number
  areaName: string
  auditRemark?: string
}

export interface RegionalAgentApproveReqVO {
  id: number
  status: number
  auditRemark?: string
}



// 创建地区代理
export const createRegionalAgent = async (data: RegionalAgentCreateReqVO) => {
  return await request.post({ url: `/product/regional-agent/create`, data })
}

// 更新地区代理
export const updateRegionalAgent = async (data: RegionalAgentUpdateReqVO) => {
  return await request.put({ url: `/product/regional-agent/update`, data })
}

// 删除地区代理
export const deleteRegionalAgent = async (id: number) => {
  return await request.delete({ url: `/product/regional-agent/delete?id=` + id })
}

// 审核地区代理申请
export const approveRegionalAgent = async (data: RegionalAgentApproveReqVO) => {
  return await request.put({ url: `/product/regional-agent/approve`, data })
}

// 查询地区代理详情
export const getRegionalAgent = async (id: number) => {
  return await request.get({ url: `/product/regional-agent/get?id=` + id })
}

// 查询地区代理分页列表
export const getRegionalAgentPage = async (params: RegionalAgentPageReqVO) => {
  return await request.get({ url: `/product/regional-agent/page`, params })
}

// 导出地区代理
export const exportRegionalAgent = async (params: RegionalAgentPageReqVO) => {
  return await request.download({ url: `/product/regional-agent/export`, params })
}