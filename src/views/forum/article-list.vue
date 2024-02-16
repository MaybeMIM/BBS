<template>
  <div>
    <!-- 搜索区域 -->
    <div class="top-panel">
      <el-form :model="formData" label-width="60px" @submit.prevent>
        <el-row>
          <el-col :span="4">
            <el-form-item label="标题" prop="titleFuzzy">
              <el-input
                clearable
                placeholder="请输入标题"
                v-model.trim="formData.titleFuzzy"
                @keyup.native="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="昵称" prop="nickNameFuzzy">
              <el-input
                clearable
                placeholder="请输入昵称"
                v-model.trim="formData.nickNameFuzzy"
                @keyup.native="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="板块" prop="board">
              <el-cascader
                clearable
                placeholder="请输入板块"
                :options="boardList"
                :props="boardProps"
                v-model="formData.boardIds"
                :style="{ width: '100%' }"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="附件" prop="attachment">
              <el-select
                clearable
                placeholder="请选择附件"
                v-model="formData.attachmentType"
                :style="{ width: '100%' }"
              >
                <el-option :value="1" label="有附件"></el-option>
                <el-option :value="0" label="无附件"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态" prop="status">
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
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="置顶" prop="topType">
              <el-select
                clearable
                placeholder="请选择"
                v-model="formData.topType"
                :style="{ width: '100%' }"
              >
                <el-option :value="0" label="未置顶"></el-option>
                <el-option :value="1" label="已置顶"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :style="{ 'padding-left': '20px' }">
            <el-button-group>
              <el-button type="primary" @click="loadDataList">搜索</el-button>
              <el-button
                type="success"
                @click="auditBatch"
                :disabled="selectBatchList.length === 0"
                >批量审批</el-button
              >
              <el-button
                type="danger"
                @click="delBatch"
                :disabled="selectBatchList.length === 0"
                >批量删除</el-button
              >
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
                  :href="`${proxy.globalInfo.webDomain}/user/${row.userId}`"
                  target="_blank"
                  >{{ row.nickName }}</a
                >
              </div>
              <div>{{ row.userIpAddress }}</div>
            </div>
          </div>
        </template>

        <!-- 封面 -->
        <template #cover="{ index, row }">
          <Cover :cover="row.cover"></Cover>
        </template>

        <!-- 标题 -->
        <template #titleInfo="{ index, row }">
          <a
            target="_blank"
            tag="a"
            :href="`${proxy.globalInfo.webDomain}post/${row.articleId}`"
            >{{ row.title }}</a
          >
        </template>

        <!-- 板块 -->
        <template #boardInfo="{ index, row }">
          <div>
            <span>{{ row.pBoardName }}</span>
            <span v-if="row.boardName">{{ row.boardName }}</span>
          </div>
        </template>

        <!-- 互动信息 -->
        <template #interactionInfo="{ index, row }">
          <div>阅读: {{ row.readCount }}</div>
          <div>点赞: {{ row.goodCount }}</div>
          <div>
            评论: <span>{{ row.commentCount }}</span
            ><span
              class="a-link"
              v-if="row.commentCount"
              :style="{ 'margin-left': '5px' }"
              @click="showComment(row.articleId)"
              >查看</span
            >
          </div>
        </template>

        <!-- 附件 -->
        <template #attachmentInfo="{ index, row }">
          <div v-if="row.attachmentType === 0">无附件</div>
          <div v-if="row.attachmentType === 1">
            <span
              class="a-link"
              @click="showAttachment(row.nickName, row.articleId)"
              >查看附件</span
            >
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
          <div v-if="row.topType === 1" :style="{ color: '#68e068' }">
            已置顶
          </div>
          <div v-if="row.topType === 0" :style="{ color: '#68e068' }">
            未置顶
          </div>
        </template>

        <!-- 操作信息 -->
        <template #op="{ index, row }">
          <div class="op" v-if="row.status !== -1">
            <el-dropdown trigger="hover">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="updateBoard(row)"
                    >修改板块</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="row.topType === 1 && row.status === 1"
                    @click="handleTopArticle(row)"
                    >取消置顶</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="row.topType === 0 && row.status === 1"
                    @click="handleTopArticle(row)"
                    >置顶</el-dropdown-item
                  >
                  <el-dropdown-item @click="handleDelArticle(row)"
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
    <!-- 修改板块 -->
    <ArticleBoard ref="articleBoard" @reload="loadDataList"></ArticleBoard>
    <!-- 附件信息 -->
    <ArticleAttachment ref="attachment"></ArticleAttachment>
    <!-- 查看评论 -->
    <ArticleComment ref="articleComment"></ArticleComment>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import Table from '@/components/table.vue'
