<template>
  <div>
    <div class="top-panel">
      <el-form :model="formData" label-width="60px" @submit.prevent>
        <el-row>
          <el-col :span="4">
            <el-form-item label="内容">
              <el-input
                clearable
                placeholder="支持模糊搜索"
                v-model.trim="formData.contentFuzzy"
                @keyup.native="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
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
            <el-form-item label="状态">
              <el-select
                clearable
                placeholder="请选择状态"
                v-model="formData.status"
                :style="{ width: '100%' }"
              >
                <el-option :value="-1" label="已删除"></el-option>
                <el-option :value="0" label="待审核"></el-option>
                <el-option :value="1" label="已审核"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :style="{ 'padding-left': '20px' }">
            <el-button-group>
              <el-button type="primary" @click="loadDataList">搜索</el-button>
              <el-button type="success" @click="auditBatch">批量审批</el-button>
              <el-button type="danger" @click="delBatch">批量删除</el-button>
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
        <!-- 用户信息 -->
        <template #userInfo="{ index, row }">
          <div class="user-info">
            <Avatar :userId="row.userId" :width="50"></Avatar>
            <div class="name-info">
              <div>
                <a
                  :href="`${proxy.globalInfo.webDomain}user/${row.userId}`"
                  target="_blank"
                  >{{ row.nickName }}</a
                >
              </div>
              <div>{{ row.userIpAddress }}</div>
            </div>
          </div>
        </template>

        <!-- 评论内容 -->
        <template #contentInfo="{ index, row }">
          <span>
            <a
              target="_blank"
              tag="a"
              :href="`${proxy.globalInfo.webDomain}post/${row.articleId}`"
              >查看文章</a
            >
          </span>
          <div v-html="row.content"></div>
          <div v-if="row.imgPath">
            <CommentImage
              :src="proxy.globalInfo.imageUrl + row.imgPath.replace('.', '_.')"
              :imgList="[proxy.globalInfo.imageUrl + row.imgPath]"
            ></CommentImage>
          </div>
        </template>

        <!-- 状态 -->
        <template #statusInfo="{ index, row }">
          <span v-if="row.status === -1" :style="{ color: '#e01d1d' }"
            >已删除</span
          >
          <span v-if="row.status === 0" :style="{ color: '#e01d1d' }"
            >待审核</span
          >
          <span v-if="row.status === 1" :style="{ color: '#68e068' }"
            >已审核</span
          >
        </template>

        <!-- 操作信息 -->
        <template #op="{ index, row }">
          <div class="op" v-if="row.status === 0 || row.status === 1">
            <el-dropdown trigger="hover">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleDelComment(row)"
                    >删除</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="row.status === 0"
                    @click="handleAudit(row)"
                    >审核</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import Table from '@/components/table.vue'
import CommentImage from './comment-image.vue'
import confirm from '@/utils/confirm'
import message from '@/utils/message'
import { loadCommentList, delComment, auditComment } from '@/model/api'

const { proxy } = getCurrentInstance()

const formData = ref({})
const table = ref()

// 列的信息
const columns = [
  {
    label: '用户信息',
    prop: 'avatar',
    width: 200,
    scopedSlots: 'userInfo'
  },
  {
    label: '评论内容',
    prop: 'content',
    scopedSlots: 'contentInfo'
  },
  {
    label: '点赞',
    width: 150,
    align: 'center',
    prop: 'goodCount'
  },
  {
    label: '状态信息',
    prop: 'status',
    align: 'center',
    width: 200,
    scopedSlots: 'statusInfo'
  },
  {
    label: '发布时间',
    prop: 'postTime',
    align: 'center',
    width: 200
  },
  {
    label: '发布地址',
    prop: 'userIpAddress',
    align: 'center',
    width: 150
  },
  {
    label: '操作',
    prop: 'op',
    width: 100,
    align: 'center',
    scopedSlots: 'op'
  }
]
const tableData = ref({})
const tableOptions = ref({
  selectType: 'checkbox',
  extHeight: 45
})

async function loadDataList () {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize
  }
  Object.assign(params, formData.value)

  let result = await loadCommentList(params)

  if (!result) return
  tableData.value = result.data
}

function handleDelComment (data) {
  confirm(`你确定要删除评论吗？`, async () => {
    let result = await delComment({
      commentIds: data.commentId
    })
    if (!result) return
    message.success('操作成功！')
    loadDataList()
  })
}

function handleAudit (data) {
  confirm(`你确定要审核【${data.title}】吗？`, async () => {
    let result = await auditComment({
      commentIds: data.commentId
    })
    if (!result) return
    message.success('操作成功！')
    loadDataList()
  })
}

// 批量选择
const selectBatchList = ref([])
// 设置行多选
function setRowSelected (rows) {
  selectBatchList.value = []
  rows.forEach(i => {
    selectBatchList.value.push(i.commentId)
  })
}
// 批量操作
function auditBatch () {
  confirm('你确定要批量审核吗？', async () => {
    let result = await auditComment({
      commentIds: selectBatchList.value.join(',')
    })
    if (!result) return
    message.success('操作成功！')
    table.value.clearSelection()
    loadDataList()
  })
}
function delBatch () {
  confirm('你确定要批量删除吗？', async () => {
    let result = await delComment({
      commentIds: selectBatchList.value.join(',')
    })
    if (!result) return
    message.success('操作成功！')
    table.value.clearSelection()
    loadDataList()
  })
}
</script>

<style lang="scss">
.data-list {
  .user-info {
    display: flex;
    align-items: center;
    .name-info {
      margin-left: 5px;
      font-size: 13px;
    }
  }
  .op {
    .iconfont {
      cursor: pointer;
    }
  }
  .a-link {
    color: var(--link);
    cursor: pointer;
  }
}
</style>
