<template>
  <div
    class="container-body search-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div
      class="search-panel"
      :style="{ 'margin-top': startSearch ? '0' : '200px' }"
    >
      <el-form :model="formData" :rules="rules" ref="form" @submit.prevent>
        <!--input输入-->
        <el-form-item prop="keyword">
          <el-input
            size="large"
            clearable
            placeholder="请输入你想要查找的关键词"
            v-model.trim="formData.keyword"
            @keyup.enter="search"
            @focus="handleStartSearch"
            @change="handleClear"
          >
            <template #suffix>
              <span
                class="iconfont icon-search"
                @click="search"
              ></span> </template
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="article-list" v-if="articleListInfo.list">
      <DataList
        :loading="loading"
        :dataSource="articleListInfo"
        emptyMsg="未找到相关帖子"
        @loadData="search"
      >
        <template #default="{ data }">
          <ArticleListItem
            :data="data"
            :showComment="showComment"
            :htmlTitle="true"
          />
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, watch } from 'vue'
import DataList from '@/components/data-list.vue'
import ArticleListItem from '@/views/forum/article-list-item.vue'
import { searchArticle } from '@/model/api'
import store from '@/store'

const { proxy } = getCurrentInstance()
const loading = ref(false)

const formData = ref({})
const form = ref()
const rules = {
  keyword: [
    { required: true, message: '请输入关键字', trigger: 'change' },
    { min: 3, message: '关键字至少三个字' }
  ]
}

const startSearch = ref(false)

// 开始搜索
function handleStartSearch () {
  startSearch.value = true
}

const articleListInfo = ref({})
async function search () {
  form.value.validate(async v => {
    if (!v) return
    if (loading.value) return
    loading.value = true

    let params = {
      pageNo: articleListInfo.value.pageNo,
      keyword: formData.value.keyword
    }

    // 有了骨架就不需要遮罩loading
    let result = await searchArticle(params, false)

    loading.value = false
    if (!result) return

    articleListInfo.value = result.data

    // 搜索的结果 匹配上的值高亮
    let list = result.data.list
    list.forEach(i => {
      i.title = i.title.replace(
        params.keyword,
        "<span style='color:red'>" + params.keyword + '</span>'
      )
    })
  })
}

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

// 清空输入框
function handleClear () {
  if (formData.value.keyword === '') {
    articleListInfo.value = {}
  }
}
</script>

<style lang="scss">
.search-body {
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  min-height: calc(100vh - 210px);
  .search-panel {
    display: flex;
    justify-content: center;
    .el-input {
      width: 700px;
    }
  }
}
</style>
