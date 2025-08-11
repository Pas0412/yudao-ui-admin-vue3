<template>
  <Dialog v-model="dialogVisible" title="编辑代理信息" width="600px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <el-form-item label="用户信息">
        <div class="flex items-center">
          <el-avatar :src="formData.avatar" class="mr-2" />
          <div>
            <div>编号：{{ formData.userId }}</div>
            <div>昵称：{{ formData.nickname }}</div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="地区类型" prop="areaType">
        <el-select v-model="formData.areaType" placeholder="请选择地区类型">
          <el-option label="省份" :value="1" />
          <el-option label="城市" :value="2" />
          <el-option label="区县" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="代理区域" prop="areaId">
        <el-cascader
          v-model="areaIds"
          :options="areaList"
          :props="{ value: 'id', label: 'name', children: 'children', emitPath: false, checkStrictly: true }"
          placeholder="请选择代理区域"
          clearable
          filterable
          @change="handleAreaChange"
        />
      </el-form-item>
      <el-form-item label="审核备注" prop="auditRemark">
        <el-input
          v-model="formData.auditRemark"
          :rows="3"
          placeholder="请输入审核备注"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" :loading="formLoading" type="primary">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as RegionalAgentApi from '@/api/mall/trade/regionalAgent'
import * as AreaApi from '@/api/system/area'
import { AreaAgentLevelEnum } from '@/utils/constants'

defineOptions({ name: 'RegionalAgentEditDialog' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中
const formData = ref({
  id: undefined,
  userId: undefined,
  nickname: '',
  avatar: '',
  areaId: undefined,
  areaType: undefined,
  areaName: '',
  auditRemark: ''
})
const formRules = reactive({
  areaType: [{ required: true, message: '地区类型不能为空', trigger: 'change' }],
  areaId: [{ required: true, message: '代理区域不能为空', trigger: 'change' }],
  areaName: [{ required: true, message: '地区名称不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const areaList = ref([]) // 地区列表
const areaIds = ref([]) // 选中的地区 ID 数组

/** 打开弹窗 */
const open = async (id?: number) => {
  dialogVisible.value = true
  resetForm()
  // 获取地区数据
  await getAreaList()
  if (id) {
    formLoading.value = true
    try {
      const data = await RegionalAgentApi.getRegionalAgent(id)
      formData.value = data
      // 设置地区选择器的值
      if (data.areaId) {
        areaIds.value = [data.areaId]
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    await RegionalAgentApi.updateRegionalAgent(formData.value)
    message.success('更新成功')
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    userId: undefined,
    nickname: '',
    avatar: '',
    areaId: undefined,
    areaType: undefined,
    areaName: '',
    auditRemark: ''
  }
  areaIds.value = []
  formRef.value?.resetFields()
}

/** 获取地区列表 */
const getAreaList = async () => {
  areaList.value = await AreaApi.getAreaTree()
}

/** 处理地区变化 */
const handleAreaChange = (value: number) => {
  if (!value) {
    formData.value.areaId = undefined
    formData.value.areaName = ''
    formData.value.areaType = undefined
    return
  }
  
  // 根据选中的地区ID，查找对应的地区信息
  const findAreaInfo = (areas: any[], targetId: number, level: number = 1): any => {
    for (const area of areas) {
      if (area.id === targetId) {
        return { area, level }
      }
      if (area.children && area.children.length > 0) {
        const result = findAreaInfo(area.children, targetId, level + 1)
        if (result) {
          return result
        }
      }
    }
    return null
  }
  
  const result = findAreaInfo(areaList.value, value)
  if (result) {
    const { area, level } = result
    formData.value.areaId = area.id
    formData.value.areaName = area.name
    formData.value.areaType = level
  }
}
</script>