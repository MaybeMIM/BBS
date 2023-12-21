<template>
  <!-- 数据列表 -->
  <div v-for="item in dataSource.list">
    <!-- 返回一个插槽 -->
    <slot :data="item"></slot>
  </div>
  <div class="pagination">
    <el-pagination
      v-if="dataSource.pageTotal > 1"
      background
      :total="dataSource.totalCount"
      :current-page.sync="dataSource.pageNo"
      layout="prev,pager,next"
      @current-change="handlePageNoChange"
      style="text-align: right"
    >
    </el-pagination>
  </div>
</template>

<script setup>
const props = defineProps({
  dataSource: {
    type: Object,
  },
});
const emit = defineEmits(["loadData"]);
function handlePageNoChange(pageNo) {
  props.dataSource.pageNo = pageNo;
  emit("loadData");
}
</script>

<style lang="scss">
.pagination {
  margin: 5px 0 5px 10px;
}
</style>
