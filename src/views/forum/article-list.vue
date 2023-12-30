<template>
  <div
    class="container-body article-list-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <!-- 二级板块信息 首页不展示-->
    <div class="sub-board" v-if="pBoardId">
      <router-link
        :class="['board-item', boardId == 0 ? 'active' : '']"
        :to="`/forum/${pBoardId}`"
        >全部</router-link
      >
      <span
        :class="['board-item', item.boardId == boardId ? 'active' : '']"
        v-for="item in subBoardList"
      >
        <router-link :to="`/forum/${item.pBoardId}/${item.boardId}`">
          {{ item.boardName }}
        </router-link>
      </span>
    </div>
    <div class="article-panel">
      <!-- 排序 -->
      <div class="top-tab">
        <div
          :class="['tab-item', orderType === 0 ? 'active' : '']"
          @click="changeOrderType(0)"
        >
          热榜
        </div>
        <el-divider direction="vertical"></el-divider>
        <div
          :class="['tab-item', orderType === 1 ? 'active' : '']"
          @click="changeOrderType(1)"
        >
          发布时间
        </div>
        <el-divider direction="vertical"></el-divider>
        <div
          :class="['tab-item', orderType === 2 ? 'active' : '']"
          @click="changeOrderType(2)"
        >
          最新
        </div>
      </div>
      <div class="article-list">
        <DataList
          :loading="loading"
          :dataSource="articleListInfo"
          emptyMsg="没有发现帖子,快来发表第一个帖子吧！"
          @loadData="loadArticle"
        >
          <template #default="{ data }">
            <ArticleListItem :data="data" />
          </template>
        </DataList>
      </div>
    </div>
  </div>
</template>

<script setup>
import { loadArticleList } from '@/model/api'
import DataList from '@/components/data-list.vue'
import ArticleListItem from './article-list-item.vue'
import { ref, getCurrentInstance, onMounted, watch } from 'vue'
import store from '@/store'
import { useRoute } from 'vue-router'
const { proxy } = getCurrentInstance()

const route = useRoute()
// 文章列表
const loading = ref(false)
const orderType = ref(0)
const articleListInfo = ref({})

const pBoardId = ref(0) // 一级板块
const boardId = ref(0) // 二级板块

const subBoardList = ref([]) // 二级板块

watch(
  // 监听路由参数
  () => route.params,
  (newVal, oldVal) => {
    pBoardId.value = newVal.pBoardId
    boardId.value = newVal.boardId || 0

    setSubBoard()
    loadArticle()
    // 板块、列表变化
    store.commit('setActivePBoardId', newVal.pBoardId)
    store.commit('setActiveBoardId', newVal.boardId)
  },
  { immediate: true, deep: true }
)

watch(
  // 监听板块 页面刷新之后也能拿到二级板块
  () => store.state.boardList,
  () => setSubBoard(),
  { immediate: true, deep: true }
)
async function loadArticle () {
  if (loading.value) return
  loading.value = true

  let params = {
    pageNo: articleListInfo.value.pageNo,
    pBoardId: pBoardId.value,
    boardId: boardId.value,
    orderType: orderType.value
  }

  // 有了骨架就不需要遮罩loading
  let result = await loadArticleList(params, false)

  loading.value = false
  if (!result) return

  articleListInfo.value = result.data
}

// 二级板块
function setSubBoard () {
  subBoardList.value = store.getters.getSubBoardList(pBoardId.value)
}

// 切换排序方式 热榜 发布时间
function changeOrderType (type) {
  orderType.value = type
  loadArticle()
}

onMounted(() => loadArticle())
</script>

<style lang="scss">
.article-list-body {
  .sub-board {
    padding: 5px 0 15px 0;

    .board-item {
      border-radius: 15px;
      margin-right: 10px;
      padding: 2px 10px;
      color: #868686;
      font-size: 14px;
      cursor: pointer;
      background: #c9c9c9;
      &:hover {
        color: var(--link);
      }
      a {
        color: #868686;
        &:hover {
          color: var(--link);
        }
      }
    }
    .active {
      background: var(--link);
      color: #fff;

      a {
        color: #fff;
      }
    }
  }

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
        cursor: pointer;
      }

      .active {
        color: #007bff;
      }
    }
  }
}
</style>
