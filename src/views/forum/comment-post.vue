<template>
  <div class="post-comment-panel">
    <Avatar :width="avatarWidth" :userId="userId" />
    <div class="comment-form">
      <el-form
        ref="form"
        :rules="rules"
        :model="formData"
        @submit.prevent
        :validate-on-rule-change="false"
      >
        <el-form-item prop="content">
          <el-input
            ref="inputRef"
            clearable
            :placeholder="placeholderInfo"
            type="textarea"
            :maxlength="150"
            resize="none"
            show-word-limit
            v-model="formData.content"
          ></el-input>
          <div class="insert-img" v-if="showInsertImg">
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
    <div class="send-btn" @click="handelPostComment">发表</div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { postComment } from '@/model/api'
import message from '@/utils/message'

const props = defineProps({
  // 文章Id
  articleId: String,
  pCommentId: Number,
  replyUserId: String,
  avatarWidth: Number,
  userId: String,
  showInsertImg: Boolean,
  autofocus: Boolean,
  placeholderInfo: {
    type: String,
    default: '请输入评论内容'
  }
})

const emit = defineEmits(['postCommentFinish'])

const inputRef = ref()

const formData = ref({})
const form = ref()
const rules = {
  content: [{ required: true, message: '请输入评论内容' }]
}

// 自动获取焦点
watch(
  () => props.autofocus,
  v => {
    if (!v) return
    nextTick(() => {
      autoFocus()
    })
  },
  { immediate: true, deep: true }
)
function autoFocus () {
  inputRef.value.focus()
}

// 发表评论
async function handelPostComment () {
  form.value.validate(async valid => {
    if (!valid) return

    let params = Object.assign({}, formData.value)
    params.articleId = props.articleId
    params.pCommentId = props.pCommentId
    params.replayUserId = props.replyUserId

    // 评论内容 为文字没有问题 但是为字母大概率会参数错误(???)
    let result = await postComment(params)

    if (!result) return

    message.success('评论发表成功')
    resetForm()
    // 评论完之后 给父级的回调(便于重新获取数据 获取最新的评论)
    emit('postCommentFinish', result.data)
  })
}

function resetForm () {
  form.value.resetFields()
}

// 选择图片
function selectImg () {}
</script>

<style lang="scss">
.post-comment-panel {
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
</style>
