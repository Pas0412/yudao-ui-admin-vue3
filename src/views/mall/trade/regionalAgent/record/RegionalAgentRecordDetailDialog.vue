<template>
  <Dialog v-model="dialogVisible" title="佣金记录详情" width="600px">
    <el-descriptions v-loading="loading" :column="2" border>
      <el-descriptions-item label="记录编号">
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
      <el-descriptions-item label="代理区域">
        <div>
          <span v-if="formData.provinceName">{{ formData.provinceName }}</span>
          <span v-if="formData.cityName"> / {{ formData.cityName }}</span>
          <span v-if="formData.areaName"> / {{ formData.areaName }}</span>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="业务类型">
        <dict-tag :type="DICT_TYPE.AREA_AGENT_RECORD_BIZ_TYPE" :value="formData.bizType" />
      </el-descriptions-item>
      <el-descriptions-item label="佣金金额">
        <span class="text-green-500 font-bold">+{{ fenToYuan(formData.price || 0) }}元</span>
      </el-descriptions-item>
      <el-descriptions-item label="业务编号">
        {{ formData.bizId }}
      </el-descriptions-item>
      <el-descriptions-item label="佣金状态">
        <dict-tag :type="DICT_TYPE.AREA_AGENT_RECORD_STATUS" :value="formData.status" />
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ formatDate(formData.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="更新时间">
        {{ formatDate(formData.updateTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="备注" :span="2">
        {{ formData.description || '-' }}
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
import * as RegionalAgentRecordApi from '@/api/mall/trade/regionalAgent/record'
import { DICT_TYPE } from '@/utils/dict'
import { AreaAgentLevelEnum } from '@/utils/constants'

defineOptions({ name: 'RegionalAgentRecordDetailDialog' })

const dialogVisible = ref(false) // 弹窗的是否展示
const loading = ref(false) // 表单的加载中
const formData = ref<RegionalAgentRecordApi.RegionalAgentRecordVO>({})

/** 打开弹窗 */
const open = async (id: number) => {
  dialogVisible.value = true
  loading.value = true
  try {
    formData.value = await RegionalAgentRecordApi.getRegionalAgentRecord(id)
  } finally {
    loading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>