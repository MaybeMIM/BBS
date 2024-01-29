<template>
  <div class="editor-html">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      :style="{ height: height + 'px', 'overflow-y': 'hidden' }"
      :modal-value="modalValue"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="onChange"
    />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, getCurrentInstance } from 'vue'
import { Toolbar, Editor } from '@wangeditor/editor-for-vue'
import message from '@/utils/message.js'
import store from '@/store'

const { proxy } = getCurrentInstance()

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

const mode = ref('default')
const editorRef = shallowRef()

const toolbarConfig = {
  // 排除菜单组 即不需要的功能
  excludeKeys: ['uploadVideo']
}

const editorConfig = {
  placeholder: '请输入内容',
  excludeKeys: ['uploadVideo'],
  MENU_CONF: {
    uploadImage: {
      maxFileSize: 3 * 1024 * 1024,
      server: 'api/file/uploadImage',
      fileName: 'file',
      customInsert (responseData, insertFn) {
        // 正常请求
        if (responseData.code === 200) {
          insertFn(
            proxy.globalInfo.imageUrl + responseData.data.fileName,
            '',
            ''
          )
          return
        } else if (responseData.code === 901) {
          // 登录超时
          store.commit('showLogin', true)
          store.commit('updateLoginUserInfo', null)
          return
        }
        message.error(responseData.info)
      }
    }
  }
}

// 创建 editor 实例
function handleCreated (editor) {
  editorRef.value = editor
}

function onChange (editor) {
  emit('update:modalValue', editor.getHtml())
}

// 组件销毁 也要及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style lang="scss" scoped>
.editor-html {
  border: 1px solid #ddd;
}
</style>
