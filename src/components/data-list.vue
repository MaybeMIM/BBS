<template>
  <!-- TODO:BUG 请求回来的数据比组件挂载的慢  && dataSource.list.length === 0-->
  <div v-if="!loading && dataSource.list !== null">
    <EmptyData :msg="emptyMsg"></EmptyData>
  </div>

  <div class="skeleton" v-if="loading">
    <!-- 显示的骨架 正在加载的时候显示-->
    <el-skeleton :row="2" animated></el-skeleton>
  </div>
  <!-- 数据列表 -->
  <div v-for="item in dataSource.list" v-else>
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
import EmptyData from "./empty-data.vue";
const props = defineProps({
  dataSource: {
    type: Object,
  },
  loading: {
    type: Boolean,
  },
  emptyMsg: {
    type: String,
    default: "空空如也",
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
  padding: 10px 0 10px 10px;
}
.skeleton {
  padding: 15px;
}
</style>
