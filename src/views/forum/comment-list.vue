<template>
  <div class="comment-body">
    <div class="comment-title">
      <div class="title">
        评论<span class="count">{{ commentListInfo.totalCount }}</span>
      </div>
      <div class="tab">
        <span
          @click="orderTypeChange(0)"
          :class="[orderType === 0 ? 'active' : '']"
          >最热</span
        >
        <el-divider direction="vertical"></el-divider>
        <span
          @click="orderTypeChange(1)"
          :class="[orderType === 1 ? 'active' : '']"
          >最新</span
        >
      </div>
    </div>
    <!-- 发送评论 -->
    <div class="comment-form-panel">
      <CommentPost
        :avatar-width="50"
        :p-comment-id="0"
        :article-id="articleId"
        :user-id="currentUserInfo.userId"
        :show-insert-img="currentUserInfo.userId !== null"
        @post-comment-finish="postCommentFinish"
      ></CommentPost>
    </div>
    <div class="comment-list">
      <DataList
        :data-source="commentListInfo"
        :loading="loading"
        @load-data="loadComments"
        empty-msg="暂无评论，快来抢沙发吧"
      >
        <template #default="{ data }">
          <CommentListItem
            :comment-data="data"
            :article-id="articleId"
            :article-user-id="articleUserId"
            :current-user-id="currentUserInfo.userId"
            @hidden-other-reply="handleHiddenOtherReply"
            @reload-data="loadComments"
          ></CommentListItem>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import store from '@/store'
import { ref, watch } from 'vue'
import { loadComment } from '@/model/api.js'
import DataList from '@/components/data-list.vue'
import CommentListItem from './comment-list-item.vue'
import CommentPost from './comment-post.vue'

const props = defineProps({
  articleId: {
    type: String
  },
  articleUserId: {
    type: String
  }
})

const emit = defineEmits(['updateCommentCount'])
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

  let result = await loadComment(params, false)
  loading.value = false

  if (!result) return

  commentListInfo.value = result.data
}

loadComments()

// 隐藏其他评论框
function handleHiddenOtherReply () {
  commentListInfo.value.list.forEach(item => {
    item.showReply = false
  })
}

// 评论发表完成
function postCommentFinish (data) {
  // 给当前评论列表 前面添加刚发布的评论
  commentListInfo.value.list.unshift(data)
  // 更新评论数量
  const totalCount = commentListInfo.value.totalCount + 1
  commentListInfo.value.totalCount = totalCount
  emit('updateCommentCount', totalCount)
}

// 排序
function orderTypeChange (type) {
  orderType.value = type
  loadComments()
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
      .active {
        color: var(--link);
      }
    }
  }
  .comment-form-panel {
    margin-top: 10px;
  }
}
</style>
