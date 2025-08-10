<template>
  <Dialog v-model="dialogVisible" title="地区代理详情" width="800px">
    <el-descriptions v-loading="loading" :column="2" border>
      <el-descriptions-item label="代理编号">
        {{ formData.id }}
      </el-descriptions-item>
      <el-descriptions-item label="用户编号">
        {{ formData.userId }}
      </el-descriptions-item>
      <el-descriptions-item label="用户昵称">
        <div class="flex items-center">
          <el-avatar :src="formData.avatar" class="mr-2" size="small" />
          {{ formData.nickname }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="真实姓名">
        {{ formData.realName }}
      </el-descriptions-item>
      <el-descriptions-item label="手机号码">
        {{ formData.mobile }}
      </el-descriptions-item>
      <el-descriptions-item label="代理级别">
        <el-tag v-if="formData.agentLevel === AreaAgentLevelEnum.PROVINCE.level" type="danger">
          {{ AreaAgentLevelEnum.PROVINCE.name }}
        </el-tag>
        <el-tag v-else-if="formData.agentLevel === AreaAgentLevelEnum.CITY.level" type="warning">
          {{ AreaAgentLevelEnum.CITY.name }}
        </el-tag>
        <el-tag v-else-if="formData.agentLevel === AreaAgentLevelEnum.AREA.level" type="info">
          {{ AreaAgentLevelEnum.AREA.name }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="代理区域" :span="2">
        <div>
          <span v-if="formData.provinceName">{{ formData.provinceName }}</span>
          <span v-if="formData.cityName"> / {{ formData.cityName }}</span>
          <span v-if="formData.areaName"> / {{ formData.areaName }}</span>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="总佣金">
        {{ fenToYuan(formData.totalBrokerage || 0) }}元
      </el-descriptions-item>
      <el-descriptions-item label="可提现金额">
        {{ fenToYuan(formData.settlementPrice || 0) }}元
      </el-descriptions-item>
      <el-descriptions-item label="已提现金额">
        {{ fenToYuan(formData.brokeragePrice || 0) }}元
      </el-descriptions-item>
      <el-descriptions-item label="冻结中佣金">
        {{ fenToYuan(formData.frozenPrice || 0) }}元
      </el-descriptions-item>
      <el-descriptions-item label="申请时间">
        {{ formatDate(formData.applyTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="代理状态">
        <el-tag v-if="formData.status === AreaAgentApplyStatusEnum.AUDITING.status" type="warning">
          {{ AreaAgentApplyStatusEnum.AUDITING.name }}
        </el-tag>
        <el-tag v-else-if="formData.status === AreaAgentApplyStatusEnum.APPROVED.status" type="success">
          {{ AreaAgentApplyStatusEnum.APPROVED.name }}
        </el-tag>
        <el-tag v-else-if="formData.status === AreaAgentApplyStatusEnum.REJECTED.status" type="danger">
          {{ AreaAgentApplyStatusEnum.REJECTED.name }}
        </el-tag>
        <el-tag v-else-if="formData.status === AreaAgentApplyStatusEnum.DISABLED.status" type="info">
          {{ AreaAgentApplyStatusEnum.DISABLED.name }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="审核时间">
        {{ formatDate(formData.auditTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="审核原因" :span="2">
        {{ formData.auditReason || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="申请说明" :span="2">
        {{ formData.applyReason || '-' }}
      </el-descriptions-item>
    </el-descriptions>
    
    <template #footer>
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import { fenToYuan } from '@/utils'
import * as RegionalAgentApi from '@/api/mall/trade/regionalAgent'
import { AreaAgentApplyStatusEnum, AreaAgentLevelEnum } from '@/utils/constants'

defineOptions({ name: 'RegionalAgentDetailDialog' })

const dialogVisible = ref(false) // 弹窗的是否展示
const loading = ref(false) // 表单的加载中
const formData = ref<RegionalAgentApi.RegionalAgentVO>({})

/** 打开弹窗 */
const open = async (id: number) => {
  dialogVisible.value = true
  loading.value = true
  try {
    formData.value = await RegionalAgentApi.getRegionalAgent(id)
  } finally {
    loading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>