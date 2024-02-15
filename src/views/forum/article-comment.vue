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
      <div class="comment-list">
        <div class="comment-item" v-for="item in commentList">
          <div class="p-comment-item">
            <avatar :userId="item.userId" :width="40"></avatar>
            <div class="content-info">
              <a
                target="_blank"
                :href="proxy.globalInfo.webDomain + 'user/' + item.userId"
                >{{ item.nickName }}</a
              >
              <div v-html="item.content" class="comment-content"></div>
              <div v-if="item.imgPath">
                <CommentImage
                  :src="
                    proxy.globalInfo.imageUrl + item.imgPath.replace('.', '_.')
                  "
                  :imgList="[proxy.globalInfo.imageUrl + item.imgPath]"
                ></CommentImage>
              </div>
              <div class="post-info">
                发布:{{ item.postTime }}&nbsp;&nbsp;{{
                  item.userIpAddress
                }}&nbsp;&nbsp;赞:{{ item.goodCount }}
              </div>
              <div v-if="item.children">
                <div class="s-comment-item" v-for="sub in item.children">
                  <avatar :userId="sub.userId" :width="40"></avatar>
                  <div class="content-info">
                    <a
                      target="_blank"
                      :href="proxy.globalInfo.webDomain + 'user/' + sub.userId"
                      >{{ sub.nickName }}</a
                    >
                    <span v-if="sub.replyUserId"
                      >回复
                      <a
                        target="_blank"
                        :href="
                          proxy.globalInfo.webDomain + 'user/' + sub.replyUserId
                        "
                        >{{ sub.replyNickName }}</a
                      ></span
                    >
                    <div v-html="sub.content" class="comment-content"></div>
                    <div class="post-info">
                      发布:{{ sub.postTime }}&nbsp;&nbsp;{{
                        sub.userIpAddress
                      }}&nbsp;&nbsp;赞:{{ sub.goodCount }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="commentList.length === 0">暂无评论</div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import CommentImage from './comment-image.vue'
import { loadComment } from '@/model/api'

const { proxy } = getCurrentInstance()

const dialogConfig = ref({
  visible: false,
  title: '查看评论',
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

const commentList = ref([])

async function show (articleId) {
  dialogConfig.value.visible = true

  let result = await loadComment({ articleId })
  if (!result) return

  commentList.value = result.data
}

defineExpose({ show })
</script>

<style lang="scss" scoped>
.comment-list {
  .comment-item {
    margin-top: 10px;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
  }
  .p-comment-item {
    display: flex;
  }
  .content-info {
    margin-left: 5px;
  }
  .comment-content {
    margin: 5px 0;
  }
  .post-info {
    font-size: 12px;
    color: rgb(135, 130, 130);
  }
  .s-comment-item {
    display: flex;
    margin-top: 10px;
  }
}
</style>
