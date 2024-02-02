<template>
  <div
    class="container-body article-detail-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
    v-if="Object.keys(articleInfo).length > 0"
  >
    <!-- 板块信息 -->
    <div class="board-info">
      <router-link :to="`/forum/${articleInfo.pBoardId}`">{{
        articleInfo.pBoardName
      }}</router-link>
      <span class="iconfont icon-right"></span>
      <template v-if="articleInfo.boardId">
        <router-link
          :to="`/forum/${articleInfo.pBoardId}/${articleInfo.boardId}`"
          >{{ articleInfo.boardName }}</router-link
        >
        <span class="iconfont icon-right"></span>
      </template>
      <span>{{ articleInfo.title }}</span>
    </div>

    <!-- 标题、文章发表信息 -->
    <div
      class="detail-container"
      :style="{ width: proxy.globalInfo.bodyWidth - 300 + 'px' }"
    >
      <div class="article-detail">
        <div class="title">
          <span
            class="tag no-audit"
            v-if="articleInfo.status === 0"
            type="danger"
            >待审核</span
          >
          {{ articleInfo.title }}
        </div>
        <!-- 用户信息 -->
        <div class="user-info">
          <Avatar :userId="articleInfo.userId" :width="50"></Avatar>
          <div class="user-info-detail">
            <router-link
              :to="`/user/${articleInfo.userId}`"
              class="nick-name"
              >{{ articleInfo.nickName }}</router-link
            >
            <div class="time-info">
              <span>{{ articleInfo.postTime }}</span>
              <span class="address"
                >&nbsp;·&nbsp;{{ articleInfo.userIpAddress }}</span
              >
              <span class="iconfont icon-eye-solid">
                {{
                  articleInfo.readCount === 0 ? '阅读' : articleInfo.readCount
                }}
              </span>
              <!-- 编辑文章 只有当前用户为发布文章的作者才显示 -->
              <router-link
                v-if="articleInfo.userId == currentUserInfo.userId"
                class="a-link edit-btn"
                :to="`/editPost/${articleInfo.articleId}`"
                ><span class="iconfont icon-edit">编辑</span></router-link
              >
            </div>
          </div>
        </div>
        <!-- 详情 -->
        <div class="detail" id="detail" v-html="articleInfo.content"></div>
        <!-- 附件 -->
        <div class="attachment-panel" v-if="attachment" id="view-attachment">
          <div class="title">附件</div>
          <div class="attachment-info">
            <div class="iconfont icon-zip item"></div>
            <div class="file-name item">{{ attachment.fileName }}</div>
            <div class="size item">
              {{ utils.sizeToStr(attachment.fileSize) }}
            </div>
            <div class="item">
              需要<span class="integral">{{ attachment.integral }}</span
              >积分
            </div>
            <div class="download-count item">
              已下载{{ attachment.downloadCount }}次
            </div>
            <div class="download-btn item">
              <el-button
                type="primary"
                size="small"
                @click="downloadAttachment(attachment.fileId)"
                >下载</el-button
              >
            </div>
          </div>
        </div>
        <!-- 评论 -->
        <div
          class="comment-panel"
          id="view-comment"
          v-if="showComment && articleInfo.status === 1"
        >
          <CommentList
            v-if="articleInfo.articleId"
            :article-id="articleInfo.articleId"
            :article-user-id="articleInfo.userId"
            @updateCommentCount="updateCommentCount"
          ></CommentList>
        </div>
      </div>
    </div>
    <!-- 目录 -->
    <div class="toc-panel">
      <div class="top-container">
        <div class="toc-title">目录</div>
        <div class="toc-list">
          <template v-if="tocArray.length === 0">
            <div class="no-toc">未解析到目录</div>
          </template>
          <template v-else>
            <div v-for="toc in tocArray">
              <span
                :class="['toc-item', toc.id === activeAnchor ? 'active' : '']"
                :style="{ 'padding-left': toc.level * 10 + 'px' }"
                @click="gotoAnchor(toc.id)"
                >{{ toc.title }}</span
              >
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <!-- 左侧快捷操作 点赞、评论、附件-->
  <div class="quick-panel" :style="{ left: quickPanelLeft + 'px' }">
    <!-- 点赞 -->
    <el-badge
      :value="articleInfo.goodCount"
      type="info"
      :hidden="!articleInfo.goodCount > 0"
    >
      <div class="quick-item" @click="handleLike">
        <span :class="['iconfont icon-good', haveLike ? 'active' : '']"></span>
      </div>
    </el-badge>
    <!-- 评论 -->
    <el-badge
      v-if="showComment"
      :value="articleInfo.commentCount"
      type="info"
      :hidden="!articleInfo.commentCount > 0"
    >
      <div class="quick-item" @click="goToPosition('view-comment')">
        <span class="iconfont icon-comment"></span>
      </div>
    </el-badge>
    <!-- 附件 -->
    <div class="quick-item" @click="goToPosition('view-attachment')">
      <span class="iconfont icon-attachment"></span>
    </div>
    <!-- 图片预览 -->
    <ImageViewer ref="imageViewer" :imageList="previewImgList"></ImageViewer>
  </div>
