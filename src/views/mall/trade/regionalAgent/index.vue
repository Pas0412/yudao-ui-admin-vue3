<template>
  <doc-alert title="【交易】地区代理" url="https://doc.iocoder.cn/mall/trade-regional-agent/" />

  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="85px"
    >
      <el-form-item label="用户编号" prop="userId">
        <el-input
          v-model="queryParams.userId"
          class="!w-240px"
          clearable
          placeholder="请输入用户编号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地区名称" prop="areaName">
        <el-input
          v-model="queryParams.areaName"
          class="!w-240px"
          clearable
          placeholder="请输入地区名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地区类型" prop="areaType">
        <el-select
          v-model="queryParams.areaType"
          class="!w-240px"
          clearable
          placeholder="请选择地区类型"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AREA_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="代理状态" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-240px"
          clearable
          placeholder="请选择代理状态"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.REGIONAL_AGENT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
          end-placeholder="结束日期"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
        <el-button
          v-hasPermi="['product:regional-agent:create']"
          plain
          type="primary"
          @click="openForm('create')"
        >
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
        <el-button
          v-hasPermi="['product:regional-agent:export']"
          :loading="exportLoading"
          plain
          type="success"
          @click="handleExport"
        >
          <Icon class="mr-5px" icon="ep:download" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="编号" min-width="80px" prop="id" />
      <el-table-column align="center" label="用户编号" min-width="80px" prop="userId" />
      <el-table-column align="center" label="用户昵称" min-width="100px" prop="userNickname" />
      <el-table-column align="center" label="地区名称" min-width="100px" prop="areaName" />
      <el-table-column align="center" label="地区类型" min-width="100px" prop="areaType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AREA_TYPE" :value="scope.row.areaType" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="代理状态" min-width="100px" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.REGIONAL_AGENT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="创建时间" 
        prop="createTime"
        width="180px"
      />
      <el-table-column align="center" label="审核备注" min-width="150px" prop="auditRemark" />
      <el-table-column align="center" fixed="right" label="操作" width="200px">
        <template #default="scope">
          <el-button
            v-hasPermi="['product:regional-agent:update']"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-hasPermi="['product:regional-agent:delete']"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
          <el-button
            v-if="scope.row.status === 0"
            v-hasPermi="['product:regional-agent:approve']"
            link
            type="primary"
            @click="openAuditForm(scope.row)"
          >
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <RegionalAgentForm ref="formRef" @success="getList" />
  <!-- 表单弹窗：审核 -->
  <RegionalAgentAuditForm ref="auditFormRef" @success="getList" />
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { fenToYuanFormat } from '@/utils/formatter'
import * as RegionalAgentApi from '@/api/mall/trade/regionalAgent'
import RegionalAgentForm from './RegionalAgentForm.vue'
import RegionalAgentAuditForm from './RegionalAgentAuditForm.vue'
import download from '@/utils/download'

defineOptions({ name: 'TradeRegionalAgent' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: undefined,
  areaName: undefined,
  areaType: undefined,
  status: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await RegionalAgentApi.getRegionalAgentPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await RegionalAgentApi.deleteRegionalAgent(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await RegionalAgentApi.exportRegionalAgent(queryParams)
    download.excel(data, '地区代理.xls')
  } catch {
    message.error('导出失败，请重试！')
  } finally {
    exportLoading.value = false
  }
}

/** 审核操作 */
const auditFormRef = ref()
const openAuditForm = (row: any) => {
  auditFormRef.value.open(row)
}

/** 初始化 **/ 
onMounted(() => {
  getList()
})
</script>