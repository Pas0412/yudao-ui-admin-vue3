<template>
  <Dialog v-model="dialogVisible" title="拒绝提现" width="400px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="拒绝原因" prop="auditReason">
        <el-input
          v-model="formData.auditReason"
          :rows="3"
          placeholder="请输入拒绝原因"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" :loading="formLoading" type="primary" @click="submitForm">
        确 定
      </el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as RegionalAgentApi from '@/api/mall/trade/regionalAgent'

defineOptions({ name: 'RegionalAgentWithdrawRejectForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: undefined,
  auditReason: ''
})
const formRules = reactive({
  auditReason: [{ required: true, message: '拒绝原因不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (row: any) => {
  dialogVisible.value = true
  resetForm()
  formData.value.id = row.id
}

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
    await RegionalAgentApi.rejectRegionalAgentWithdraw(formData.value.id, formData.value.auditReason)
    message.success('拒绝成功')
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
    auditReason: ''
  }
  formRef.value?.resetFields()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>