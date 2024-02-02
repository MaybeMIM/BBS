<template>
  <div
    class="container-body message-center"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="message-nav">
      <router-link to="/">首页</router-link>
      <span class="iconfont icon-right"></span>
      <span>消息中心</span>
    </div>
    <div class="message-panel">
      <div class="tab-list">
        <el-tabs :model-value="activeTabName" @tab-change="changeTab">
          <el-tab-pane name="reply">
            <template #label>
              <div class="tag-item">
                <span>回复我的</span>
                <span class="count-tag" v-if="messageCountInfo.reply">{{
                  messageCountInfo.reply > 99 ? '99+' : messageCountInfo.reply
                }}</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="likePost">
            <template #label>
              <div class="tag-item">
                <span>赞了我的文章</span>
                <span class="count-tag" v-if="messageCountInfo.likePost">{{
                  messageCountInfo.likePost > 99
                    ? '99+'
                    : messageCountInfo.likePost
                }}</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="likeComment">
            <template #label>
              <div class="tag-item">
                <span>赞了我的评论</span>
                <span class="count-tag" v-if="messageCountInfo.likeComment">{{
                  messageCountInfo.likeComment > 99
                    ? '99+'
                    : messageCountInfo.likeComment
                }}</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="downloadAttachment">
            <template #label>
              <div class="tag-item">
                <span>下载了我的文章</span>
                <span
                  class="count-tag"
                  v-if="messageCountInfo.downloadAttachment"
                  >{{
                    messageCountInfo.downloadAttachment > 99
                      ? '99+'
                      : messageCountInfo.downloadAttachment
                  }}</span
                >
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="sys">
            <template #label>
              <div class="tag-item">
                <span>系统消息</span>
                <span class="count-tag" v-if="messageCountInfo.sys">{{
                  messageCountInfo.sys > 99 ? '99+' : messageCountInfo.sys
                }}</span>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
        <router-link :to="`/user/${userId}`" class="back-ucenter"
          >&lt;&lt;个人中心</router-link
        >
      </div>
      <div class="message-list">
        <DataList
          :loading="loading"
          :dataSource="messageListInfo"
          emptyMsg="暂无消息"
          @loadData="loadMessage"
        >
          <template #default="{ data }">
            <!-- 系统消息 -->
            <div class="message-item" v-if="data.messageType === 0">
              <div class="message-content">
                <span v-html="data.messageContent"></span>
                <span class="create-time">{{ data.createTime }}</span>
              </div>
            </div>
            <!-- 回复我的 -->
            <div class="message-item" v-if="data.messageType === 1">
              <avatar :userId="data.sendUserId" :width="50"></avatar>
              <div class="message-content">
                <div>
                  <router-link :to="`/user/${data.sendUserId}`"
                    >@{{ data.sendNickName }} </router-link
                  >&nbsp;&nbsp;对我的文章【<router-link
                    :to="`/post/${data.articleId}`"
                    >{{ data.articleTitle }}</router-link
                  >】发表了评论
                  <span class="create-time">{{ data.createTime }}</span>
                </div>
                <div class="reply-content" v-html="data.messageContent"></div>
              </div>
            </div>
            <!-- 赞了我的文章 -->
            <div class="message-item" v-if="data.messageType === 2">
              <avatar :userId="data.sendUserId" :width="50"></avatar>
              <div class="message-content">
                <div>
                  <router-link :to="`/user/${data.sendUserId}`"
                    >@{{ data.sendNickName }}</router-link
                  >&nbsp;&nbsp;赞了我的文章【<router-link
                    :to="`/post/${data.articleId}`"
                    >{{ data.articleTitle }}</router-link
                  >】
                  <span class="create-time">{{ data.createTime }}</span>
                </div>
              </div>
            </div>
            <!-- 赞了我的评论 -->
            <div class="message-item" v-if="data.messageType === 3">
              <avatar :userId="data.sendUserId" :width="50"></avatar>
              <div class="message-content">
                <div>
                  <router-link :to="`/user/${data.sendUserId}`"
                    >@{{ data.sendNickName }}</router-link
                  >&nbsp;&nbsp;在文章中【<router-link
                    :to="`/post/${data.articleId}`"
                    >{{ data.articleTitle }}</router-link
                  >】中赞了我的评论
                  <span class="create-time">{{ data.createTime }}</span>
                </div>
                <div class="reply-content" v-html="data.messageContent"></div>
              </div>
            </div>
            <!-- 下载了我的附件 -->
            <div class="message-item" v-if="data.messageType === 4">
              <avatar :userId="data.sendUserId" :width="50"></avatar>
              <div class="message-content">
                <div>
                  <router-link :to="`/user/${data.sendUserId}`"
                    >@{{ data.sendNickName }}</router-link
                  >&nbsp;&nbsp;在文章【<router-link
                    :to="`/post/${data.articleId}`"
                    >{{ data.articleTitle }}</router-link
                  >】中下载了我的附件
                  <span class="create-time">{{ data.createTime }}</span>
                </div>
              </div>
            </div>
          </template>
        </DataList>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadMessageList } from '@/model/api.js'
