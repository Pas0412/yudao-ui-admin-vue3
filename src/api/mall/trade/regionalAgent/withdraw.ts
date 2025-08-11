import request from '@/config/axios'

export interface RegionalAgentWithdrawVO {
  id: number
  agentId: number
  userId: number
  type: number
  name: string
  accountNo: string
  bankName: string
  price: number
  feePrice: number
  totalPrice: number
  status: number
  auditReason: string
  auditTime: Date
  createTime: Date
  // 扩展信息
  nickname?: string
  avatar?: string
  provinceName?: string
  cityName?: string
  areaName?: string
}

export interface RegionalAgentWithdrawPageReqVO {
  pageNo: number
  pageSize: number
  agentId?: number
  userId?: number
  type?: number
  name?: string
  accountNo?: string
  bankName?: string
  status?: number
  createTime?: Date[]
}

export interface RegionalAgentWithdrawApproveReqVO {
  id: number
  status: number
  auditReason?: string
}

// 审核地区代理提现申请
export const approveRegionalAgentWithdraw = async (data: RegionalAgentWithdrawApproveReqVO) => {
  return await request.put({ url: `/product/regional-agent-withdraw/approve`, data })
}

// 查询地区代理提现申请分页列表
export const getRegionalAgentWithdrawPage = async (params: RegionalAgentWithdrawPageReqVO) => {
  return await request.get({ url: `/product/regional-agent-withdraw/page`, params })
}