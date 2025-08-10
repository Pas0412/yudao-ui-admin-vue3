<template>
  <Dialog v-model="dialogVisible" title="佣金记录" width="1200px">
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="记录编号" min-width="80px" prop="id" />
      <el-table-column align="center" label="用户信息" min-width="120px">
        <template #default="scope">
          <div class="flex items-center">
            <el-avatar :src="scope.row.avatar" class="mr-2" size="small" />
            <div>
              <div>编号：{{ scope.row.userId }}</div>
              <div>昵称：{{ scope.row.nickname }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
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
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
    
    <template #footer>
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import { fenToYuan } from '@/utils'
import * as RegionalAgentRecordApi from '@/api/mall/trade/regionalAgent/record'
import { DICT_TYPE } from '@/utils/dict'

defineOptions({ name: 'RegionalAgentRecordDialog' })

const dialogVisible = ref(false) // 弹窗的是否展示
const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  agentId: null
})

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

/** 打开弹窗 */
const open = async (agentId: number) => {
  dialogVisible.value = true
  queryParams.agentId = agentId
  queryParams.pageNo = 1
  await getList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>