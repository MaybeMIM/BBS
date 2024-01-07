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
        <div class="title">{{ articleInfo.title }}</div>
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
              已下载{{ attachment.downloadCount }}
            </div>
            <div class="download-btn item">
              <el-button type="primary" size="small">下载</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleDetail } from '@/model/api'
import utils from '@/utils/utils'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

// 文章详情信息
const articleInfo = ref({})
const attachment = ref({})
async function getArticleDetails (articleId) {
  let result = await getArticleDetail({ articleId })

  if (!result) return

  articleInfo.value = result.data.forumArticle
  attachment.value = result.data.attachment
}
onMounted(() => {
  getArticleDetails(route.params.articleId)
})
</script>

<style lang="scss">
.article-detail-body {
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
        color: #c4c4c4;
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
        p {
          margin: 15px 0;
        }
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
}
</style>
