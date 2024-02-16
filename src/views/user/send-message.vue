<template>
  <div>
    <Dialog
      :visible="dialogConfig.visible"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
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
        <el-form-item label="消息内容" prop="message">
          <el-input
            clearable
            placeholder="请输入消息内容"
            type="textarea"
            :rows="5"
            :maxlength="200"
            resize="none"
            show-word-limit
            v-model.trim="formData.message"
          ></el-input>
        </el-form-item>
        <el-form-item label="积分" prop="integral">
          <el-input
            clearable
            placeholder="积分为空或者0,不增减积分,积分可以为负数"
            v-model="formData.integral"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { sendMessage } from '@/model/api'
import message from '@/utils/message'

const formData = ref({})
const form = ref()
const rules = {
  message: [{ required: true, message: '请输入消息内容' }],
  integral: [{ required: true, message: '请要增加或减少的积分' }]
}

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

function handleSendMessage (data) {
  dialogConfig.value.visible = true
  nextTick(() => {
    form.value.resetFields()
    formData.value = {
      userId: data.userId,
      nickName: data.nickName
    }
  })
}

// 发送消息
const emit = defineEmits(['reload'])
function submitForm () {
  form.value.validate(async valid => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, formData.value)
    let result = await sendMessage(params)
    if (!result) {
      return
    }
    dialogConfig.value.visible = false
    message.success('发送成功')
    emit('reload')
  })
}

defineExpose({ handleSendMessage })
</script>

<style lang="scss"></style>
