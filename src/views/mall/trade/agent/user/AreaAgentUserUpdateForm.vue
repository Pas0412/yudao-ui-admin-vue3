<template>
  <Dialog v-model="dialogVisible" title="修改上级代理" width="500">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="上级代理" prop="bindUserId">
        <el-input
          v-model="formData.bindUserId"
          placeholder="请输入代理编号"
          v-loading="formLoading"
        >
          <template #append>
            <el-button @click="handleGetUser"><Icon icon="ep:search" class="mr-5px" /></el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <!-- 展示上级代理的信息 -->
    <el-descriptions v-if="bindUser" :column="1" border>
      <el-descriptions-item label="头像">
        <el-avatar :src="bindUser.avatar" />
      </el-descriptions-item>
      <el-descriptions-item label="昵称">{{ bindUser.nickname }}</el-descriptions-item>
      <el-descriptions-item label="代理资格">
        <el-tag v-if="bindUser.areaAgentEnabled">有</el-tag>
        <el-tag v-else type="info">无</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="成为代理的时间">
        {{ formatDate(bindUser.areaAgentTime) }}
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useMessage } from '@/hooks/web/useMessage'
import * as AreaAgentUserApi from '@/api/mall/trade/agent/user'
import * as UserApi from '@/api/member/user'
import { formatDate } from '@/utils/formatTime'

/** 修改地区代理用户 */
defineOptions({ name: 'AreaAgentUserUpdateForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: undefined,
  bindUserId: undefined
})
const formRef = ref() // 表单 Ref
const formRules = reactive({
  bindUserId: [{ required: true, message: '上级代理不能为空', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (row: AreaAgentUserApi.AreaAgentUserVO) => {
  resetForm()
  // 设置数据
  formData.value.id = row.id
  formData.value.bindUserId = row.bindUserId
  // 反显上级代理
  if (row.bindUserId) {
    await handleGetUser()
  }
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
/** 修改上级代理 */
const submitForm = async () => {
  if (formLoading.value) return
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 未查找到合适的上级
  if (!bindUser.value) {
    message.error('请先查询并确认代理')
    return
  }

  // 提交请求
  formLoading.value = true
  try {
    // 发起修改
    await AreaAgentUserApi.updateBindUser(formData.value)
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success', true)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    bindUserId: undefined
  }
  formRef.value?.resetFields()
  bindUser.value = undefined
}

/** 查询代理 */
const bindUser = ref<AreaAgentUserApi.AreaAgentUserVO | undefined>()
const handleGetUser = async () => {
  if (formData.value.bindUserId == formData.value.id) {
    message.error('不能绑定自己为上级代理')
    return
  }
  formLoading.value = true
  bindUser.value = await AreaAgentUserApi.getAreaAgentUser(formData.value.bindUserId)
  if (!bindUser.value) {
    message.warning('代理不存在')
  }
  formLoading.value = false
}
</script>