import Cover from '@/components/cover.vue'
import confirm from '@/utils/confirm'
import message from '@/utils/message'
import ArticleBoard from './article-board.vue'
import ArticleAttachment from './article-attachment.vue'
import ArticleComment from './article-comment.vue'
import {
  loadArticle,
  loadBoard,
  auditArticle,
  topArticle,
  delArticle
} from '@/model/api'

const { proxy } = getCurrentInstance()

// 列的信息
const columns = [
  {
    label: '用户信息',
    prop: 'avatar',
    width: 200,
    scopedSlots: 'userInfo'
  },
  {
    label: '封面',
    prop: 'cover',
    width: 120,
    scopedSlots: 'cover'
  },
  {
    label: '标题',
    scopedSlots: 'titleInfo'
  },
  {
    label: '板块',
    width: 200,
    scopedSlots: 'boardInfo'
  },
  {
    label: '互动信息',
    width: 150,
    scopedSlots: 'interactionInfo'
  },
  {
    label: '是否有附件',
    prop: 'attachment',
    align: 'center',
    width: 100,
    scopedSlots: 'attachmentInfo'
  },
  {
    label: '状态信息',
    prop: 'status',
    align: 'center',
    width: 120,
    scopedSlots: 'statusInfo'
  },
  {
    label: '发布时间',
    prop: 'postTime',
    align: 'center',
    width: 180
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
  extHeight: 90
})
async function loadDataList () {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize
  }
  Object.assign(params, formData.value)

  // 选了一级分类 / 选二级分类
  if (params.boardIds && params.boardIds.length === 1) {
    params.pBoardId = params.boardIds[0]
  } else if (params.boardIds && params.boardIds.length === 2) {
    params.pBoardId = params.boardIds[0]
    params.boardId = params.boardIds[1]
  }
  delete params.boardIds

  let result = await loadArticle(params)

  if (!result) return
  tableData.value = result.data
}

// 板块信息
const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: 'boardId',
  label: 'boardName'
}
const boardList = ref([])

async function loadBoardList () {
  let result = await loadBoard()

  if (!result) return
  boardList.value = result.data
}

// 修改板块
const articleBoard = ref()
function updateBoard (data) {
  articleBoard.value.showUpdateBoard(data)
}

// 批量选择
const selectBatchList = ref([])
// 设置行多选
function setRowSelected (rows) {
  selectBatchList.value = []
  rows.forEach(i => {
    selectBatchList.value.push(i.articleId)
  })
}

const table = ref()
// 批量操作
function auditBatch () {
  confirm('你确定要批量审核吗？', async () => {
    let result = await auditArticle({
      articleIds: selectBatchList.value.join(',')
    })
    if (!result) return
    message.success('操作成功！')
    table.value.clearSelection()
    loadDataList()
  })
}
function delBatch () {
  confirm('你确定要批量删除吗？', async () => {
    let result = await delArticle({
      articleIds: selectBatchList.value.join(',')
    })
    if (!result) return
    message.success('操作成功！')
    table.value.clearSelection()
    loadDataList()
  })
}

// 审批、删除
function handleAudit (data) {
  confirm(`你确定要审核【${data.title}】吗？`, async () => {
    let result = await auditArticle({
      articleIds: data.articleId
    })
    if (!result) return
    message.success('操作成功！')
    loadDataList()
  })
}
function handleDelArticle (data) {
  confirm(`你确定要删除【${data.title}】吗？`, async () => {
    let result = await delArticle({
      articleIds: data.articleId
    })
    if (!result) return
    message.success('操作成功！')
    loadDataList()
  })
}
function handleTopArticle (data) {
  const opName = data.topType === 0 ? '设为置顶' : '取消置顶'
  confirm(`你确定要将【${data.title}】${opName}吗？`, async () => {
    let result = await topArticle({
      topType: data.topType === 0 ? 1 : 0,
      articleId: data.articleId
    })
    if (!result) return
    message.success('操作成功！')
    loadDataList()
  })
}

// 查看附件
const attachment = ref()
function showAttachment (nickName, articleId) {
  attachment.value.show(nickName, articleId)
}
// 查看评论
const articleComment = ref()
function showComment (articleId) {
  articleComment.value.show(articleId)
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
