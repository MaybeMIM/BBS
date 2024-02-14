<template>
  <div>
    <Dialog
      :visible="dialogConfig.visible"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :showCancel="false"
      @close="dialogConfig.visible = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="form"
        label-width="80px"
        @submit.prevent
      >
        <el-form-item label="标题">
          {{ formData.title }}
        </el-form-item>
        <el-form-item label="板块" prop="boardIds">
          <el-cascader
            clearable
            placeholder="请选择板块"
            :options="boardList"
            :props="boardProps"
            v-model.trim="formData.boardIds"
            @change="handelPickBoard(board, value)"
          ></el-cascader>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { loadBoard, updateBoard } from '@/model/api'

const emit = defineEmits()

const dialogConfig = ref({
  visible: false,
  title: '修改板块',
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: e => {
        submitForm()
      }
    }
  ]
})

const formData = ref({})
const form = ref()
const rules = {
  boardIds: [{ required: true, message: '请选择板块' }]
}

// 板块信息
const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: 'boardId',
  label: 'boardName'
}
const boardList = ref([])

async function loadBoardList () {
  let result = await loadBoard()

  if (!result) return
  boardList.value = result.data
}
loadBoardList()

async function submitForm () {
  form.value.validate(async valid => {
    if (!valid) return
    let params = {
      articleId: formData.value.articleId,
      boardIds: formData.value.boardIds
    }

    if (params.boardIds && params.boardIds.length === 1) {
      params.pBoardId = params.boardIds[0]
    } else if (params.boardIds && params.boardIds.length === 2) {
      params.pBoardId = params.boardIds[0]
      params.boardId = params.boardIds[1]
    }
    delete params.boardIds

    let result = await updateBoard(params)

    if (!result) return

    dialogConfig.value.visible = false
    // 更新信息之后 需要重新请求一下
    emit('reload')
  })
}

function showUpdateBoard (data) {
  dialogConfig.value.visible = true
  nextTick(() => {
    form.value.resetFields()
    data.boardIds = []
    data.boardIds.push(data.pBoardId)
    // 不选择二级分类时
    if (data.boardId !== null && data.boardId !== 0) {
      data.boardIds.push(data.boardId)
    }

    formData.value = data
  })
}

function handelPickBoard (value, data) {
  console.log(value, data)
}
defineExpose({ showUpdateBoard })
</script>

<style lang="scss"></style>
