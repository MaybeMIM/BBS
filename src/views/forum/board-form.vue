<template>
  <div>
    <Dialog
      :visible="dialogConfig.visible"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      :showCancel="false"
      @close="close"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="form"
        label-width="90px"
        @submit.prevent
      >
        <el-form-item
          label="一级板块"
          prop="boardName"
          v-if="formData.boardType === 1"
          >{{ formData.pBoardName }}</el-form-item
        >
        <el-form-item label="板块名称" prop="boardName">
          <el-input
            placeholder="请输入名称"
            v-model="formData.boardName"
          ></el-input>
        </el-form-item>
        <el-form-item label="发帖权限" prop="postType">
          <el-radio-group v-model="formData.postType">
            <el-radio :label="1">{{ postTypeMap[1] }}</el-radio>
            <el-radio :label="0">{{ postTypeMap[0] }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <CoverUpload v-model:modalValue="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item label="简介" prop="boardDesc">
          <el-input
            type="textarea"
            placeholder="请输入简介"
            v-model="formData.boardDesc"
            :autosize="{ minRows: 4, maxRows: 4 }"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch, useAttrs, nextTick } from 'vue'
import CoverUpload from '@/components/cover-upload.vue'
import message from '@/utils/message'
import { saveBoard } from '@/model/api'

const props = defineProps({
  data: Object,
  currentBoard: Object
})

const attrs = useAttrs()
const emit = defineEmits(['reload'])

const dialogConfig = ref({
  visible: false,
  title: '标题',
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
// 发帖权限map对象
const postTypeMap = {
  0: '只允许管理员发帖',
  1: '任何人可以发帖'
}
const formData = ref({})
const form = ref()
const rules = {
  boardName: [{ required: true, message: '请输入板块名称' }],
  postType: [{ required: true, message: '请选择发帖权限' }]
}

const data = ref({})
watch(
  () => attrs.visible,
  (newVal, oldVal) => {
    if (!newVal) return
    dialogConfig.value.visible = newVal
    data.value = props.data
    formData.value = Object.assign({}, props.data.data)
    if (formData.value.cover) {
      // 需要变为一个对象  组件里需要imgUrl来展示图片
      formData.value.cover = {
        imgUrl: formData.value.cover
      }
    }
    nextTick(() => {
      distinguish()
    })
  },
  { immediate: true, deep: true }
)

function close () {
  emit('update:visible', false)
  dialogConfig.value.visible = false
  form.value.resetFields()
  formData.value = {}
}

function create () {
  dialogConfig.value.title =
    data.value.boardType === 0 ? '新增板块' : '新增二级板块'
  formData.value = {}
}

function update () {
  dialogConfig.value.title =
    data.value.boardType === 0 ? '编辑板块' : '修改二级板块'
  formData.value = Object.assign({}, props.data.data)

  if (formData.value.cover) {
    // 需要变为一个对象  组件里需要imgUrl来展示图片
    formData.value.cover = {
      imgUrl: formData.value.cover
    }
  }
}

// 区分新增 | 编辑
function distinguish () {
  nextTick(() => {
    if (data.value.type === 'add') {
      create()
    } else if (data.value.type === 'update') {
      update()
    }

    formData.value.boardType = data.value.boardType
    if (data.value.boardType === 1) {
      formData.value.pBoardName = props.currentBoard.boardName // 展示一级板块信息
      formData.value.pBoardId = props.currentBoard.boardId
    } else {
      formData.value.pBoardId = 0
    }
  })
}

async function submitForm () {
  form.value.validate(async valid => {
    if (!valid) return
    let params = Object.assign({}, formData.value)
    delete params.children
    // 封面不是文件类型，设置为空
    if (!(params.cover instanceof File)) {
      delete params.cover
    }

    let result = await saveBoard(params)
    if (!result) return

    message.success('保存成功！')
    emit('reload')
    close()
  })
}
</script>

<style lang="scss"></style>
