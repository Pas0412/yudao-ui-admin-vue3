<template>
  <doc-alert title="【交易】地区代理提现管理" url="https://doc.iocoder.cn/mall/trade-regional-agent/" />

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
      <el-form-item label="提现类型" prop="type">
        <el-select
          v-model="queryParams.type"
          class="!w-240px"
          clearable
          placeholder="请选择提现类型"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AREA_AGENT_WITHDRAW_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="真实姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="请输入真实姓名"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="账号" prop="accountNo">
        <el-input
          v-model="queryParams.accountNo"
          class="!w-240px"
          clearable
          placeholder="请输入账号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行名称" prop="bankName">
        <el-input
          v-model="queryParams.bankName"
          class="!w-240px"
          clearable
          placeholder="请输入银行名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="提现状态" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-240px"
          clearable
          placeholder="请选择提现状态"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AREA_AGENT_WITHDRAW_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间" prop="createTime">
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
      <el-table-column align="center" label="提现编号" min-width="80px" prop="id" />
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
      <el-table-column align="center" label="提现金额" min-width="100px" prop="price">
        <template #default="scope">
          <span class="text-red-500 font-bold">{{ fenToYuan(scope.row.price) }}元</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现方式" min-width="100px" prop="type">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AREA_AGENT_WITHDRAW_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="提现信息" min-width="200px">
        <template #default="scope">
          <div>
            <div v-if="scope.row.name">姓名：{{ scope.row.name }}</div>
            <div v-if="scope.row.accountNo">账号：{{ scope.row.accountNo }}</div>
            <div v-if="scope.row.bankName">银行：{{ scope.row.bankName }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="申请时间"
        prop="createTime"
        width="180px"
      />
      <el-table-column align="center" label="提现状态" min-width="120px">
        <template #default="scope">
          <div>
            <dict-tag :type="DICT_TYPE.AREA_AGENT_WITHDRAW_STATUS" :value="scope.row.status" />
            <div v-if="scope.row.auditTime" class="text-xs text-gray-500 mt-1">
              审核时间：{{ formatDate(scope.row.auditTime) }}
            </div>
            <div v-if="scope.row.auditReason" class="text-xs text-gray-500 mt-1">
              审核原因：{{ scope.row.auditReason }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="200px">
        <template #default="scope">
          <template v-if="scope.row.status === 1">
            <el-button
              v-hasPermi="['product:regional-agent-withdraw:approve']"
              link
              type="primary"
              @click="handleApprove(scope.row)"
            >
              通过
            </el-button>
            <el-button
              v-hasPermi="['product:regional-agent-withdraw:approve']"
              link
              type="danger"
              @click="handleReject(scope.row)"
            >
              拒绝
            </el-button>
          </template>
          <el-button
            v-hasPermi="['product:regional-agent-withdraw:query']"
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
  <RegionalAgentWithdrawAuditForm ref="auditFormRef" @success="getList" />
  <!-- 详情对话框 -->
  <RegionalAgentWithdrawDetailDialog ref="detailDialogRef" />
</template>

<script lang="ts" setup>
import { dateFormatter, formatDate } from '@/utils/formatTime'
import { fenToYuan } from '@/utils'
import * as RegionalAgentWithdrawApi from '@/api/mall/trade/regionalAgent/withdraw'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { AreaAgentWithdrawStatusEnum } from '@/utils/constants'
import RegionalAgentWithdrawAuditForm from './RegionalAgentWithdrawAuditForm.vue'
import RegionalAgentWithdrawDetailDialog from './RegionalAgentWithdrawDetailDialog.vue'

defineOptions({ name: 'TradeRegionalAgentWithdraw' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  agentId: null,
  userId: null,
  type: null,
  name: null,
  accountNo: null,
  bankName: null,
  status: null,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await RegionalAgentWithdrawApi.getRegionalAgentWithdrawPage(queryParams)
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
const handleApprove = async (row: RegionalAgentWithdrawApi.RegionalAgentWithdrawVO) => {
  try {
    await message.confirm(`确认要通过"${row.nickname}"的提现申请吗？`)
    await RegionalAgentWithdrawApi.approveRegionalAgentWithdraw({
      id: row.id,
      status: 2, // 审核通过
      auditReason: '审核通过'
    })
    message.success('审核通过成功')
    await getList()
  } catch {}
}

/** 审核拒绝 */
const auditFormRef = ref()
const handleReject = (row: RegionalAgentWithdrawApi.RegionalAgentWithdrawVO) => {
  auditFormRef.value.open(row, 3) // 审核不通过
}

/** 查看详情 */
const detailDialogRef = ref()
const handleDetail = (row: RegionalAgentWithdrawApi.RegionalAgentWithdrawVO) => {
  detailDialogRef.value.open(row.id)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>