</template>

<script setup>
import {
  ref,
  onUnmounted,
  getCurrentInstance,
  onMounted,
  nextTick,
  watch
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import confirm from '@/utils/confirm'
import { getArticleDetail, articleDoLike, getUserIntegral } from '@/model/api'
import utils from '@/utils/utils'
import store from '@/store'
import message from '@/utils/message'
import ImageViewer from '@/components/image-viewer.vue'
import CommentList from './comment-list.vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'

const { proxy } = getCurrentInstance()
const route = useRoute()

// 文章详情信息
const articleInfo = ref({})
const attachment = ref({})
// 是否点赞
const haveLike = ref(false)
async function getArticleDetails (articleId) {
  let result = await getArticleDetail({ articleId })

  if (!result) return

  articleInfo.value = result.data.forumArticle
  attachment.value = result.data.attachment
  haveLike.value = result.data.haveLike

  // 板块、列表变化
  store.commit('setActivePBoardId', result.data.forumArticle.pBoardId)
  store.commit('setActiveBoardId', result.data.forumArticle.boardId)

  // 图片预览
  imagePreview()
  // 代码高亮
  highLightCode()
  // 生成目录
  makeToc()
}

// 快捷操作的位置
const quickPanelLeft =
  (window.innerWidth - proxy.globalInfo.bodyWidth) / 2 - 120

function goToPosition (domId) {
  document.querySelector('#' + domId).scrollIntoView()
}

async function handleLike () {
  // 手动去拦截(需要登录状态) 不用请求一次后台才去响应 少一次后端请求
  if (!store.getters.getLoginUserInfo) {
    store.commit('showLogin', true)
    return
  }

  let result = await articleDoLike({ articleId: articleInfo.value.articleId })

  if (!result) return
  haveLike.value = !haveLike.value
  let goodCount = 1
  if (!haveLike.value) {
    goodCount = -1
  }
  articleInfo.value.goodCount = articleInfo.value.goodCount + goodCount
}

const currentUserInfo = ref({})
// 监听登录的用户信息 登录之后才会改变当前用户信息这个状态
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = newVal || {}
  },
  { immediate: true, deep: true }
)

// 下载附件
async function downloadAttachment (fileId) {
  if (!currentUserInfo.value) {
    store.commit('showLogin', true)
    return
  }
  // 附件需要 0 积分  当前用户等于发表文章作者 直接跳过
  if (
    attachment.value.integral === 0 ||
    currentUserInfo.value.userId === articleInfo.value.userId
  ) {
    download(fileId)
    return
  }
  // 获取用户积分
  let result = await getUserIntegral({ fileId })
  if (!result) return

  // 判断用户是否下载过
  if (result.data.haveDownload) {
    return download(fileId)
  }
  // 积分不够 并且 不是自己的文章
  if (result.data.userIntegral < attachment.value.integral) {
    return message.warning('积分不够，无法下载')
  }

  confirm(
    `你还有${result.data.userIntegral}积分,当前下载会扣除${attachment.value.integral}积分，确认要下载吗？`,
    () => {
      download(fileId)
    }
  )
}

function download (fileId) {
  document.location.href = '/api/forum/attachmentDownload?fileId=' + fileId
  attachment.value.downloadCount = attachment.value.downloadCount + 1
}

// 文章图片列表(存放图片地址)
const previewImgList = ref([])

const imageViewer = ref()
function imagePreview () {
  nextTick(() => {
    // 拿到所有的img标签
    const imageNodeList = document
      .querySelector('#detail')
      .querySelectorAll('img')
    // 需要传给图片预览组件的图片数组
    const imageList = []
    imageNodeList.forEach((item, index) => {
      const src = item.getAttribute('src')
      imageList.push(src)
      // 添加点击事件，展示图片预览
      item.addEventListener('click', () => {
        imageViewer.value.show(index)
      })
    })
    previewImgList.value = imageList
  })
}

// 代码高亮
function highLightCode () {
  nextTick(() => {
    let blocks = document.querySelectorAll('pre code')
    blocks.forEach(item => {
      hljs.highlightBlock(item)
    })
  })
}

// 更新评论数量
function updateCommentCount (commentCount) {
  articleInfo.value.commentCount = commentCount
}

// 目录
const tocArray = ref([])
// 点击的目录节点
const activeAnchor = ref(null)
// 生成目录节点
function makeToc () {
  nextTick(() => {
    const tocTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
    // 获取所有h标签
    const contentDom = document.querySelector('#detail')
    const childNodes = contentDom.childNodes

    let index = 0 // 下标要拿到标签元素再增加 文字内容在循环中也算一个 item 但是 tagName 为 undefined
    childNodes.forEach(item => {
      let tagName = item.tagName
      if (tagName === undefined || !tocTags.includes(tagName.toUpperCase())) {
        return true
      }
      index++

      let id = 'toc' + index
      item.setAttribute('id', id)
      tocArray.value.push({
        id,
        title: item.innerText,
        level: Number.parseInt(tagName.substring(1)),
        // 文字内容的标签 距离 页面顶部的距离
        offsetTop: item.offsetTop
      })
    })
  })
}

