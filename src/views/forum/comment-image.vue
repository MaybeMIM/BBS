<template>
  <el-image
    class="comment-img"
    :src="src"
    :zoom-rate="1.2"
    :preview-src-list="imgList ? imgList : [src]"
    :initial-index="0"
    fit="fill"
    loading="lazy"
    hide-on-click-modal
  >
  </el-image>
</template>

<script setup>
const props = defineProps({
  src: String,
  imgList: Array
})
</script>

<style lang="scss">
.comment-img {
  width: 80px;
  height: 80px;
  border-radius: 5px;
}
</style>
