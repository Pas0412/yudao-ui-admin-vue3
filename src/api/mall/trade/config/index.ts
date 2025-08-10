import request from '@/config/axios'

export interface ConfigVO {
  brokerageEnabled?: boolean
  brokerageEnabledCondition?: number
  brokerageBindMode?: number
  brokeragePosterUrls?: string
  brokerageFirstPercent?: number
  brokerageSecondPercent?: number
  brokerageWithdrawMinPrice?: number
  brokerageFrozenDays?: number
  brokerageWithdrawTypes?: string
  // 地区代理配置
  areaAgentEnabled?: boolean
  areaAgentEnabledCondition?: number
  areaAgentInviteUserCount?: number
  areaAgentConsumePrice?: number
  areaAgentBindMode?: number
  areaAgentPosterUrls?: string[]
  areaAgentFirstPercent?: number
  areaAgentSecondPercent?: number
  areaAgentWithdrawMinPrice?: number
  areaAgentFrozenDays?: number
  areaAgentWithdrawTypes?: string
}

// 查询交易中心配置详情
export const getTradeConfig = async () => {
  return await request.get({ url: `/trade/config/get` })
}

// 保存交易中心配置
export const saveTradeConfig = async (data: ConfigVO) => {
  return await request.put({ url: `/trade/config/save`, data })
}
