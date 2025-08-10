<template>
  <Dialog v-model="dialogVisible" title="提现申请详情" width="800px">
    <el-descriptions v-loading="loading" :column="2" border>
      <el-descriptions-item label="提现编号">
        {{ formData.id }}
      </el-descriptions-item>
      <el-descriptions-item label="代理编号">
        {{ formData.agentId }}
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
      <el-descriptions-item label="提现金额">
        <span class="text-red-500 font-bold text-lg">{{ fenToYuan(formData.price || 0) }}元</span>
      </el-descriptions-item>
      <el-descriptions-item label="提现方式">
        <dict-tag :type="DICT_TYPE.AREA_AGENT_WITHDRAW_TYPE" :value="formData.type" />
      </el-descriptions-item>
      <el-descriptions-item label="真实姓名">
        {{ formData.name }}
      </el-descriptions-item>
      <el-descriptions-item label="账号">
        {{ formData.accountNo }}
      </el-descriptions-item>
      <el-descriptions-item label="银行名称" :span="2">
        {{ formData.bankName || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="收款码" :span="2" v-if="formData.accountQrCodeUrl">
        <el-image
          :src="formData.accountQrCodeUrl"
          :preview-src-list="[formData.accountQrCodeUrl]"
          class="w-20 h-20"
          fit="cover"
        />
      </el-descriptions-item>
      <el-descriptions-item label="申请时间">
        {{ formatDate(formData.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="提现状态">
        <dict-tag :type="DICT_TYPE.AREA_AGENT_WITHDRAW_STATUS" :value="formData.status" />
      </el-descriptions-item>
      <el-descriptions-item label="审核时间">
        {{ formatDate(formData.auditTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="审核人">
        {{ formData.auditUser || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="审核原因" :span="2">
        {{ formData.auditReason || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="备注" :span="2">
        {{ formData.remark || '-' }}
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
import * as RegionalAgentWithdrawApi from '@/api/mall/trade/regionalAgent/withdraw'
import { DICT_TYPE } from '@/utils/dict'

defineOptions({ name: 'RegionalAgentWithdrawDetailDialog' })

const dialogVisible = ref(false) // 弹窗的是否展示
const loading = ref(false) // 表单的加载中
const formData = ref<RegionalAgentWithdrawApi.RegionalAgentWithdrawVO>({})

/** 打开弹窗 */
const open = async (id: number) => {
  dialogVisible.value = true
  loading.value = true
  try {
    formData.value = await RegionalAgentWithdrawApi.getRegionalAgentWithdraw(id)
  } finally {
    loading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>