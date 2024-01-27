<template>
  <div class="comment-item">
    <Avatar :userId="commentData.userId" :width="50"></Avatar>
    <div class="comment-info">
      <div class="nick-name">
        <span class="name" @click="gotoUCenter(commentData.userId)">{{
          commentData.nickName
        }}</span>
        <span class="tag-author" v-if="commentData.userId === articleUserId"
          >作者</span
        >
      </div>
      <!-- 内容 -->
      <div class="comment-content">
        <div v-html="commentData.content"></div>
        <!-- 带有_的为缩略图 -->
        <CommentImage
          :style="{ 'margin-top': '10px' }"
          v-if="commentData.imgPath"
          :src="
            proxy.globalInfo.imageUrl + commentData.imgPath.replace('.', '_.')
          "
          :img-list="[proxy.globalInfo.imageUrl + commentData.imgPath]"
        ></CommentImage>
      </div>

      <!-- 其他信息面板 -->
      <div class="op-panel">
        <div class="time">
          <span>{{ commentData.postTime }}</span>
          <span class="address"
            >&nbsp;·&nbsp;{{ commentData.userIpAddress }}</span
          >
        </div>
        <div
          :class="[
            'iconfont icon-good',
            commentData.likeType === 1 ? 'active' : ''
          ]"
          @click="doLike(commentData)"
        >
          {{ commentData.goodCount > 0 ? commentData.goodCount : '点赞' }}
        </div>
        <div
          class="iconfont icon-comment"
          @click="showReplyPanel(commentData, 0)"
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

      <!-- 子评论 -->
      <div class="comment-sub-list" v-if="commentData.children">
        <div class="comment-sub-item" v-for="sub in commentData.children">
          <Avatar :userId="sub.userId" :width="30"></Avatar>
          <div class="comment-sub-info">
            <div class="nick-name">
              <span class="name" @click="gotoUCenter(sub.userId)">{{
                commentData.nickName
              }}</span>
              <span class="tag-author" v-if="sub.userId === articleUserId"
                >作者</span
              >
              <span>回复</span>
              <span class="reply-name" @click="gotoUCenter(sub.replyUserId)"
                >@{{ sub.replyNickName }}</span
              >：
              <span class="sub-content" v-html="sub.content"></span>
            </div>
            <div class="op-panel">
              <div class="time">
                <span>{{ sub.postTime }}</span>
                <span class="address"
                  >&nbsp;·&nbsp;{{ sub.userIpAddress }}</span
                >
              </div>
              <div
                :class="[
                  'iconfont icon-good',
                  sub.likeType === 1 ? 'active' : ''
                ]"
                @click="doLike(sub)"
              >
                {{ sub.goodCount > 0 ? sub.goodCount : '点赞' }}
              </div>
              <div
                class="iconfont icon-comment"
                @click="showReplyPanel(sub, 1)"
              >
                回复
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="reply-info" v-if="commentData.showReply">
        <CommentPost
          :avatar-width="30"
          :article-id="articleId"
          :user-id="currentUserId"
          :p-comment-id="pCommentId"
          :reply-user-id="replyUserId"
          :show-insert-img="false"
          :autofocus="autofocus"
          :placeholderInfo="placeholderInfo"
          @post-comment-finish="postCommentFinish"
        ></CommentPost>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import CommentPost from './comment-post.vue'
import CommentImage from './comment-image.vue'
import { commentDoLike } from '@/model/api'

const { proxy } = getCurrentInstance()

const router = useRouter()

const props = defineProps({
  articleId: String,
  commentData: Object,
  articleUserId: String,
  currentUserId: String
})

// 点击 回复 自动获取文本框焦点
const autofocus = ref(false)

const emit = defineEmits(['hiddenOtherReply'])

// 回复的默认文本
const placeholderInfo = ref(null)

// 回复评论的 父级Id
const pCommentId = ref(0)
// 回复其他人的 Id
const replyUserId = ref(null)

// 展示评论框
function showReplyPanel (curData, type) {
  // 先缓存起来 不会因为触发emit而改变
  const cache =
    props.commentData.showReply === undefined
      ? false
      : props.commentData.showReply

  autofocus.value = !autofocus.value
  // 先关闭其他评论框 再展示当前评论框
  emit('hiddenOtherReply')
  if (type === 0) {
    props.commentData.showReply = !cache
  } else {
    props.commentData.showReply = true
  }
  // 点击回复之后 当前的id就是父级id
  pCommentId.value = props.commentData.commentId
  replyUserId.value = curData.userId
  placeholderInfo.value = `回复 @${curData.nickName}:`
}

function postCommentFinish (resultData) {
  // 一级评论 接口是返回当前的评论对象 二级评论则返回该评论下所有子评论的一个数组
  props.commentData.children = resultData
  props.commentData.showReply = false
}

// 点击名称跳转
function gotoUCenter (userId) {
  router.push(`/user/${userId}`)
}

// 点赞
async function doLike (data) {
  const commentId = data.commentId
  let result = await commentDoLike({ commentId })

  if (!result) return

  data.goodCount = result.data.goodCount
  data.likeType = result.data.likeType
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
        &:hover {
          color: #03a3ff;
        }
      }
      .tag-author {
        background: var(--pink);
        font-size: 12px;
        color: #fff;
        border-radius: 2px;
      }
    }
    .comment-content {
      margin-top: 2px;
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
      .active {
        color: var(--link);
      }
    }
    .comment-sub-list {
      margin-top: 10px;
      .comment-sub-item {
        display: flex;
        margin: 10px 0;
        font-size: 14px;
      }
      .comment-sub-info {
        margin-left: 5px;
        .nick-name {
          .reply-name {
            margin-left: 5px;
            cursor: pointer;
            color: #03a3ff;
          }
          .sub-content {
            font-size: 15px;
          }
        }
      }
    }
    .reply-info {
      margin-top: 10px;
    }
  }
}
</style>
