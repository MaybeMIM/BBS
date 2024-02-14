<template>
  <div class="table">
    <el-table
      ref="dataTable"
      :data="dataSource.list || []"
      :height="tableHeight"
      :stripe="options.stripe"
      :border="options.border"
      highlight-current-row
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <!-- selection选择框 -->
      <el-table-column
        v-if="options.selectType && options.selectType === 'checkbox'"
        type="selection"
        width="50"
        align="center"
      >
      </el-table-column>
      <!-- 序号列 -->
      <el-table-column
        v-if="options.showIndex"
        label="序号"
        type="index"
        width="60"
        align="center"
      ></el-table-column>
      <!-- 数据列  -->
      <template v-for="(column, index) in columns">
        <template v-if="column.scopedSlots">
          <el-table-column
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :align="column.align || 'left'"
            :width="column.width"
            :fixed="column.fixed"
          >
            <template #default="scope">
              <slot
                :name="column.scopedSlots"
                :index="scope.$index"
                :row="scope.row"
              >
              </slot>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :align="column.align || 'left'"
            :width="column.width"
            :fixed="column.fixed"
          >
          </el-table-column>
        </template>
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="pagination" v-if="showPagination">
      <el-pagination
        v-if="dataSource.totalCount"
        background
        :total="dataSource.totalCount"
        :page-sizes="[15, 30, 50, 100]"
        :page-size="dataSource.pageSize"
        :current-page.sync="dataSource.pageNo"
        layout="total,sizes,prev,pager,next,jumper"
        @size-change="handlePageSizeChange"
        @current-change="handlePageNoChange"
        style="text-align: right"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  dataSource: Object,
  showPagination: {
    type: Boolean,
    default: true
  },
  // 表格属性
  options: {
    type: Object,
    default: {
      tableHeight: null,
      stripe: true, // 斑马纹
      border: false,
      extHeight: 0,
      showIndex: false
    }
  },
  columns: Array,
  // 获取数据的函数
  fetch: Function,
  initFetch: {
    type: Boolean,
    default: true
  }
})

// 顶部60 ,内容区域距离顶部20 ,内容上下内间距15*2 ,分页区域高度 46
const topHeight = 156

const tableHeight = ref(
  props.options.tableHeight
    ? props.options.tableHeight
    : window.innerHeight - topHeight - (props.options.extHeight || 0) // 扩展高度(搜索、批量操作等区域)
)

// 初始化
function init () {
  if (props.initFetch && props.fetch) {
    props.fetch()
  }
}
init()

const dataTable = ref()
// 清楚选中
function clearSelection () {
  dataTable.value.clearSelection()
}

// 设置行选中
function setCurrentRow (rowKey, rowValue) {
  let row = props.dataSource.list.find(item => {
    return item[rowKey] === rowValue
  })
  dataTable.value.setCurrentRow(row)
}
// 暴露出去给父组件使用
defineExpose({ clearSelection, setCurrentRow })

const emit = defineEmits(['rowSelected', 'rowClick'])
// 行点击
function handleRowClick (row) {
  emit('rowClick', row)
}
// 多选
function handleSelectionChange (row) {
  emit('rowSelected', row)
}

// 切换页大小
function handlePageSizeChange (size) {
  props.dataSource.pageSize = size
  props.dataSource.pageNo = 1
  props.fetch()
}
// 切换页码
function handlePageNoChange (pageNo) {
  props.dataSource.pageNo = pageNo
  props.fetch()
}
</script>

<style lang="scss">
.pagination {
  padding-top: 10px;
}
.el-pagination {
  justify-content: right;
}
// 行选中
.el-table__body tr.current-row > td.el-table__cell {
  background-color: #e6f0f9;
}
.el-table__body tr:hover > td.el-table__cell {
  background-color: #e6f0f9 !important;
}
</style>
