<template>
  <div>
    <div class="top-panel">
      <el-button
        type="primary"
        :style="{ 'margin-left': '10px' }"
        @click="showEdit('add', 0)"
        >新增板块</el-button
      >
    </div>
    <el-row :gutter="10" :style="{ 'margin-top': '10px' }">
      <el-col :span="14">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>一级板块</span>
            </div>
          </template>
          <Table
            ref="table"
            :columns="columns"
            :show-pagination="false"
            :data-source="tableData"
            :fetch="loadDataList"
            :options="tableOptions"
            @rowClick="rowClick"
          >
            <!-- 封面 -->
            <template #cover="{ index, row }">
              <Cover :cover="row.cover"></Cover>
            </template>

            <!-- 板块信息 -->
            <template #boardInfo="{ index, row }">
              <div>板块名称：{{ row.boardName }}</div>
              <div>发帖权限：{{ postTypeMap[row.postType] }}</div>
            </template>

            <!-- 操作 -->
            <template #op="{ index, row }">
              <div class="op">
                <el-button
                  type="primary"
                  link
                  @click="showEdit('update', 0, row)"
                  >修改</el-button
                >
                <el-divider direction="vertical"></el-divider>
                <el-button type="primary" link @click="del(row)"
                  >删除</el-button
                >
                <el-divider direction="vertical"></el-divider>
                <el-button
                  type="primary"
                  link
                  :class="[index === 0 ? 'not-allow' : '']"
                  @click="changeSort(index, 'up', 1)"
                  >上移</el-button
                >
                <el-divider direction="vertical"></el-divider>
                <el-button
                  type="primary"
                  link
                  :class="[
                    index === tableData.list.length - 1 ? 'not-allow' : ''
                  ]"
                  @click="changeSort(index, 'down', 1)"
                  >下移</el-button
                >
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>二级板块</span>
              <el-button type="primary" link @click="showEdit('add', 1)"
                >新增二级板块</el-button
              >
            </div>
          </template>
          <Table
            ref="SecondTable"
            :columns="columns"
            :show-pagination="false"
            :data-source="SecondTableData"
            :options="tableOptions"
          >
            <!-- 封面 -->
            <template #cover="{ index, row }">
              <Cover :cover="row.cover"></Cover>
            </template>

            <!-- 板块信息 -->
            <template #boardInfo="{ index, row }">
              <div>板块名称：{{ row.boardName }}</div>
              <div>发帖权限：{{ postTypeMap[row.postType] }}</div>
            </template>

            <!-- 操作 -->
            <template #op="{ index, row }">
              <div class="op">
                <el-button
                  type="primary"
                  link
                  @click="showEdit('update', 1, row)"
                  >修改</el-button
                >
                <el-divider direction="vertical"></el-divider>
                <el-button type="primary" link @click="del(row)"
                  >删除</el-button
                >
                <el-divider direction="vertical"></el-divider>
                <el-button
                  type="primary"
                  link
                  :class="[index === 0 ? 'not-allow' : '']"
                  @click="changeSort(index, 'up', 1)"
                  >上移</el-button
                >
                <el-divider direction="vertical"></el-divider>
                <el-button
                  type="primary"
                  link
                  :class="[
                    index === tableData.list.length - 1 ? 'not-allow' : ''
                  ]"
                  @click="changeSort(index, 'down', 1)"
                  >下移</el-button
                >
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
    </el-row>
    <BoardForm
      v-model:visible="boardFormVisible"
      :data="boardObject"
      :currentBoard="currentBoard"
    ></BoardForm>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick } from 'vue'
import Table from '@/components/table.vue'
import Cover from '@/components/cover.vue'
import BoardForm from './board-form.vue'
import { loadBoard } from '@/model/api'

const columns = [
  {
    label: '封面',
    prop: 'cover',
    width: 100,
    scopedSlots: 'cover'
  },
  {
    label: '板块信息',
    prop: 'boardName',
    width: 240,
    scopedSlots: 'boardInfo'
  },
  {
    label: '简介',
    prop: 'boardDesc'
  },
  {
    label: '操作',
    prop: 'op',
    width: 250,
    align: 'center',
    scopedSlots: 'op'
  }
]

// 发帖权限map对象
const postTypeMap = {
  0: '只允许管理员发帖',
  1: '任何人可以发帖'
}

// 一级板块数据
const tableData = ref({})
const tableOptions = {
  extHeight: 100
}

// 二级板块数据
const SecondTableData = ref({})

// 当前操作的行
const currentBoard = ref(null)
const table = ref()
async function loadDataList () {
  let result = await loadBoard()
  if (!result) return

  tableData.value.list = result.data
  if (currentBoard.value === null && result.data.length > 0) {
    // currentBoard.value = result.data[0]
    rowClick(result.data[0])
  } else {
    rowClick(currentBoard.value)
  }
  // 设置行选中 进入页面选中第一行
  nextTick(() => {
    table.value.setCurrentRow('boardId', currentBoard.value.boardId)
  })
}

function rowClick (row) {
  currentBoard.value = row // 记住当前操作的行
  SecondTableData.value.list = row.children
}

// 新增 | 修改
const boardFormVisible = ref(false)
const boardObject = ref({})
function showEdit (type, boardType, data) {
  boardFormVisible.value = true
  boardObject.value = {
    type,
    boardType,
    data
  }
}
</script>

<style lang="scss">
.not-allow {
  cursor: not-allowed;
  span {
    color: #ddd;
  }
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
