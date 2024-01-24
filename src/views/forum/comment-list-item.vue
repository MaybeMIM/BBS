<template>
  <div class="comment-item">
    <Avatar :userId="commentData.userId" :width="50"></Avatar>
    <div class="comment-info">
      <div class="nick-name">
        <span class="name">{{ commentData.nickName }}</span>
        <span class="tag-author" v-if="commentData.userId === articleUserId"
          >作者</span
        >
      </div>
      <div class="comment-content">
        <span v-html="commentData.content"></span>
      </div>
      <div class="op-panel">
        <div class="time">
          <span>{{ commentData.postTime }}</span>
          <span class="address"
            >&nbsp;·&nbsp;{{ commentData.userIpAddress }}</span
          >
        </div>
        <div class="iconfont icon-good">
          {{ commentData.goodCount > 0 ? commentData.goodCount : '点赞' }}
        </div>
        <div
          class="iconfont icon-comment"
          @click="showReplayPanel(commentData)"
        >
          回复
        </div>
        <el-dropdown v-if="articleUserId === currentUserId">
          <div class="iconfont icon-more"></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                {{ commentData.topType === 0 ? '设为置顶' : '取消置顶' }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="replay-info" v-if="commentData.showReplay">
        <PostComment
          :avatar-width="30"
          :article-id="articleId"
          :user-id="currentUserId"
          :p-comment-id="pCommentId"
          :replay-user-id="replayUserId"
          :show-insert-img="false"
          @post-comment-finish="postCommentFinish"
        ></PostComment>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import PostComment from './post-comment.vue'

const props = defineProps({
  articleId: String,
  commentData: Object,
  articleUserId: String,
  currentUserId: String
})

const emit = defineEmits(['hiddenOtherReplay'])

// 回复评论的 父级Id
const pCommentId = ref(0)
// 回复其他人的 Id
const replayUserId = ref(null)
// 展示评论框
function showReplayPanel (curData) {
  // 先缓存起来 不会因为触发emit而改变
  const cache = curData.showReplay === undefined ? false : curData.showReplay

  // 先关闭其他评论框 再展示当前评论框
  emit('hiddenOtherReplay')
  curData.showReplay = !cache
  // 点击回复之后 当前的id就是父级id
  pCommentId.value = curData.commentId
}

function postCommentFinish (resultData) {
  const children = props.commentData.children || []
  children.unshift(resultData)
}
</script>

<style lang="scss">
.comment-item {
  display: flex;
  padding-top: 15px;

  .comment-info {
    flex: 1;
    margin-left: 10px;
    border-bottom: 1px solid #656564;
    padding-bottom: 15px;
    .nick-name {
      .name {
        font-size: 14px;
        color: #958e85;
        margin-right: 10px;
        cursor: pointer;
      }
      .tag-author {
        background: var(--pink);
        font-size: 12px;
        color: #fff;
        border-radius: 2px;
      }
    }
    .comment-content {
      margin-top: 6px;
      font-size: 15px;
      line-height: 22px;
    }
    .op-panel {
      display: flex;
      margin-top: 5px;
      font-size: 13px;
      align-items: center;
      color: #958e85;
      .time {
        margin-right: 20px;
      }
      .iconfont {
        margin-right: 15px;
        font-size: 14px;
        cursor: pointer;
        &::before {
          margin-right: 3px;
        }
      }
    }
    .replay-info {
      margin-top: 10px;
    }
  }
}
</style>
