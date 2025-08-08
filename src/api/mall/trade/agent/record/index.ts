import request from '@/config/axios'

// 查询地区代理佣金记录列表
export const getAreaAgentRecordPage = async (params: any) => {
  return await request.get({ url: `/trade/area-agent-record/page`, params })
}

// 查询地区代理佣金记录详情
export const getAreaAgentRecord = async (id: number) => {
  return await request.get({ url: `/trade/area-agent-record/get?id=` + id })
}