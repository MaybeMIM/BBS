<template>
  <div class="cover-upload">
    <el-upload
      name="file"
      :show-file-list="false"
      accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.git,.GIT,.bmp,.BMP"
      :multiple="false"
      :http-request="uploadImage"
    >
      <div class="cover-upload-btn">
        <template v-if="localFile">
          <img :src="localFile" />
        </template>
        <template v-else>
          <!-- 前缀 + 上传之后的路径 -->
          <img
            :src="
              (imageUrlPrefix ? imageUrlPrefix : proxy.globalInfo.imageUrl) +
              modalValue.imageUrl
            "
            v-if="modalValue && modalValue.imageUrl"
          />
          <span class="iconfont icon-add"></span>
        </template>
      </div>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

const props = defineProps({
  modalValue: {
    type: Object,
    default: null
  },
  imageUrlPrefix: {
    type: String
  }
})

const emit = defineEmits()

const localFile = ref()

async function uploadImage (file) {
  file = file.file
  // 读取文件流
  let img = new FileReader()
  img.readAsDataURL(file)
  // 获取读取的图片数据
  img.onload = ({ target }) => {
    localFile.value = target.result
  }

  emit('update:modalValue', file)
}
</script>

<style lang="scss">
.cover-upload {
  .cover-upload-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    background: var(--text);
    .iconfont {
      font-size: 50px;
      color: #c4c4c4;
    }
    img {
      width: 100%;
    }
  }
}
</style>
