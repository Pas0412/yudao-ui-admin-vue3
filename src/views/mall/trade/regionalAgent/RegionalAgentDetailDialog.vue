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
      <el-descriptions-item label="地区类型">
        <el-tag v-if="formData.areaType === 1" type="danger">
          省
        </el-tag>
        <el-tag v-else-if="formData.areaType === 2" type="warning">
          市
        </el-tag>
        <el-tag v-else-if="formData.areaType === 3" type="info">
          区/县
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="代理区域">
        {{ formData.areaName }}
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
        <el-tag v-if="formData.status === 1" type="warning">
          待审核
        </el-tag>
        <el-tag v-else-if="formData.status === 2" type="success">
          已通过
        </el-tag>
        <el-tag v-else-if="formData.status === 3" type="danger">
          已拒绝
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="审核时间">
        {{ formatDate(formData.auditTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="审核备注" :span="2">
        {{ formData.auditRemark || '-' }}
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