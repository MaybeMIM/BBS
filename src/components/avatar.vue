<template>
  <div
    class="avatar"
    :style="{
      width: width + 'px',
      height: width + 'px',
      'border-radius': width / 2 + 'px'
    }"
  >
    <el-image
      v-if="userId"
      :style="{
        width: width + 'px',
        height: width + 'px',
        'border-radius': width / 2 + 'px'
      }"
      :src="proxy.globalInfo.avatarUrl + userId"
      fit="scale-down"
      loading="lazy"
      @click="jumpPage"
    >
    </el-image>
    <div v-else class="no-login">未登录</div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const router = useRouter()

const props = defineProps({
  userId: {
    type: String
  },
  width: {
    type: Number,
    default: 60
  },
  addLink: {
    type: Boolean,
    default: true
  }
})

function jumpPage () {
  if (props.addLink) {
    router.push('/user/' + proxy.userId)
  }
}
</script>

<style lang="scss">
.avatar {
  display: flex;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  background: #666666;
  .no-login {
    width: 100%;
    text-align: center;
    font-size: 13px;
  }
}
</style>
