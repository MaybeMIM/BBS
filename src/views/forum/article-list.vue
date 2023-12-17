<template>
  <div
    class="container-body article-list-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="article-panel">
      <div class="top-tab">
        <div class="tab-item">热榜</div>
        <el-divider direction="vertical"></el-divider>
        <div class="tab-item">发布时间</div>
        <el-divider direction="vertical"></el-divider>
        <div class="tab-item">最新</div>
      </div>
      <div class="article-list">
        <div v-for="item in articleListInfo.list">
          <ArticleListItem :data="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ArticleListItem from "./article-list-item.vue";
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();

const api = {
  loadArticle: "/forum/loadArticle",
};

const articleListInfo = ref({});

async function loadArticle() {
  let result = await proxy.Request({
    url: api.loadArticle,
    // params: {
    //   boardId: 0,
    // },
  });

  if (!result) return;

  articleListInfo.value = result.data;
}

onMounted(() => loadArticle());
</script>

<style lang="scss">
.article-list-body {
  .article-panel {
    background: rgb(0, 0, 0, 0.1);
    .top-tab {
      display: flex;
      align-items: center;
      padding: 10px;
      font-size: 15px;
      border-bottom: 1px solid #000;
      .tab-item {
        color: #c9c9c9;
      }
    }
  }
}
</style>
