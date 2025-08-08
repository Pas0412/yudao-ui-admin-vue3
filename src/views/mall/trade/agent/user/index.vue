<template>
  <doc-alert title="【交易】地区代理返佣" url="https://doc.iocoder.cn/mall/trade-brokerage/" />

  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="85px"
    >
      <el-form-item label="代理编号" prop="bindUserId">
        <el-input
          v-model="queryParams.bindUserId"
          class="!w-240px"
          clearable
          placeholder="请输入代理编号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="代理资格" prop="areaAgentEnabled">
        <el-select
          v-model="queryParams.areaAgentEnabled"
          class="!w-240px"
          clearable
          placeholder="请选择代理资格"
        >
          <el-option :value="true" label="有" />
          <el-option :value="false" label="无" />
        </el-select>
      </el-form-item>
      <el-form-item label="代理地区" prop="region">
        <el-input
          v-model="queryParams.region"
          class="!w-240px"
          clearable
          placeholder="请输入代理地区"
          @keyup.enter="handleQuery"
        />
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
          v-hasPermi="['trade:area-agent-user:create']"
          plain
          type="primary"
          @click="openCreateUserForm"
        >
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="用户编号" min-width="80px" prop="id" />
      <el-table-column align="center" label="头像" prop="avatar" width="70px">
        <template #default="scope">
          <el-avatar :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" min-width="80px" prop="nickname" />
      <el-table-column align="center" label="代理地区" min-width="100px" prop="region" />
      <el-table-column align="center" label="代理级别" min-width="80px" prop="level" />
      <el-table-column align="center" label="代理人数" prop="areaAgentUserCount" width="80px" />
      <el-table-column
        align="center"
        label="代理订单数量"
        min-width="110px"
        prop="areaAgentOrderCount"
      />
      <el-table-column
        :formatter="fenToYuanFormat"
        align="center"
        label="代理订单金额"
        min-width="110px"
        prop="areaAgentOrderPrice"
      />
      <el-table-column
        :formatter="fenToYuanFormat"
        align="center"
        label="已提现金额"
        min-width="100px"
        prop="withdrawPrice"
      />
      <el-table-column align="center" label="已提现次数" min-width="100px" prop="withdrawCount" />
      <el-table-column
        :formatter="fenToYuanFormat"
        align="center"
        label="未提现金额"
        min-width="100px"
        prop="price"
      />
      <el-table-column
        :formatter="fenToYuanFormat"
        align="center"
        label="冻结中佣金"
        min-width="100px"
        prop="frozenPrice"
      />
      <el-table-column align="center" label="代理资格" min-width="80px" prop="areaAgentEnabled">
        <template #default="scope">
          <el-switch
            v-model="scope.row.areaAgentEnabled"
            :disabled="!checkPermi(['trade:area-agent-user:update-bind-user'])"
            active-text="有"
            inactive-text="无"
            inline-prompt
            @change="handleAreaAgentEnabledChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="成为代理时间"
        prop="areaAgentTime"
        width="180px"
      />
      <el-table-column align="center" label="上级代理编号" prop="bindUserId" width="150px" />
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="代理绑定时间"
        prop="bindUserTime"
        width="180px"
      />
      <el-table-column align="center" fixed="right" label="操作" width="150px">
        <template #default="scope">
          <el-dropdown
            v-hasPermi="[
              'trade:area-agent-user:user-query',
              'trade:area-agent-user:order-query',
              'trade:area-agent-user:update-bind-user',
              'trade:area-agent-user:clear-bind-user'
            ]"
            @command="(command) => handleCommand(command, scope.row)"
          >
            <el-button link type="primary">
              <Icon icon="ep:d-arrow-right" />
              更多
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-if="checkPermi(['trade:area-agent-user:user-query'])"
                  command="openAreaAgentUserTable"
                >
                  代理人
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="checkPermi(['trade:area-agent-user:order-query'])"
                  command="openAreaAgentOrderTable"
                >
                  代理订单
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="checkPermi(['trade:area-agent-user:update-bind-user'])"
                  command="openUpdateBindUserForm"
                >
                  修改上级代理
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="
                    scope.row.bindUserId && checkPermi(['trade:area-agent-user:clear-bind-user'])
                  "
                  command="handleClearBindUser"
                >
                  清除上级代理
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
  <!-- 修改上级代理表单 -->
  <AreaAgentUserUpdateForm ref="updateFormRef" @success="getList" />
  <!-- 代理人列表 -->
  <AreaAgentUserListDialog ref="listDialogRef" />
  <!-- 代理订单列表 -->
  <AreaAgentOrderListDialog ref="orderDialogRef" />
  <!-- 创建地区代理 -->
  <AreaAgentUserCreateForm ref="createFormRef" @success="getList" />
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useMessage } from '@/hooks/web/useMessage'
import { dateFormatter } from '@/utils/formatTime'
import * as AreaAgentUserApi from '@/api/mall/trade/agent/user'
import { checkPermi } from '@/utils/permission'
import { fenToYuanFormat } from '@/utils/formatter'
import AreaAgentUserUpdateForm from '@/views/mall/trade/agent/user/AreaAgentUserUpdateForm.vue'
import AreaAgentUserListDialog from '@/views/mall/trade/agent/user/AreaAgentUserListDialog.vue'
import AreaAgentOrderListDialog from '@/views/mall/trade/agent/user/AreaAgentOrderListDialog.vue'
import AreaAgentUserCreateForm from '@/views/mall/trade/agent/user/AreaAgentUserCreateForm.vue'

