<template>
  <div class="image-viewer">
    <el-image-viewer
      :initial-index="previewImgIndex"
      hide-on-click-modal
      :url-list="imageList"
      @close="closeImgViewer"
      v-if="previewImgIndex !== null"
    >
    </el-image-viewer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  imageList: {
    type: Array
  }
})

const previewImgIndex = ref(null)

// 隐藏滚动条
function stopScroll () {
  document.body.style.overflow = 'hidden'
}
// 显示滚动条
function startScroll () {
  document.body.style.overflow = 'auto'
}

function closeImgViewer () {
  startScroll()
  previewImgIndex.value = null
}

function show (index) {
  stopScroll()
  previewImgIndex.value = index
}

defineExpose({ show })
</script>

<style lang="scss">
.image-viewer {
  .el-image-viewer__mask {
    opacity: 0.7;
  }
}
</style>
