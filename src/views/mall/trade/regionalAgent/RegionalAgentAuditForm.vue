<template>
  <Dialog v-model="dialogVisible" title="审核" width="500">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="审核结果" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="2">通过</el-radio>
          <el-radio :label="3">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核备注" prop="auditRemark">
        <el-input v-model="formData.auditRemark" placeholder="请输入审核备注" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as RegionalAgentApi from '@/api/mall/trade/regionalAgent'

defineOptions({ name: 'RegionalAgentAuditForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: undefined,
  status: undefined,
  auditRemark: undefined
})
const formRef = ref() // 表单 Ref
const formRules = reactive({
  status: [{ required: true, message: '审核结果不能为空', trigger: 'change' }],
  auditRemark: [{ required: true, message: '审核备注不能为空', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (row: any) => {
  dialogVisible.value = true
  resetForm()
  formData.value.id = row.id
}
defineExpose({ open })

/** 提交表单 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return

  // 提交请求
  formLoading.value = true
  try {
    await RegionalAgentApi.approveRegionalAgent(formData.value)
    message.success(t('common.auditSuccess'))
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    status: undefined,
    auditRemark: undefined
  }
  formRef.value?.resetFields()
}
</script>