<template>
  <div>
    <el-form
      :model="formData"
      :rules="rules"
      ref="form"
      label-width="150px"
      :style="{ width: '800px', margin: 'auto' }"
      @submit.prevent
    >
      <el-divider content-position="left">用户注册欢迎消息</el-divider>
      <el-row>
        <el-col :span="24">
          <el-form-item label="欢迎消息" prop="registerWelcomInfo">
            <el-input
              clearable
              placeholder="请输入注册欢迎消息"
              v-model.trim="formData.registerWelcomInfo"
              maxlength="250"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">邮件设置</el-divider>
      <el-row>
        <el-col :span="24">
          <el-form-item label="邮件标题" prop="emailTitle">
            <el-input
              clearable
              placeholder="请输入邮件标题"
              v-model.trim="formData.emailTitle"
              maxlength="200"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="邮件内容" prop="emailContent">
            <el-input
              clearable
              placeholder="请输入邮件内容,验证码使用&s占位符"
              v-model.trim="formData.emailContent"
              maxlength="300"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">审核设置</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="帖子是否需要审核" prop="postAudit">
            <el-radio-group v-model="formData.postAudit">
              <el-radio :label="true">需要审核</el-radio>
              <el-radio :label="false">无需审核</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="评论是否需要审核" prop="commentAudit">
            <el-radio-group v-model="formData.commentAudit">
              <el-radio :label="true">需要审核</el-radio>
              <el-radio :label="false">无需审核</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">发帖设置</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发帖积分" prop="postIntegral">
            <el-input
              placeholder="请输入发帖可以获得的积分"
              v-model.trim="formData.postIntegral"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="每天可发帖数量" prop="postDayCountThreshold">
            <el-input
              placeholder="请输入每天可发帖数量"
              v-model.trim="formData.postDayCountThreshold"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="每天可上传图片数量" prop="dayImageUploadCount">
            <el-input
              placeholder="请输入每天可上传图片数量"
              v-model.trim="formData.dayImageUploadCount"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="允许附件大小(MB)" prop="attachmentSize">
            <el-input
              placeholder="请输入允许附件最大大小"
              v-model.trim="formData.attachmentSize"
            >
              <template #append>MB</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">评论设置</el-divider>
      <el-row>
        <el-col :span="24">
          <el-form-item label="是否开启评论" prop="commentOpen">
            <el-radio-group v-model="formData.commentOpen">
              <el-radio :label="true">开启</el-radio>
              <el-radio :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="评论积分" prop="commentIntegral">
            <el-input
              placeholder="请输入评论可获得的积分"
              v-model.trim="formData.commentIntegral"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="每天可发评论数量"
            prop="commentDayCountThreshold"
          >
            <el-input
              placeholder="请输入每天可发评论数量"
              v-model.trim="formData.commentDayCountThreshold"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">点赞设置</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="每天可点赞数量" prop="likeDayCountThreshold">
            <el-input
              placeholder="请输入每天可点赞数量"
              v-model="formData.likeDayCountThreshold"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="" prop="">
        <el-button type="primary" @click="handleSaveSetting">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import verify from '@/utils/verify'
import message from '@/utils/message'
import { getSetting, saveSetting } from '@/model/api'

const formData = ref({})
const form = ref()
const rules = {
  registerWelcomInfo: [{ required: true, message: '请输入欢迎消息' }],
  emailTitle: [{ required: true, message: '请输入邮件标题' }],
  emailContent: [{ required: true, message: '请输入邮件内容' }],
  postAudit: [{ required: true, message: '请选择帖子是否需要审核' }],
  commentAudit: [{ required: true, message: '请选择评论是否需要审核' }],
  postIntegral: [
    { required: true, message: '请输入发帖积分' },
    { validator: verify.number, message: '请输入正确的数字' }
  ],
  postDayCountThreshold: [
    { required: true, message: '请输入每天可发帖数量' },
    { validator: verify.number, message: '请输入正确的数字' }
  ],
  dayImageUploadCount: [
    { required: true, message: '请输入每天可上传图片数量' },
    { validator: verify.number, message: '请输入正确的数字' }
  ],
  attachmentSize: [
    { required: true, message: '请输入允许附件最大大小' },
    { validator: verify.number, message: '请输入正确的数字' }
  ],
  commentOpen: [{ required: true, message: '请选择是否开启评论' }],
  commentIntegral: [{ required: true, message: '请输入评论可获得的积分' }],
  commentDayCountThreshold: [
    { required: true, message: '请输入每天可发评论数量' },
    { validator: verify.number, message: '请输入正确的数字' }
  ],
  likeDayCountThreshold: [
    { required: true, message: '请输入每天可点赞数量' },
    { validator: verify.number, message: '请输入正确的数字' }
  ]
}

// 获取系统配置信息
async function getSettings () {
  let result = await getSetting()

  if (!result) return

  let resultData = result.data
  // 循环后端提供的对象 拿到每一个表单的值
  for (let item in resultData) {
    let subData = resultData[item]
    if (subData !== null) {
      for (let sub in subData) {
        formData.value[sub] = subData[sub]
      }
    }
  }
}
getSettings()

// 需要开启访客端程序
async function handleSaveSetting () {
  form.value.validate(async valid => {
    if (!valid) {
      return
    }
    let result = await saveSetting(formData.value)
    if (!result) return
    message.success('保存成功')
  })
}
</script>

<style lang="scss"></style>
