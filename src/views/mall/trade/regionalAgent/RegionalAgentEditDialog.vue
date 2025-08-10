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
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="formData.realName" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="代理级别" prop="agentLevel">
        <el-select v-model="formData.agentLevel" placeholder="请选择代理级别">
          <el-option
            v-for="level in Object.values(AreaAgentLevelEnum)"
            :key="level.level"
            :label="level.name"
            :value="level.level"
          />
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
      <el-form-item label="申请说明" prop="applyReason">
        <el-input
          v-model="formData.applyReason"
          :rows="3"
          placeholder="请输入申请说明"
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
  realName: '',
  mobile: '',
  agentLevel: undefined,
  provinceId: undefined,
  cityId: undefined,
  areaId: undefined,
  provinceName: '',
  cityName: '',
  areaName: '',
  applyReason: ''
})
const formRules = reactive({
  realName: [{ required: true, message: '真实姓名不能为空', trigger: 'blur' }],
  mobile: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }],
  agentLevel: [{ required: true, message: '代理级别不能为空', trigger: 'change' }],
  areaId: [{ required: true, message: '代理区域不能为空', trigger: 'change' }]
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
      } else if (data.cityId) {
        areaIds.value = [data.cityId]
      } else if (data.provinceId) {
        areaIds.value = [data.provinceId]
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
    realName: '',
    mobile: '',
    agentLevel: undefined,
    provinceId: undefined,
    cityId: undefined,
    areaId: undefined,
    provinceName: '',
    cityName: '',
    areaName: '',
    applyReason: ''
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
    formData.value.provinceId = undefined
    formData.value.cityId = undefined
    formData.value.areaId = undefined
    formData.value.provinceName = ''
    formData.value.cityName = ''
    formData.value.areaName = ''
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
    
    // 重置所有地区信息
    formData.value.provinceId = undefined
    formData.value.cityId = undefined
    formData.value.areaId = undefined
    formData.value.provinceName = ''
    formData.value.cityName = ''
    formData.value.areaName = ''
    
    // 根据级别设置对应的地区信息
    if (level === 1) { // 省级
      formData.value.provinceId = area.id
      formData.value.provinceName = area.name
    } else if (level === 2) { // 市级
      formData.value.cityId = area.id
      formData.value.cityName = area.name
      // 查找父级省份
      const findParent = (areas: any[], targetId: number): any => {
        for (const province of areas) {
          if (province.children) {
            for (const city of province.children) {
              if (city.id === targetId) {
                return province
              }
            }
          }
        }
        return null
      }
      const province = findParent(areaList.value, area.id)
      if (province) {
        formData.value.provinceId = province.id
        formData.value.provinceName = province.name
      }
    } else if (level === 3) { // 区县级
      formData.value.areaId = area.id
      formData.value.areaName = area.name
      // 查找父级市和省
      const findParents = (areas: any[], targetId: number): any => {
        for (const province of areas) {
          if (province.children) {
            for (const city of province.children) {
              if (city.children) {
                for (const district of city.children) {
                  if (district.id === targetId) {
                    return { province, city }
                  }
                }
              }
            }
          }
        }
        return null
      }
      const parents = findParents(areaList.value, area.id)
      if (parents) {
        formData.value.provinceId = parents.province.id
        formData.value.provinceName = parents.province.name
        formData.value.cityId = parents.city.id
        formData.value.cityName = parents.city.name
      }
    }
  }
}
</script>