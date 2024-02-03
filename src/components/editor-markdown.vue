<template>
  <v-md-editor
    :modal-value="modalValue"
    :height="height + 'px'"
    :disabled-menus="[]"
    :include-level="[1, 2, 3, 4, 5, 6]"
    @upload-image="handleUploadImage"
    @change="change"
  >
  </v-md-editor>
</template>

<script setup>
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import hljs from 'highlight.js'
import { uploadImage } from '@/model/api.js'
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
// 初始化 代码高亮风格
VMdEditor.use(githubTheme, {
  Hljs: hljs
})

const props = defineProps({
  modalValue: {
    type: String,
    default: ''
  },
  height: {
    type: Number,
    default: 500
  }
})

const emit = defineEmits()

function change (markdownContent, htmlContent) {
  // 实时输入内容  |  解释为html的结构
  emit('update:modalValue', markdownContent)
  emit('htmlContent', htmlContent)
}

// 自定义图片上传
async function handleUploadImage (event, insertImage, files) {
  let result = await uploadImage({ file: files[0] })

  if (!result) return

  const url = proxy.globalInfo.imageUrl + result.data.fileName
  // 在文本编辑器中插入刚上传的图片
  insertImage({
    url,
    desc: '图片'
  })
}
</script>

<style lang="scss">
.v-md-editor {
  background: rgb(27, 29, 29);
  .v-md-textarea-editor textarea {
    background: rgb(27, 29, 29);
    border-color: initial;
  }
  .v-md-editor__toolbar-item:hover {
    background: rgb(32, 34, 35);
  }
  .v-md-editor__toolbar-item--active,
  .v-md-editor__toolbar-item--active:hover {
    background: rgb(49, 53, 54);
  }
  .v-md-editor__toolbar-divider::before {
    border-left-color: rgb(56, 59, 62);
  }
  .v-md-editor__toolbar {
    border-bottom-color: rgb(56, 59, 62);
  }
  .v-md-editor__left-area {
    border-right-color: rgb(56, 59, 62);
  }
  .v-md-editor__left-area-title {
    color: rgb(155, 172, 187);
  }
  .v-md-editor__left-area-title::after {
    border-bottom-color: rgb(56, 59, 62);
  }
}
.v-md-editor--editable .v-md-editor__editor-wrapper {
  border-right-color: rgb(56, 59, 62);
}
</style>