defineOptions({ name: 'TradeAreaAgentUser' })

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  bindUserId: null,
  areaAgentEnabled: true,
  region: null,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AreaAgentUserApi.getAreaAgentUserPage(queryParams)
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

const handleCommand = (command: string, row: AreaAgentUserApi.AreaAgentUserVO) => {
  switch (command) {
    case 'openAreaAgentUserTable':
      openAreaAgentUserTable(row.id)
      break
    case 'openAreaAgentOrderTable':
      openAreaAgentOrderTable(row.id)
      break
    case 'openUpdateBindUserForm':
      openUpdateBindUserForm(row)
      break
    case 'handleClearBindUser':
      handleClearBindUser(row)
      break
  }
}

/** 打开代理人列表 */
const listDialogRef = ref()
const openAreaAgentUserTable = (id: number) => {
  listDialogRef.value.open(id)
}

/** 打开代理订单列表 */
const orderDialogRef = ref()
const openAreaAgentOrderTable = (id: number) => {
  orderDialogRef.value.open(id)
}

/** 打开表单：修改上级代理 */
const updateFormRef = ref()
const openUpdateBindUserForm = (row: AreaAgentUserApi.AreaAgentUserVO) => {
  updateFormRef.value.open(row)
}

/** 创建地区代理 */
const createFormRef = ref()
const openCreateUserForm = () => {
  createFormRef.value?.open()
}

/** 清除上级代理 */
const handleClearBindUser = async (row: AreaAgentUserApi.AreaAgentUserVO) => {
  try {
    // 二次确认
    await message.confirm(`确认要清除"${row.nickname}"的上级代理吗？`)
    // 发起修改
    await AreaAgentUserApi.clearBindUser({ id: row.id })
    message.success('清除成功')
    // 刷新列表
    await getList()
  } catch {}
}

/** 代理资格：开通/关闭 */
const handleAreaAgentEnabledChange = async (row: AreaAgentUserApi.AreaAgentUserVO) => {
  try {
    // 二次确认
    const text = row.areaAgentEnabled ? '开通' : '关闭'
    await message.confirm(`确认要${text}"${row.nickname}"的代理资格吗？`)
    // 发起修改
    await AreaAgentUserApi.updateAreaAgentEnabled({ id: row.id, enabled: row.areaAgentEnabled })
    message.success(text + '成功')
    // 刷新列表
    await getList()
  } catch {
    // 异常时，需要重置回之前的值
    row.areaAgentEnabled = !row.areaAgentEnabled
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>