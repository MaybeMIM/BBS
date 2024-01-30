<template>
  <div class="edit-post">
    <el-form
      :model="formData"
      :rules="rules"
      ref="form"
      class="post-panel"
      label-width="65px"
      @submit.prevent
    >
      <!-- 正文 富文本编辑区域 -->
      <div class="post-editor">
        <el-card :body-style="{ padding: '5px' }">
          <template #header>
            <div class="post-editor-title">
              <span>正文</span>
              <div class="change-editor-type">
                <span class="iconfont icon-change" @click="changeEditor"
                  >切换为{{
                    editorType === 0 ? 'markdown编辑器' : '富文本编辑器'
                  }}</span
                >
              </div>
            </div>
          </template>
          <el-form-item prop="content" label-width="0">
            <EditHtml
              v-if="editorType === 0"
              v-model="formData.content"
              :height="htmlEditorHeight"
            ></EditHtml>
            <EditorMarkdown
              v-if="editorType === 1"
              v-model="formData.markdownContent"
              :height="markdownHeight"
              @htmlContent="setHtmlContent"
            ></EditorMarkdown>
          </el-form-item>
        </el-card>
      </div>
      <!-- 设置 文章标题 板块 封面 摘要 附件-->
      <div class="post-setting">
        <el-card :body-style="{ padding: '5px' }">
          <template #header>
            <span>设置</span>
          </template>
          <div class="setting-inner">
            <el-form-item label="标题" prop="title">
              <el-input
                clearable
                placeholder="提示信息"
                :maxlength="100"
                v-model.trim="formData.title"
              ></el-input>
            </el-form-item>
            <el-form-item label="板块" prop="boardIds">
              <el-cascader
                placeholder="请选择板块"
                :options="boardList"
                :props="boardProps"
                clearable
                v-model="formData.boardIds"
                :style="{ width: '100%' }"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="封面" prop="cover">
              <CoverUpload v-model:modalValue="formData.cover"></CoverUpload>
            </el-form-item>

            <el-form-item label="摘要" prop="summary">
              <el-input
                clearable
                placeholder="请选择摘要"
                type="textarea"
                :rows="5"
                :maxlength="200"
                resize="none"
                show-word-limit
                v-model="formData.summary"
              ></el-input>
            </el-form-item>
            <el-form-item label="附件" prop="attachment">
              <AttachmentSelector
                v-model:modalValue="formData.attachment"
              ></AttachmentSelector>
            </el-form-item>
            <el-form-item
              label="积分"
              prop="integral"
              v-if="formData.attachment"
            >
              <el-input
                clearable
                placeholder="请输入积分"
                v-model="formData.integral"
              ></el-input>
              <span class="tips">附件下载积分,0 表示无需积分下载</span>
            </el-form-item>
            <el-form-item label="" prop="">
              <el-button
                type="primary"
                :style="{ width: '100%' }"
                @click="submit"
                >保存</el-button
              >
            </el-form-item>
          </div>
        </el-card>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance, nextTick } from 'vue'
import EditorMarkdown from '@/components/editor-markdown.vue'
import EditHtml from '@/components/editor-html.vue'
import CoverUpload from '@/components/cover-upload.vue'
import AttachmentSelector from '@/components/attachment-selector.vue'
import confirm from '@/utils/confirm.js'
import message from '@/utils/message.js'
import verify from '@/utils/verify.js'
import {
  postCommentBoardList,
  editArticleDetail,
  postArticle,
  updateArticle
} from '@/model/api.js'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()

const route = useRoute()
const router = useRouter()

const markdownHeight = window.innerHeight - 118
const htmlEditorHeight = window.innerHeight - 156

const formData = ref({})
const form = ref()
const rules = {
  title: [{ required: true, message: '请输入标题' }],
  boardId: [{ required: true, message: '请选择板块' }],
  content: [{ required: true, message: '请输入正文' }],
  integral: [
    { required: true, message: '请输入所需积分' },
    { validator: verify.number, message: '积分只能是数字' }
  ]
}

// 编辑器类型 0:富文本 1:markdown
const editorType = ref(null)

const articleId = ref(null)

watch(
  () => route,
  (newVal, oldVal) => {
    // 监听路由 先判断是否是发帖模块里面的路径 再进行赋值
    if (
      newVal.path.indexOf('/editPost') !== -1 ||
      newVal.path.indexOf('/newPost') !== -1
    ) {
      articleId.value = newVal.params.articleId
      getArticleDetail()
    }
  },
  { immediate: true, deep: true }
)

