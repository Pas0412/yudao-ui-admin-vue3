<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="审核状态">
        <el-tag v-if="formData.auditStatus === 20" type="success">
          审核通过
        </el-tag>
        <el-tag v-else-if="formData.auditStatus === 30" type="danger">
          审核拒绝
        </el-tag>
      </el-form-item>
      <el-form-item label="审核原因" prop="auditReason">
        <el-input
          v-model="formData.auditReason"
          :placeholder="formData.auditStatus === 30 ? '请输入拒绝原因' : '请输入审核原因'"
          :rows="3"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :loading="formLoading" type="primary" @click="submitForm">确 定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as RegionalAgentWithdrawApi from '@/api/mall/trade/regionalAgent/withdraw'

defineOptions({ name: 'RegionalAgentWithdrawAuditForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: undefined,
  auditStatus: undefined,
  auditReason: ''
})
const formRules = reactive({
  auditReason: [{ required: true, message: '审核原因不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (row: RegionalAgentWithdrawApi.RegionalAgentWithdrawVO, auditStatus: number) => {
  dialogVisible.value = true
  resetForm()
  formData.value.id = row.id
  formData.value.auditStatus = auditStatus
  
  if (auditStatus === 20) {
    dialogTitle.value = '审核通过'
    formData.value.auditReason = '审核通过'
  } else {
    dialogTitle.value = '审核拒绝'
    formData.value.auditReason = ''
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

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
    await RegionalAgentWithdrawApi.auditRegionalAgentWithdraw(formData.value)
    message.success('审核成功')
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
    auditStatus: undefined,
    auditReason: ''
  }
  formRef.value?.resetFields()
}
</script>