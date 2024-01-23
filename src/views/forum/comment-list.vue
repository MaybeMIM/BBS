<template>
  <div class="comment-body">
    <div class="comment-title">
      <div class="title">
        评论<span class="count">{{ 0 }}</span>
      </div>
      <div class="tab">
        <span>最热</span>
        <el-divider direction="vertical"></el-divider>
        <span>最新</span>
      </div>
    </div>
    <!-- 发送评论 -->
    <div class="comment-form-panel">
      <Avatar :width="50" :userId="currentUserInfo.userId" />
      <div class="comment-form">
        <el-form :model="formData" :rules="rules" ref="form" @submit.prevent>
          <el-form-item prop="content">
            <el-input
              clearable
              placeholder="请输入评论内容"
              type="textarea"
              :maxlength="150"
              resize="none"
              show-word-limit
              v-model.trim="formData.content"
            ></el-input>
            <div class="insert-img" v-if="currentUserInfo.userId">
              <el-upload
                name="file"
                :show-file-list="false"
                accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.git,.GIT,.bmp,.BMP"
                :multiple="false"
                :http-request="selectImg"
              >
                <span class="iconfont icon-image"></span>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="send-btn">发表</div>
    </div>
    <div class="comment-list">
      <DataList
        :data-source="commentListInfo"
        :loading="loading"
        @load-data="loadComments"
      >
        <template #default="{ data }">
          <CommentListItem
            :comment-data="data"
            :article-user-id="articleUserId"
            :current-user-id="currentUserInfo.userId"
          ></CommentListItem>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import store from '@/store'
import { ref, watch, onMounted } from 'vue'
import { loadComment } from '@/model/api.js'
import DataList from '@/components/data-list.vue'
import CommentListItem from './comment-list-item.vue'

const props = defineProps({
  articleId: {
    type: String
  },
  articleUserId: {
    type: String
  }
})

// 评论列表
const commentListInfo = ref([])

// 排序
const orderType = ref(0)

const loading = ref(false)
const formData = ref({})
const form = ref()
const rules = {
  content: [{ required: true, message: '请输入评论内容' }]
}

// 当前用户信息
const currentUserInfo = ref({})
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = newVal || {}
  },
  { immediate: true, deep: true }
)

// 选择图片
function selectImg () {}

// 评论列表
async function loadComments () {
  loading.value = true
  const params = {
    pageNo: commentListInfo.value.pageNo,
    articleId: props.articleId,
    orderType: orderType.value
  }

  let result = await loadComment(params)
  loading.value = false

  if (!result) return

  commentListInfo.value = result.data
}

loadComments()
</script>

<style lang="scss" scoped>
.comment-body {
  .comment-title {
    display: flex;
    align-items: center;
    color: #c4c4c4;
    .count {
      font-size: 14px;
      padding: 0 10px;
    }
    .tab {
      margin-left: 10px;
      span {
        cursor: pointer;
      }
    }
  }
  .comment-form-panel {
    margin-top: 10px;
    display: flex;
    .comment-form {
      flex: 1;
      margin: 0 20px;
      .el-textarea__inner {
        height: 60px;
      }
      .iconfont {
        font-size: 20px;
      }
    }
    .send-btn {
      width: 80px;
      height: 40px;
      font-weight: 500;
      text-align: center;
      cursor: pointer;
      line-height: 40px;
      margin-top: 5px;
      border-radius: 7px;
      background: var(--link);
    }
  }
}
</style>
