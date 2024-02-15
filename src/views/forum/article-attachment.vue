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
      <el-form :model="formData" label-width="100px" @submit.prevent>
        <el-form-item label="发布人">
          <avatar :userId="formData.userId" :width="40"></avatar>
          <span :style="{ 'margin-left': '5px' }">{{ formData.nickName }}</span>
        </el-form-item>
        <el-form-item label="文件名">
          {{ formData.fileName }}
        </el-form-item>
        <el-form-item label="大小">
          {{ utils.sizeToStr(formData.fileSize) }}
        </el-form-item>
        <el-form-item label="下载所需积分">
          {{ formData.integral }}
        </el-form-item>
        <el-form-item label="下载所需积分">
          <a
            target="_blank"
            :href="'/api/forum/attachmentDownload?fileId=' + formData.fileId"
            >下载</a
          >
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAttachment } from '@/model/api'
import utils from '@/utils/utils'

const dialogConfig = ref({
  visible: false,
  title: '附件信息',
  buttons: [
    {
      type: 'primary',
      text: '关闭',
      click: e => {
        dialogConfig.value.visible = false
      }
    }
  ]
})

const formData = ref({})
async function show (nickName, articleId) {
  dialogConfig.value.visible = true

  let result = await getAttachment({ articleId })
  if (!result) return

  formData.value = result.data
  formData.value.nickName = nickName
}

defineExpose({ show })
</script>

<style lang="scss"></style>
