import request from '@/config/axios'

export interface RegionalAgentRecordVO {
  id: number
  agentId: number
  userId: number
  bizType: number
  status: number
  agentLevel: number
  provinceId: number
  cityId: number
  areaId: number
  price: number
  createTime: Date
  // 扩展信息
  nickname?: string
  avatar?: string
  provinceName?: string
  cityName?: string
  areaName?: string
}

export interface RegionalAgentRecordPageReqVO {
  pageNo: number
  pageSize: number
  agentId?: number
  userId?: number
  bizType?: number
  status?: number
  agentLevel?: number
  provinceId?: number
  cityId?: number
  areaId?: number
  createTime?: Date[]
}

// 查询地区代理佣金记录详情
export const getRegionalAgentRecord = async (id: number) => {
  return await request.get({ url: `/product/regional-agent-record/get?id=` + id })
}

// 查询地区代理佣金记录分页列表
export const getRegionalAgentRecordPage = async (params: RegionalAgentRecordPageReqVO) => {
  return await request.get({ url: `/product/regional-agent-record/page`, params })
}

// 导出地区代理佣金记录
export const exportRegionalAgentRecord = async (params: RegionalAgentRecordPageReqVO) => {
  return await request.download({ url: `/product/regional-agent-record/export`, params })
}