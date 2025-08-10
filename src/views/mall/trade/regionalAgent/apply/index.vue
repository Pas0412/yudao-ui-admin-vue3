<template>
  <doc-alert title="【交易】地区代理管理" url="https://doc.iocoder.cn/mall/trade-regional-agent/" />

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
      <el-form-item label="代理级别" prop="agentLevel">
        <el-select
          v-model="queryParams.agentLevel"
          class="!w-240px"
          clearable
          placeholder="请选择代理级别"
        >
          <el-option
            v-for="level in Object.values(AreaAgentLevelEnum)"
            :key="level.level"
            :label="level.name"
            :value="level.level"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请状态" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-240px"
          clearable
          placeholder="请选择申请状态"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AREA_AGENT_APPLY_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间" prop="applyTime">
        <el-date-picker
          v-model="queryParams.applyTime"
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
      <el-table-column align="center" label="申请编号" min-width="80px" prop="id" />
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
      <el-table-column align="center" label="代理级别" min-width="100px" prop="agentLevel">
        <template #default="scope">
          <el-tag v-if="scope.row.agentLevel === AreaAgentLevelEnum.PROVINCE.level" type="danger">
            {{ AreaAgentLevelEnum.PROVINCE.name }}
          </el-tag>
          <el-tag v-else-if="scope.row.agentLevel === AreaAgentLevelEnum.CITY.level" type="warning">
            {{ AreaAgentLevelEnum.CITY.name }}
          </el-tag>
          <el-tag v-else-if="scope.row.agentLevel === AreaAgentLevelEnum.AREA.level" type="info">
            {{ AreaAgentLevelEnum.AREA.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="代理区域" min-width="150px">
        <template #default="scope">
          <div>
            <div v-if="scope.row.provinceName">{{ scope.row.provinceName }}</div>
            <div v-if="scope.row.cityName">{{ scope.row.cityName }}</div>
            <div v-if="scope.row.areaName">{{ scope.row.areaName }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="申请时间"
        prop="applyTime"
        width="180px"
      />
      <el-table-column align="center" label="申请状态" min-width="100px" prop="status">
        <template #default="scope">
          <el-tag v-if="scope.row.status === AreaAgentApplyStatusEnum.AUDITING.status" type="warning">
            {{ AreaAgentApplyStatusEnum.AUDITING.name }}
          </el-tag>
          <el-tag v-else-if="scope.row.status === AreaAgentApplyStatusEnum.APPROVED.status" type="success">
            {{ AreaAgentApplyStatusEnum.APPROVED.name }}
          </el-tag>
          <el-tag v-else-if="scope.row.status === AreaAgentApplyStatusEnum.REJECTED.status" type="danger">
            {{ AreaAgentApplyStatusEnum.REJECTED.name }}
          </el-tag>
          <el-tag v-else-if="scope.row.status === AreaAgentApplyStatusEnum.DISABLED.status" type="info">
            {{ AreaAgentApplyStatusEnum.DISABLED.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="审核时间"
        prop="auditTime"
        width="180px"
      />
      <el-table-column align="center" label="审核原因" min-width="120px" prop="auditReason" />
      <el-table-column align="center" fixed="right" label="操作" width="200px">
        <template #default="scope">
          <template v-if="scope.row.status === AreaAgentApplyStatusEnum.AUDITING.status">
            <el-button
              v-hasPermi="['trade:regional-agent:audit']"
              link
              type="primary"
              @click="handleApprove(scope.row)"
            >
              通过
            </el-button>
            <el-button
              v-hasPermi="['trade:regional-agent:audit']"
              link
              type="danger"
              @click="handleReject(scope.row)"
            >
              拒绝
            </el-button>
          </template>
          <el-button
            v-hasPermi="['trade:regional-agent:query']"
            link
            type="info"
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

  <!-- 审核表单 -->
  <RegionalAgentAuditForm ref="auditFormRef" @success="getList" />
  <!-- 详情对话框 -->
  <RegionalAgentDetailDialog ref="detailDialogRef" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as RegionalAgentApi from '@/api/mall/trade/regionalAgent'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { AreaAgentApplyStatusEnum, AreaAgentLevelEnum } from '@/utils/constants'
import RegionalAgentAuditForm from './RegionalAgentAuditForm.vue'
import RegionalAgentDetailDialog from './RegionalAgentDetailDialog.vue'

defineOptions({ name: 'TradeRegionalAgentApply' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: null,
  agentLevel: null,
  status: null,
  applyTime: []
})
const queryFormRef = ref() // 搜索的表单

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

/** 审核通过 */
const handleApprove = async (row: RegionalAgentApi.RegionalAgentVO) => {
  try {
    await message.confirm(`确认要通过"${row.nickname}"的代理申请吗？`)
    await RegionalAgentApi.auditRegionalAgent({
      id: row.id,
      auditStatus: AreaAgentApplyStatusEnum.APPROVED.status,
      auditReason: '审核通过'
    })
    message.success('审核通过成功')
    await getList()
  } catch {}
}

/** 审核拒绝 */
const auditFormRef = ref()
const handleReject = (row: RegionalAgentApi.RegionalAgentVO) => {
  auditFormRef.value.open(row, AreaAgentApplyStatusEnum.REJECTED.status)
}

/** 查看详情 */
const detailDialogRef = ref()
const handleDetail = (row: RegionalAgentApi.RegionalAgentVO) => {
  detailDialogRef.value.open(row.id)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>