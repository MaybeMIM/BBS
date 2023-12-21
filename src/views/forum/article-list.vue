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
        <DataList :dataSource="articleListInfo" @loadData="loadArticle">
          <template #default="{ data }">
            <ArticleListItem :data="data" />
          </template>
        </DataList>
      </div>
    </div>
  </div>
</template>

<script setup>
import DataList from "@/components/data-list.vue";
import ArticleListItem from "./article-list-item.vue";
import { ref, getCurrentInstance, onMounted } from "vue";
const { proxy } = getCurrentInstance();

// TODO: 优化API
const api = {
  loadArticle: "/forum/loadArticle",
};

const articleListInfo = ref({});

async function loadArticle() {
  let params = {
    pageNo: articleListInfo.value.pageNo,
    boardId: 0,
  };

  let result = await proxy.Request({
    url: api.loadArticle,
    params,
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
      .article-list {
        padding-bottom: 10px;
      }
    }
  }
}
</style>
