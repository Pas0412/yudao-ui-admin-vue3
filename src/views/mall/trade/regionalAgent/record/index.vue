<template>
  <doc-alert title="【交易】地区代理佣金记录" url="https://doc.iocoder.cn/mall/trade-regional-agent/" />

  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="85px"
    >
      <el-form-item label="代理编号" prop="agentId">
        <el-input
          v-model="queryParams.agentId"
          class="!w-240px"
          clearable
          placeholder="请输入代理编号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户编号" prop="userId">
        <el-input
          v-model="queryParams.userId"
          class="!w-240px"
          clearable
          placeholder="请输入用户编号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="业务类型" prop="bizType">
        <el-select
          v-model="queryParams.bizType"
          class="!w-240px"
          clearable
          placeholder="请选择业务类型"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AREA_AGENT_RECORD_BIZ_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="佣金状态" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-240px"
          clearable
          placeholder="请选择佣金状态"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AREA_AGENT_RECORD_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="地区类型" prop="areaType">
        <el-select
          v-model="queryParams.areaType"
          class="!w-240px"
          clearable
          placeholder="请选择地区类型"
        >
          <el-option label="省" :value="1" />
          <el-option label="市" :value="2" />
          <el-option label="区/县" :value="3" />
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
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="记录编号" min-width="80px" prop="id" />
      <el-table-column align="center" label="代理编号" min-width="80px" prop="agentId" />
      <el-table-column align="center" label="用户信息" min-width="120px">
        <template #default="scope">
          <div class="flex items-center">
            <el-avatar :src="scope.row.avatar" class="mr-2" />
            <div>
              <div>编号：{{ scope.row.userId }}</div>
              <div>昵称：{{ scope.row.nickname }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地区类型" min-width="100px" prop="areaType">
        <template #default="scope">
          <el-tag v-if="scope.row.areaType === 1" type="danger">
            省
          </el-tag>
          <el-tag v-else-if="scope.row.areaType === 2" type="warning">
            市
          </el-tag>
          <el-tag v-else-if="scope.row.areaType === 3" type="info">
            区/县
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="代理区域" min-width="150px" prop="areaName" />
      <el-table-column align="center" label="业务类型" min-width="100px" prop="bizType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AREA_AGENT_RECORD_BIZ_TYPE" :value="scope.row.bizType" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="佣金金额" min-width="100px" prop="price">
        <template #default="scope">
          <span class="text-green-500">+{{ fenToYuan(scope.row.price) }}元</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务编号" min-width="120px" prop="bizId" />
      <el-table-column align="center" label="佣金状态" min-width="100px" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AREA_AGENT_RECORD_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="创建时间"
        prop="createTime"
        width="180px"
      />
      <el-table-column align="center" label="备注" min-width="120px" prop="description" />
      <el-table-column align="center" fixed="right" label="操作" width="100px">
        <template #default="scope">
          <el-button
            v-hasPermi="['product:regional-agent-record:query']"
            link
            type="primary"
            @click="handleDetail(scope.row)"
          >
            详情
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

  <!-- 详情对话框 -->
  <RegionalAgentRecordDetailDialog ref="detailDialogRef" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import { fenToYuan } from '@/utils'
import * as RegionalAgentRecordApi from '@/api/mall/trade/regionalAgent/record'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { AreaAgentLevelEnum } from '@/utils/constants'
import RegionalAgentRecordDetailDialog from './RegionalAgentRecordDetailDialog.vue'

defineOptions({ name: 'TradeRegionalAgentRecord' })

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  agentId: null,
  userId: null,
  bizType: null,
  status: null,
  areaType: null,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await RegionalAgentRecordApi.getRegionalAgentRecordPage(queryParams)
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

/** 查看详情 */
const detailDialogRef = ref()
const handleDetail = (row: RegionalAgentRecordApi.RegionalAgentRecordVO) => {
  detailDialogRef.value.open(row.id)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>