import DataList from '@/components/data-list.vue'
import store from '@/store'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const activeTabName = ref('reply')

const userId = ref(null)
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal) {
      userId.value = newVal.userId
    }
  },
  { immediate: true, deep: true }
)

// 消息数量
const messageCountInfo = ref({})
// 监听消息数量 同步消息中心与导航栏的消息两个消息的数量
watch(
  () => store.state.messageCountInfo,
  (newVal, oldVal) => {
    messageCountInfo.value = newVal || {}
  },
  { immediate: true, deep: true }
)

function changeTab (type) {
  router.push(`/user/message/${type}`)
}

// 获取消息数据
const messageListInfo = ref({})
// 监听跳转的消息类型
watch(
  () => route.params.type,
  (newVal, oldVal) => {
    if (newVal) {
      activeTabName.value = newVal
      loadMessage()
    }
  },
  { immediate: true, deep: true }
)

async function loadMessage () {
  if (loading.value) return
  loading.value = true

  let params = {
    pageNo: messageListInfo.value.pageNo,
    code: activeTabName.value
  }

  let result = await loadMessageList(params, false)

  loading.value = false
  if (!result) return

  messageListInfo.value = result.data
  // 切换 tabs 查看数据后 将该数据的消息数量清空
  store.commit('readMessage', activeTabName.value)
}
</script>

<style lang="scss" scoped>
.message-center {
  .message-nav {
    font-size: initial;
    color: var(--text1);
    line-height: 35px;
    .icon-right {
      padding: 0 5px;
    }
  }
  .message-panel {
    background: rgb(27, 29, 29);
    padding: 10px;
    margin-top: 5px;
    .tab-list {
      position: relative;
      .tag-item {
        position: relative;
        padding: 0 10px;
        color: var(--text1);
        .count-tag {
          position: absolute;
          display: inline-block;
          right: -15px;
          top: -10px;
          min-width: 25px;
          height: 20px;
          border-radius: 10px;
          margin-left: 8px;
          font-size: 12px;
          text-align: center;
          line-height: 20px;
          color: #fff;
          background: rgb(123, 14, 14);
        }
      }
      .back-ucenter {
        position: absolute;
        top: 5px;
        right: 0;
        font-size: 14px;
      }
    }
  }
  .message-list {
    .message-item {
      display: flex;
      font-size: 14px;
      align-items: center;
      border-bottom: 1px solid rgb(111, 103, 92);
      padding: 10px;
      .message-content {
        margin-left: 5px;
        .create-time {
          color: #c4c4c4;
          margin-left: 10px;
        }
        .reply-content {
          border-left: 2px solid #73c9ff;
          padding-left: 5px;
          margin-top: 5px;
        }
      }
      a {
        color: #59a0dc;
      }
    }
  }
}
</style>