// 跳转目录节点
function gotoAnchor (id) {
  const dom = document.querySelector('#' + id)
  dom.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

// 监听滚动条 更新目录
function listenerScroll () {
  let currenScrollTop = getScrollTop()
  tocArray.value.some((item, index) => {
    // 判断当前页面位置是否处于两个目录之间的位置
    if (
      (index < tocArray.value.length - 1 &&
        currenScrollTop >= tocArray.value[index].offsetTop &&
        currenScrollTop < tocArray.value[index + 1].offsetTop) ||
      (index === tocArray.value.length - 1 &&
        currenScrollTop >= tocArray.value[index].offsetTop)
    ) {
      activeAnchor.value = item.id
      return true
    }
  })
}

// 获取滚动条当前位置高度
function getScrollTop () {
  return document.documentElement.scrollTop || document.body.scrollTop
}
onMounted(() => {
  getArticleDetails(route.params.articleId)
  // 监听滚动条
  window.addEventListener('scroll', listenerScroll, false)
})

onUnmounted(() => {
  window.removeEventListener('scroll', listenerScroll, false)
})

// 系统设置(评论展示相关)
const showComment = ref(false)
watch(
  () => store.state.sysSetting,
  (newVal, oldVal) => {
    if (newVal) {
      showComment.value = newVal.commentOpen
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss">
.article-detail-body {
  position: relative;
  color: #c4c4c4;
  .board-info {
    line-height: 40px;
    .icon-right {
      margin: 0 10px;
    }
  }
  .detail-container {
    .article-detail {
      background: rgb(0, 0, 0, 0.1);
      padding: 15px;
      .title {
        font-size: 20px;
        font-weight: bold;
      }
      .user-info {
        margin-top: 15px;
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid #868686;
        .user-info-detail {
          margin-left: 10px;
          .nick-name {
            color: #03a3ff;
          }
          .time-info {
            margin-top: 5px;
            font-size: 13px;
            color: #868686;
            .iconfont {
              margin-left: 10px;
            }
            .iconfont::before {
              padding-right: 3px;
            }
            .edit-btn {
              .iconfont {
                font-size: 14px;
              }
            }
          }
        }
      }
      .detail {
        letter-spacing: 1px;
        line-height: 25px;
        img {
          max-width: 100%;
          object-fit: contain;
          cursor: pointer;
        }
        a {
          color: #03a3ff;
        }

        /* 基本样式 (原有的基本样式不生效) */
        h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }

        h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.83em 0;
        }

        h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 1em 0;
        }
        p {
          margin: 1em 0;
        }
        ul,
        ol {
          margin: 1em 0;
          padding-left: 1.5em;
        }

        li {
          margin: 0.5em 0;
        }
      }
      .attachment-panel {
        margin-top: 20px;
        padding: 20px;
        background: rgb(0, 0, 0, 0.1);
        .title {
          font-size: 18px;
        }
        .attachment-info {
          display: flex;
          align-items: center;
          color: #9f9f9f;
          margin-top: 10px;
          .item {
            margin-right: 10px;
          }
          .icon-zip {
            font-size: 20px;
            color: #03a3ff;
          }
          .file-name {
            color: #03a3ff;
          }
          .integral {
            color: red;
            padding: 0 5px;
          }
        }
      }
    }
    .comment-panel {
      padding: 20px;
      margin-top: 20px;
      background: rgb(0, 0, 0, 0.1);
    }
  }
  .toc-panel {
    position: absolute;
    top: 46px;
    right: 0;
    width: 285px;
    color: var(--text1);
    .top-container {
      position: fixed;
      background: rgb(73, 79, 82);
      width: 285px;
      .toc-title {
        border-bottom: 1px solid #ddd;
        padding: 10px;
      }
      .toc-list {
        max-height: calc(100vh - 200px);
        overflow: auto;
        padding: 5px;
        .no-toc {
          text-align: center;
          line-height: 40px;
          font-size: 14px;
        }
        .toc-item {
          display: block;
          line-height: 35px;
          cursor: pointer;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: var(--text1);
          border-radius: 3px;
          font-size: 14px;
          border-left: 2px solid rgb(112, 105, 93);
          &:hover {
            background: #ddd;
          }
        }
        .active {
          border-radius: 0px 3px 3px 0px;
          border-left: 2px solid #0c58ab;
          background: rgb(43, 47, 48);
        }
      }
    }
  }
}
.quick-panel {
  position: fixed;
  top: 200px;
  width: 50px;
  text-align: center;
  .el-badge__content.is-fixed {
    top: 5px;
    right: 15px;
  }
  .quick-item {
    display: flex;
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 50%;
    background: rgb(73, 79, 82);
    margin-bottom: 30px;
    .iconfont {
      font-size: 22px;
    }
    .active {
      color: var(--pink);
    }
  }
}
</style>
