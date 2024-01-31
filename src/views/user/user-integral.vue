<template>
  <Dialog
    :visible="dialogConfig.visible"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="500px"
    :showCancel="false"
    @close="dialogConfig.visible = false"
  >
    <el-form :model="formData" ref="form" label-width="40px" @submit.prevent>
      <!--input输入-->
      <el-form-item label="日期" prop="createTimeRange">
        <el-date-picker
          v-model="formData.createTimeRange"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          @change="loadRecord"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="data-item">
      <div class="record-type">类型</div>
      <div class="integral">积分</div>
      <div class="create-time">时间</div>
    </div>
    <DataList
      :loading="loading"
      :dataSource="recordInfo"
      emptyMsg="暂无相关记录"
      @loadData="loadRecord"
    >
      <template #default="{ data }">
        <div class="data-item">
          <div class="record-type">{{ data.operTypeName }}</div>
          <div :class="['integral', data.integral > 0 ? 'add' : 'reduce']">
            {{ data.integral }}
          </div>
          <div class="create-time">{{ data.createTime }}</div>
        </div>
      </template>
    </DataList>
  </Dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataList from '@/components/data-list.vue'
import { loadUserIntegralRecord } from '@/model/api.js'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const formData = ref({})
const form = ref()

const dialogConfig = reactive({
  visible: false,
  title: '查看用户积分记录',
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: e => {
        dialogConfig.visible = false
      }
    }
  ]
})

const recordInfo = ref({})
async function loadRecord () {
  if (loading.value) return
  loading.value = true

  let params = {
    pageNo: recordInfo.value.pageNo
  }
  if (formData.value.createTimeRange) {
    params.createTimeStart = formData.value.createTimeRange[0]
    params.createTimeEnd = formData.value.createTimeRange[1]
  }

  let result = await loadUserIntegralRecord(params, false)

  loading.value = false
  if (!result) return

  recordInfo.value = result.data
}

function showRecord () {
  dialogConfig.visible = true
  nextTick(() => {
    form.value.resetFields()
    loadRecord()
  })
}
defineExpose({ showRecord })
</script>

<style lang="scss">
.data-item {
  display: flex;
  border-bottom: 1px solid #ddd;
  padding: 8px 0;
  .add {
    color: red;
  }
  .reduce {
    color: green;
  }
  .record-type {
    text-align: center;
    width: 120px;
  }
  .integral {
    text-align: center;
    width: 120px;
  }
  .create-time {
    text-align: center;
    flex: 1;
  }
}
</style>
