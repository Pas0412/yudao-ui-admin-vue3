<template>
  <Dialog v-model="dialogVisible" title="创建地区代理" width="800">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="90"
    >
      <el-row :gutter="20">
        <el-col :span="12" :xs="24">
          <el-form-item label="地区代理" prop="userId">
            <el-input
              v-model="formData.userId"
              v-loading="formLoading"
              placeholder="请输入代理编号"
            >
              <template #append>
                <el-button @click="handleGetUser(formData.userId, '地区代理')">
                  <Icon class="mr-5px" icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <!-- 展示地区代理的信息 -->
          <el-descriptions v-if="userInfo.user" :column="1" border>
            <el-descriptions-item label="头像">
              <el-avatar :src="userInfo.user?.avatar" />
            </el-descriptions-item>
            <el-descriptions-item label="昵称">{{ userInfo.user?.nickname }}</el-descriptions-item>
          </el-descriptions>
        </el-col>

        <el-col :span="12" :xs="24">
          <el-form-item label="上级代理" prop="bindUserId">
            <el-input
              v-model="formData.bindUserId"
              v-loading="formLoading"
              placeholder="请输入代理编号"
            >
              <template #append>
                <el-button @click="handleGetUser(formData.bindUserId, '代理')">
                  <Icon class="mr-5px" icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <!-- 展示上级代理的信息 -->
          <el-descriptions v-if="userInfo.bindUser" :column="1" border>
            <el-descriptions-item label="头像">
              <el-avatar :src="userInfo.bindUser?.avatar" />
            </el-descriptions-item>
            <el-descriptions-item label="昵称"
              >{{ userInfo.bindUser?.nickname }}
            </el-descriptions-item>
            <el-descriptions-item label="代理资格">
              <el-tag v-if="userInfo.bindUser?.areaAgentEnabled">有</el-tag>
              <el-tag v-else type="info">无</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="成为代理的时间">
              {{ formatDate(userInfo.bindUser?.areaAgentTime) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12" :xs="24">
          <el-form-item label="代理地区" prop="region">
            <el-input
              v-model="formData.region"
              placeholder="请输入代理地区"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="代理级别" prop="level">
            <el-input-number
              v-model="formData.level"
              :min="1"
              :max="10"
              placeholder="请输入代理级别"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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

defineOptions({ name: 'AreaAgentUserCreateForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  userId: undefined,
  bindUserId: undefined,
  region: '',
  level: 1
})
const formRef = ref() // 表单 Ref
const formRules = reactive({
  userId: [{ required: true, message: '地区代理不能为空', trigger: 'blur' }],
  region: [{ required: true, message: '代理地区不能为空', trigger: 'blur' }],
  level: [{ required: true, message: '代理级别不能为空', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async () => {
  resetForm()
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
/** 创建地区代理 */
const submitForm = async () => {
  if (formLoading.value) return
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return

  // 提交请求
  formLoading.value = true
  try {
    // 发起修改
    await AreaAgentUserApi.createAreaAgentUser(formData.value)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    userId: undefined,
    bindUserId: undefined,
    region: '',
    level: 1
  }

  userInfo.bindUser = undefined
  userInfo.user = undefined
}

/** 查询代理和地区代理 */
const userInfo = reactive<{
  bindUser: AreaAgentUserApi.AreaAgentUserVO | undefined
  user: any | undefined
}>({
  bindUser: undefined,
  user: undefined
})
const handleGetUser = async (id: any, userType: string) => {
  if (!id) {
    message.warning(`请先输入${userType}编号后重试！！！`)
    return
  }
  if (userType === '代理' && formData.value.bindUserId == formData.value.userId) {
    message.error('不能绑定自己为上级代理')
    return
  }
  const user =
    userType === '代理' ? await AreaAgentUserApi.getAreaAgentUser(id) : await UserApi.getUser(id)
  userType === '代理' ? (userInfo.bindUser = user) : (userInfo.user = user)
  if (!user) {
    message.warning(`${userType}不存在`)
  }
}
</script>