// 板块信息
const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: 'boardId',
  label: 'boardName'
}
const boardList = ref([])

async function loadBoardList () {
  let result = await postCommentBoardList()

  if (!result) return
  boardList.value = result.data
}
loadBoardList()

// 设置markdown编辑器的富文本信息
function setHtmlContent (htmlContent) {
  formData.value.content = htmlContent
}

// 切换编辑器
function changeEditor () {
  confirm('切换编辑器会清空正在编辑的内容，确定切换吗?', () => {
    editorType.value = editorType.value === 0 ? 1 : 0
    formData.value.content = ''
    formData.value.markdownContent = ''
    // 设置Cookies 编辑器的类型 永不过期
    proxy.VueCookies.set('editorType', editorType.value, -1)
  })
}

// 获取文章数据
function getArticleDetail () {
  nextTick(() => {
    form.value.resetFields()
    if (articleId.value) {
      // 修改文章(要获取信息)
      update()
    } else {
      // 新增
      formData.value = {}
      editorType.value =
        Number.parseFloat(proxy.VueCookies.get('editorType')) || 0
    }
  })
}

async function update () {
  let result = await editArticleDetail(
    { articleId: articleId.value },
    false,
    responseData => {
      // errorCallback
      ElMessageBox.alert(responseData.info, '⭐错误⭐', {
        'show-close': false,
        callback: action => {
          // 有错误的话 回退到上一步
          router.go(-1)
        }
      })
    }
  )
  if (!result) return

  let articleInfo = result.data.forumArticle
  // 设置编辑器
  editorType.value = articleInfo.editorType

  // 设置板块信息
  articleInfo.boardIds = []
  // 先放父级id 如果有子板块 判断不为空 也push
  articleInfo.boardIds.push(articleInfo.pBoardId)
  if (articleInfo.boardId !== null && articleInfo.boardId != 0) {
    articleInfo.boardIds.push(articleInfo.boardId)
  }

  // 设置封面信息
  if (articleInfo.cover) {
    articleInfo.cover = { imageUrl: articleInfo.cover }
  }

  // 设置附件
  if (result.data.attachment) {
    articleInfo.attachment = { name: result.data.attachment.fileName }
    articleInfo.integral = result.data.attachment.integral
  }

  formData.value = articleInfo
}

// 提交信息
function submit () {
  form.value.validate(async valid => {
    if (!valid) return

    let params = Object.assign({}, formData.value)
    // 设置分类
    if (params.boardIds.length === 1) {
      // 父级
      params.pBoardId = params.boardIds[0]
    } else if (params.boardIds.length === 2) {
      params.pBoardId = params.boardIds[0]
      params.boardId = params.boardIds[1]
    }
    delete params.boardIds

    // 设置编辑器类型
    params.editorType = editorType.value

    // 获取编辑的html内容 (删除除了img标签之外的所有HTML标签)
    const contentText = params.content.replace(/<(?!img).*?>/g, '')
    if (contentText == '') {
      message.warning('正文不能为空')
      return
    }

    if (params.attachment !== null) {
      params.attachmentType = 1
    } else {
      params.attachmentType = 0
    }

    // 如果不是文件类型，则不需要上传该值(即编辑时没有变动这些值 就不需要，变动了值会变为File类型)
    // 封面
    if (!(params.attachment instanceof File)) {
      delete params.cover
    }
    // 附件
    if (!(params.attachment instanceof File)) {
      delete params.attachment
    }

    let result = params.articleId
      ? await updateArticle(params)
      : await postArticle(params)

    if (!result) return
    message.success('保存成功')
    router.push(`/post/${result.data}`)
  })
}
</script>

<style lang="scss">
.edit-post {
  .post-panel {
    display: flex;
    .el-card__header {
      padding: 10px;
    }
    .post-editor {
      flex: 1;
      .post-editor-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .change-editor-type {
          .iconfont {
            cursor: pointer;
            color: var(--link);
            font-size: 14px;
          }
        }
      }
    }
    .post-setting {
      margin-left: 10px;
      width: 450px;
      .setting-inner {
        max-height: calc(100vh - 120px);
        overflow: auto;
      }
      .tips {
        color: #868686;
        font-size: 13px;
      }
    }
  }
}
</style>
