<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="500">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="用户编号" prop="userId">
        <el-input
          v-model="formData.userId"
          v-loading="formLoading"
          placeholder="请输入用户编号"
          :disabled="formType === 'update'"
        >
          <template #append>
            <el-button @click="handleGetUser(formData.userId)">
              <Icon class="mr-5px" icon="ep:search" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <!-- 展示用户的信息 -->
      <el-descriptions v-if="user" :column="1" border>
        <el-descriptions-item label="头像">
          <el-avatar :src="user?.avatar" />
        </el-descriptions-item>
        <el-descriptions-item label="昵称">{{ user?.nickname }}</el-descriptions-item>
      </el-descriptions>
      <el-form-item label="地区类型" prop="areaType">
        <el-select v-model="formData.areaType" placeholder="请选择地区类型" class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AREA_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="地区" prop="areaId">
        <el-cascader
          v-model="formData.areaId"
          :options="areaTrees"
          :props="{
            value: 'id',
            label: 'name',
            emitPath: false
          }"
          class="w-1/1"
          placeholder="请选择地区"
        />
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
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as RegionalAgentApi from '@/api/mall/trade/regionalAgent'
import * as UserApi from '@/api/member/user'
import * as AreaApi from '@/api/system/area'

defineOptions({ name: 'RegionalAgentForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  userId: undefined,
  areaId: undefined,
  areaType: undefined,
  areaName: undefined,
  auditRemark: undefined
})
const formRef = ref() // 表单 Ref
const formRules = reactive({
  userId: [{ required: true, message: '用户编号不能为空', trigger: 'blur' }],
  areaId: [{ required: true, message: '地区不能为空', trigger: 'blur' }],
  areaType: [{ required: true, message: '地区类型不能为空', trigger: 'blur' }]
})
const user = ref() // 用户信息
const areaTrees = ref([]) // 地区树

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增地区代理' : '编辑地区代理'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await RegionalAgentApi.getRegionalAgent(id)
      await handleGetUser(formData.value.userId)
    } finally {
      formLoading.value = false
    }
  }
  // 获得地区树
  areaTrees.value = await AreaApi.getAreaChildren()
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
    // 设置地区名称
    const areaInfo = await AreaApi.getArea(formData.value.areaId)
    formData.value.areaName = areaInfo?.name || ''
    
    if (formType.value === 'create') {
      await RegionalAgentApi.createRegionalAgent(formData.value)
      message.success(t('common.createSuccess'))
    } else {
      await RegionalAgentApi.updateRegionalAgent(formData.value)
      message.success(t('common.updateSuccess'))
    }
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
    userId: undefined,
    areaId: undefined,
    areaType: undefined,
    areaName: undefined,
    auditRemark: undefined
  }
  formRef.value?.resetFields()
  user.value = undefined
}

/** 查询用户 */
const handleGetUser = async (id: number) => {
  if (!id) {
    message.warning('请先输入用户编号后重试！！！')
    return
  }
  user.value = await UserApi.getUser(id)
  if (!user.value) {
    message.warning('用户不存在')
  }
}
</script>