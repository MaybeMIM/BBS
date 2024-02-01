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
            {{ data.content }}
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

<style lang="scss">
.message-center {
  .message-nav {
    font-size: initial;
    color: #c4c4c4;
    line-height: 35px;
    .icon-right {
      padding: 0 5px;
    }
  }
  .message-panel {
    background: #fff;
    padding: 10px;
    margin-top: 5px;
    .tab-list {
      position: relative;
      .tag-item {
        position: relative;
        padding: 0 10px;
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
          background: #f56c6c;
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
}
</style>
