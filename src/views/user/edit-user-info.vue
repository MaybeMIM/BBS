<template>
  <Dialog
    :visible="dialogConfig.visible"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="450px"
    :showCancel="false"
    @close="dialogConfig.visible = false"
  >
    <el-form :model="formData" ref="form" label-width="50px" @submit.prevent>
      <el-form-item label="昵称" prop="niceName">
        {{ formData.nickName }}
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <CoverUpload
          v-model:modalValue="formData.avatar"
          :imageUrlPrefix="proxy.globalInfo.avatarUrl"
        ></CoverUpload>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="formData.sex">
          <el-radio :label="0">女</el-radio>
          <el-radio :label="1">男</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="简介" prop="desc">
        <el-input
          clearable
          placeholder="请输入简介"
          type="textarea"
          :rows="5"
          :maxlength="100"
          resize="none"
          show-word-limit
          v-model="formData.personDescription"
        ></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CoverUpload from '@/components/cover-upload.vue'
import { updateUserInfo } from '@/model/api.js'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const formData = ref({})
const form = ref()

const dialogConfig = reactive({
  visible: false,
  title: '编辑个人信息',
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: e => {
        handleUpdateUserInfo()
      }
    }
  ]
})

const emit = defineEmits(['resetUserInfo'])
async function handleUpdateUserInfo () {
  form.value.validate(async valid => {
    if (!valid) return

    let params = Object.assign({}, formData.value)
    let result = await updateUserInfo(params)

    if (!result) return
    dialogConfig.visible = false

    // 如果修改了头像 强制刷新
    if (params.avatar instanceof File) {
      router.go(0)
    } else {
      // 回传给父组件 更新信息
      emit('resetUserInfo', params)
    }
  })
}

function showEditUserInfo (userInfo) {
  dialogConfig.visible = true
  nextTick(() => {
    form.value.resetFields()
    const dataInfo = Object.assign({}, userInfo)
    dataInfo.avatar = {
      imageUrl: dataInfo.userId
    }
    formData.value = dataInfo
  })
}
defineExpose({ showEditUserInfo })
</script>

<style lang="scss"></style>
