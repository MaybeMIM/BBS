<template>
  <div class="article-item">
    <div class="article-item-inner">
      <div class="article-body">
        <div class="user-info">
          <Avatar :userId="data.userId" :width="30"></Avatar>
          <router-link :to="'/user/' + data.userId" class="link-hover">
            {{ data.nickName }}
          </router-link>
          <el-divider direction="vertical"></el-divider>
          <div class="post-time">
            {{ data.postTime }}
          </div>
          <div class="address">&nbsp;·&nbsp;{{ data.userIpAddress }}</div>
          <el-divider direction="vertical"></el-divider>
          <router-link :to="`/forum/${data.pBoardId}`" class="link-hover">
            {{ data.pBoardName }}
          </router-link>
          <template v-if="data.boardName">
            <span>&nbsp;/&nbsp;</span>
            <router-link
              :to="`/forum/${data.pBoardId}/${data.boardId}`"
              class="link-hover"
            >
              {{ data.boardName }}
            </router-link>
          </template>
        </div>
        <router-link :to="`/post/${data.articleId}`" class="article-title">
          <span v-if="data.topType === 1" class="top">置顶</span>
          <span>{{ data.title }}</span>
        </router-link>
        <div class="article-summary">{{ data.summary }}</div>
        <div class="article-info">
          <span class="iconfont icon-eye-solid">
            {{ data.readCount === 0 ? '阅读' : data.readCount }}
          </span>
          <span class="iconfont icon-good">
            {{ data.goodCount === 0 ? '点赞' : data.goodCount }}
          </span>
          <span class="iconfont icon-comment" v-if="showComment">
            {{ data.commentCount === 0 ? '评论' : data.commentCount }}
          </span>
        </div>
      </div>

      <router-link :to="`/post/${data.articleId}`"
        ><Cover :cover="data.cover" :width="120" v-if="data.cover"></Cover
      ></router-link>
    </div>
  </div>
</template>

<script setup>
import Cover from '@/components/cover.vue'

const props = defineProps({
  data: {
    type: Object
  },
  showComment: {
    type: Boolean
  }
})
</script>

<style lang="scss">
// TODO:文章模块颜色与背景颜色可能需要调试合适
.article-item {
  padding: 5px 10px 0 15px;
  .article-item-inner {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #aaa;
    .article-body {
      flex: 1;
      .user-info {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #c9c9c9;
        .link-hover {
          margin-left: 5px;
          color: #c9c9c9;
        }
        .link-hover:hover {
          color: var(--link);
        }
        .post-time {
          font-size: 13px;
          color: #868686;
        }
      }
      .article-title {
        display: inline-block;
        font-weight: bold;
        font-size: 16px;
        margin: 10px 0px;
        color: #03a3ff;
        .top {
          font-size: 12px;
          padding: 3px 5px;
          color: var(--pink);
          border-radius: 3px;
          margin-right: 10px;
          border: 1px solid var(--pink);
        }
      }
      .article-summary {
        font-size: 14px;
        color: #c4c4c4;
      }
      .article-info {
        display: flex;
        align-items: center;
        margin-top: 10px;
        font-size: 13px;
        .iconfont {
          color: #c4c4c4;
          margin-right: 25px;
          font-size: 14px;
        }
        .iconfont::before {
          margin-right: 4px;
        }
      }
    }
  }
}
.article-item:hover {
  background: rgb(0, 0, 0, 0.2);
}
</style>
