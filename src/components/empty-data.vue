<template>
  <div class="empty-data">
    <div class="iconfont icon-empty"></div>
    <div class="msg">{{ msg }}</div>
  </div>
</template>

<script setup>
// 显示暂无数据组件
const props = defineProps({
  msg: {
    type: String
  }
})
</script>

<style lang="scss">
.empty-data {
  text-align: center;
  padding: 10px 0;
  .icon-empty {
    font-size: 50px;
    color: #bbb;
  }
  .msg {
    margin-top: 10px;
    color: #909399;
    font-size: 14px;
  }
}
</style>
