<template>
  <div class="attachment-selector">
    <template v-if="modalValue">
      <div class="file-name" :title="modalValue.name">
        {{ modalValue.name }}
      </div>
      <div class="iconfont icon-del" @click="delFile"></div>
    </template>
    <el-upload
      v-else
      name="file"
      :show-file-list="false"
      accept=".zip,.rar"
      :multiple="false"
      :http-request="selectFile"
    >
      <el-button type="primary">选择文件</el-button>
    </el-upload>
  </div>
</template>

<script setup>
const props = defineProps({
  modalValue: {
    type: Object,
    default: null
  }
})
const emit = defineEmits()

async function selectFile (file) {
  emit('update:modalValue', file.file)
}

function delFile () {
  emit('update:modalValue', null)
}
</script>

<style lang="scss">
.attachment-selector {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .file-name {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--link);
  }
  .icon-del {
    width: 20px;
    color: var(--link);
    cursor: pointer;
    margin-left: 10px;
  }
}
</style>
