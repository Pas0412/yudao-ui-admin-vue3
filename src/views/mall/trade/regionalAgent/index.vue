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
      <el-form-item label="代理状态" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-240px"
          clearable
          placeholder="请选择代理状态"
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
      <el-table-column align="center" label="代理编号" min-width="80px" prop="id" />
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
      <el-table-column align="center" label="真实姓名" min-width="100px" prop="realName" />
      <el-table-column align="center" label="手机号码" min-width="120px" prop="mobile" />
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
      <el-table-column align="center" label="佣金统计" min-width="120px">
        <template #default="scope">
          <div>
            <div>总佣金：{{ fenToYuan(scope.row.totalBrokerage || 0) }}元</div>
            <div>可提现：{{ fenToYuan(scope.row.settlementPrice || 0) }}元</div>
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
      <el-table-column align="center" label="代理状态" min-width="100px" prop="status">
        <template #default="scope">
          <el-tag v-if="scope.row.status === AreaAgentApplyStatusEnum.APPROVED.status" type="success">
            {{ AreaAgentApplyStatusEnum.APPROVED.name }}
          </el-tag>
          <el-tag v-else-if="scope.row.status === AreaAgentApplyStatusEnum.DISABLED.status" type="info">
            {{ AreaAgentApplyStatusEnum.DISABLED.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="200px">
        <template #default="scope">
          <el-dropdown
            v-hasPermi="[
              'trade:regional-agent:update-status',
              'trade:regional-agent:query'
            ]"
            @command="(command) => handleCommand(command, scope.row)"
          >
            <el-button link type="primary">
              更多
              <Icon icon="ep:arrow-down" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-hasPermi="['trade:regional-agent:query']"
                  command="detail"
                >
                  查看详情
                </el-dropdown-item>
                <el-dropdown-item
                  v-hasPermi="['trade:regional-agent:query']"
                  command="record"
                >
                  佣金记录
                </el-dropdown-item>
                <el-dropdown-item
                  v-hasPermi="['trade:regional-agent:query']"
                  command="withdraw"
                >
                  提现记录
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.status === AreaAgentApplyStatusEnum.APPROVED.status"
                  v-hasPermi="['trade:regional-agent:update-status']"
                  command="disable"
                >
                  禁用代理
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.status === AreaAgentApplyStatusEnum.DISABLED.status"
                  v-hasPermi="['trade:regional-agent:update-status']"
                  command="enable"
                >
                  启用代理
                </el-dropdown-item>
                <el-dropdown-item
                  v-hasPermi="['trade:regional-agent:update']"
                  command="edit"
                >
                  编辑信息
                </el-dropdown-item>
                <el-dropdown-item
                  v-hasPermi="['trade:regional-agent:delete']"
                  command="delete"
                >
                  删除代理
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
  <RegionalAgentDetailDialog ref="detailDialogRef" />
  <!-- 佣金记录对话框 -->
  <RegionalAgentRecordDialog ref="recordDialogRef" />
  <!-- 提现记录对话框 -->
  <RegionalAgentWithdrawDialog ref="withdrawDialogRef" />
  <!-- 编辑对话框 -->
  <RegionalAgentEditDialog ref="editDialogRef" @success="getList" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import { fenToYuan } from '@/utils'
import * as RegionalAgentApi from '@/api/mall/trade/regionalAgent'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { AreaAgentApplyStatusEnum, AreaAgentLevelEnum } from '@/utils/constants'
import RegionalAgentDetailDialog from './RegionalAgentDetailDialog.vue'
import RegionalAgentRecordDialog from './RegionalAgentRecordDialog.vue'
import RegionalAgentWithdrawDialog from './RegionalAgentWithdrawDialog.vue'
import RegionalAgentEditDialog from './RegionalAgentEditDialog.vue'

defineOptions({ name: 'TradeRegionalAgent' })

const message = useMessage() // 消息弹窗
const { push } = useRouter() // 路由跳转

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: null,
  agentLevel: null,
  status: AreaAgentApplyStatusEnum.APPROVED.status, // 默认查询已审核通过的代理
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
  queryParams.status = AreaAgentApplyStatusEnum.APPROVED.status // 重置时保持默认状态
  handleQuery()
}

/** 操作分发 */
const handleCommand = (command: string, row: RegionalAgentApi.RegionalAgentVO) => {
  switch (command) {
    case 'detail':
      handleDetail(row)
      break
    case 'record':
      handleRecord(row)
      break
    case 'withdraw':
      handleWithdraw(row)
      break
    case 'disable':
      handleUpdateStatus(row, AreaAgentApplyStatusEnum.DISABLED.status)
      break
    case 'enable':
      handleUpdateStatus(row, AreaAgentApplyStatusEnum.APPROVED.status)
      break
    case 'edit':
      handleEdit(row)
      break
    case 'delete':
      handleDelete(row)
      break
  }
}

/** 查看详情 */
const detailDialogRef = ref()
const handleDetail = (row: RegionalAgentApi.RegionalAgentVO) => {
  detailDialogRef.value.open(row.id)
}

/** 查看佣金记录 */
const recordDialogRef = ref()
const handleRecord = (row: RegionalAgentApi.RegionalAgentVO) => {
  recordDialogRef.value.open(row.id)
}

/** 查看提现记录 */
const withdrawDialogRef = ref()
const handleWithdraw = (row: RegionalAgentApi.RegionalAgentVO) => {
  withdrawDialogRef.value.open(row.id)
}

/** 更新代理状态 */
const handleUpdateStatus = async (row: RegionalAgentApi.RegionalAgentVO, status: number) => {
  const statusText = status === AreaAgentApplyStatusEnum.DISABLED.status ? '禁用' : '启用'
  try {
    await message.confirm(`确认要${statusText}"${row.nickname}"的代理资格吗？`)
    await RegionalAgentApi.updateRegionalAgentStatus({
      id: row.id,
      status: status
    })
    message.success(`${statusText}成功`)
    await getList()
  } catch {}
}

/** 编辑代理信息 */
const editDialogRef = ref()
const handleEdit = (row: RegionalAgentApi.RegionalAgentVO) => {
  editDialogRef.value.open(row.id)
}

/** 删除代理 */
const handleDelete = async (row: RegionalAgentApi.RegionalAgentVO) => {
  try {
    await message.confirm(`确认要删除"${row.nickname}"的代理资格吗？删除后将无法恢复！`)
    await RegionalAgentApi.deleteRegionalAgent(row.id)
    message.success('删除成功')
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>