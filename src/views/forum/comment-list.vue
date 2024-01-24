<template>
  <div class="comment-body">
    <div class="comment-title">
      <div class="title">
        评论<span class="count">{{ 0 }}</span>
      </div>
      <div class="tab">
        <span>最热</span>
        <el-divider direction="vertical"></el-divider>
        <span>最新</span>
      </div>
    </div>
    <!-- 发送评论 -->
    <div class="comment-form-panel">
      <PostComment
        :avatar-width="50"
        :p-comment-id="0"
        :article-id="articleId"
        :user-id="currentUserInfo.userId"
        :show-insert-img="currentUserInfo.userId !== null"
        @post-comment-finish="postCommentFinish"
      ></PostComment>
    </div>
    <div class="comment-list">
      <DataList
        :data-source="commentListInfo"
        :loading="loading"
        @load-data="loadComments"
      >
        <template #default="{ data }">
          <CommentListItem
            :comment-data="data"
            :article-id="articleId"
            :article-user-id="articleUserId"
            :current-user-id="currentUserInfo.userId"
            @hidden-other-replay="handleHiddenOtherReplay"
          ></CommentListItem>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import store from '@/store'
import { ref, watch, onMounted } from 'vue'
import { loadComment } from '@/model/api.js'
import DataList from '@/components/data-list.vue'
import CommentListItem from './comment-list-item.vue'
import PostComment from './post-comment.vue'

const props = defineProps({
  articleId: {
    type: String
  },
  articleUserId: {
    type: String
  }
})

// 评论列表
const commentListInfo = ref([])

// 排序
const orderType = ref(0)

const loading = ref(false)

// 当前用户信息
const currentUserInfo = ref({})
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = newVal || {}
  },
  { immediate: true, deep: true }
)

// 评论列表
async function loadComments () {
  loading.value = true
  const params = {
    pageNo: commentListInfo.value.pageNo,
    articleId: props.articleId,
    orderType: orderType.value
  }

  let result = await loadComment(params)
  loading.value = false

  if (!result) return

  commentListInfo.value = result.data
}

loadComments()

// 隐藏其他评论框
function handleHiddenOtherReplay () {
  commentListInfo.value.list.forEach(item => {
    item.showReplay = false
  })
}

// 评论发表完成
function postCommentFinish (data) {
  // 给当前评论列表 前面添加刚发布的评论
  commentListInfo.value.list.unshift(data)
}
</script>

<style lang="scss" scoped>
.comment-body {
  .comment-title {
    display: flex;
    align-items: center;
    color: #c4c4c4;
    .count {
      font-size: 14px;
      padding: 0 10px;
    }
    .tab {
      margin-left: 10px;
      span {
        cursor: pointer;
      }
    }
  }
  .comment-form-panel {
    margin-top: 10px;
  }
}
</style>
