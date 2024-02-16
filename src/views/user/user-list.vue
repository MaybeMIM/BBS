<template>
  <div>
    <div class="top-panel">
      <el-form :model="formData" label-width="60px" @submit.prevent>
        <el-row>
          <el-col :span="4">
            <el-form-item label="昵称">
              <el-input
                clearable
                placeholder="请输入昵称"
                v-model.trim="formData.nickNameFuzzy"
                @keyup.native="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="性别">
              <el-select
                clearable
                placeholder="请选择性别"
                v-model="formData.sex"
                :style="{ width: '100%' }"
              >
                <el-option :value="1" label="男"></el-option>
                <el-option :value="0" label="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态">
              <el-select
                clearable
                placeholder="请选择状态"
                v-model="formData.status"
                :style="{ width: '100%' }"
              >
                <el-option :value="1" label="正常"></el-option>
                <el-option :value="0" label="禁用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :style="{ 'padding-left': '20px' }">
            <el-button-group>
              <el-button type="primary" @click="loadDataList">搜索</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-list">
      <Table
        ref="table"
        :columns="columns"
        :data-source="tableData"
        :options="tableOptions"
        :fetch="loadDataList"
        @rowSelected="setRowSelected"
      >
        <!-- 头像 -->
        <template #avatar="{ index, row }">
          <avatar :userId="row.userId"></avatar>
        </template>

        <!-- 头像 -->
        <template #nickName="{ index, row }">
          {{ row.nickName }}
          <span v-if="row.sex">({{ row.sex === 0 ? '女' : '男' }})</span>
        </template>

        <!-- 登录信息 -->
        <template #loginInfo="{ index, row }">
          <div>最后登录时间：{{ row.lastLoginTime }}</div>
          <div>最后登录IP：{{ row.lastLoginIp }}</div>
          <div>最后登录地点：{{ row.lastLoginIpAddress }}</div>
        </template>

        <!-- 类型 -->
        <template #integral="{ index, row }">
          <div>总积分：{{ row.totalIntegral }}</div>
          <div>当前积分：{{ row.currentIntegral }}</div>
        </template>

        <!-- 状态 -->
        <template #status="{ index, row }">
          <span v-if="row.status === 1" :style="{ color: '#68e068' }"
            >正常</span
          >
          <span v-else :style="{ color: '#e01d1d' }">禁用</span>
        </template>

        <!-- 操作信息 -->
        <template #op="{ index, row }">
          <div class="op" v-if="row.status !== -1">
            <el-dropdown trigger="hover">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="sendMessage(row)"
                    >发送系统消息</el-dropdown-item
                  >
                  <el-dropdown-item @click="handleUpdateUserStatus(row)">{{
                    row.status === 1 ? '禁用' : '启用'
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
    <SendMessage ref="sendMessageRef" @reload="loadDataList"></SendMessage>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import Table from '@/components/table.vue'
import confirm from '@/utils/confirm'
import message from '@/utils/message'
import SendMessage from './send-message.vue'
import { loadUserList, updateUserStatus } from '@/model/api'

const { proxy } = getCurrentInstance()

// 列的信息
const columns = [
  {
    label: '头像',
    prop: 'avatar',
    width: 150,
    scopedSlots: 'avatar'
  },
  {
    label: '昵称',
    prop: 'nickName',
    width: 150,
    scopedSlots: 'nickName'
  },
  {
    label: '邮箱',
    prop: 'email',
    width: 180
  },
  {
    label: '个人描述',
    prop: 'personDescription'
  },
  {
    label: '加入时间',
    prop: 'joinTime',
    width: 200
  },
  {
    label: '登录信息',
    prop: 'lastLoginTime',
    width: 260,
    scopedSlots: 'loginInfo'
  },
  {
    label: '积分',
    prop: 'totalIntegral',
    width: 150,
    scopedSlots: 'integral'
  },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    width: 60,
    scopedSlots: 'status'
  },
  {
    label: '操作',
    prop: 'op',
    width: 100,
    align: 'center',
    scopedSlots: 'op'
  }
]
const formData = ref({})

const tableData = ref({})
const tableOptions = ref({
  selectType: 'checkbox',
  extHeight: 45
})

// 批量选择
const selectBatchList = ref([])
// 设置行多选
function setRowSelected (rows) {
  selectBatchList.value = []
  rows.forEach(i => {
    selectBatchList.value.push(i.commentId)
  })
}

async function loadDataList () {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize
  }
  Object.assign(params, formData.value)

  let result = await loadUserList(params)

  if (!result) return
  tableData.value = result.data
}

function handleUpdateUserStatus (data) {
  const title = data.status === 1 ? '禁用' : '启用'
  confirm(`你确定要将【${data.nickName}】用户${title}吗？`, async () => {
    let result = await updateUserStatus({
      userId: data.userId,
      status: data.status === 1 ? 0 : 1
    })
    if (!result) return
    message.success('操作成功！')
    loadDataList()
  })
}

// 发送系统消息
const sendMessageRef = ref()
function sendMessage (row) {
  sendMessageRef.value.handleSendMessage(row)
}
</script>

<style lang="scss">
.op {
  cursor: pointer;
}
</style>
