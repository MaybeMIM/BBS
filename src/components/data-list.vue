<template>
  <div v-if="!loading && list !== null && list.length === 0">
    <EmptyData :msg="emptyMsg"></EmptyData>
  </div>

  <div class="skeleton" v-if="loading">
    <!-- 显示的骨架 正在加载的时候显示-->
    <el-skeleton :row="2" animated></el-skeleton>
  </div>
  <!-- 数据列表 -->
  <div v-for="item in list" v-else>
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
import { computed } from 'vue'
import EmptyData from './empty-data.vue'
const props = defineProps({
  dataSource: {
    type: Object
  },
  loading: {
    type: Boolean
  },
  emptyMsg: {
    type: String,
    default: '空空如也'
  }
})

// 因为是异步请求回来的数据 请求回来的数据比组件挂载的慢  (BUG: && dataSource.list.length === 0) 所以要定义一个list去代替
const list = computed(() =>
  Array.isArray(props.dataSource.list) ? props.dataSource.list : []
)
const emit = defineEmits(['loadData'])

function handlePageNoChange (pageNo) {
  props.dataSource.pageNo = pageNo
  emit('loadData')
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
