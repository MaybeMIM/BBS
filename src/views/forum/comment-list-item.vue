<template>
  <div class="comment-item">
    <Avatar :userId="commentData.userId" :width="50"></Avatar>
    <div class="comment-info">
      <div class="nick-name">
        <span class="name">{{ commentData.nickName }}</span>
        <span class="tag-author" v-if="commentData.userId === articleUserId"
          >作者</span
        >
      </div>
      <div class="comment-content">
        <span v-html="commentData.content"></span>
      </div>
      <div class="op-panel">
        <div class="time">
          <span>{{ commentData.postTime }}</span>
          <span class="address"
            >&nbsp;·&nbsp;{{ commentData.userIpAddress }}</span
          >
        </div>
        <div class="iconfont icon-good">
          {{ commentData.goodCount > 0 ? commentData.goodCount : '点赞' }}
        </div>
        <div class="iconfont icon-comment">回复</div>
        <el-dropdown v-if="articleUserId === currentUserId">
          <div class="iconfont icon-more"></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                {{ commentData.topType === 0 ? '设为置顶' : '取消置顶' }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  commentData: Object,
  articleUserId: String,
  currentUserId: String
})
</script>

<style lang="scss">
.comment-item {
  display: flex;
  padding-top: 15px;

  .comment-info {
    flex: 1;
    margin-left: 10px;
    border-bottom: 1px solid #656564;
    padding-bottom: 15px;
    .nick-name {
      .name {
        font-size: 14px;
        color: #958e85;
        margin-right: 10px;
        cursor: pointer;
      }
      .tag-author {
        background: var(--pink);
        font-size: 12px;
        color: #fff;
        border-radius: 2px;
      }
    }
    .comment-content {
      margin-top: 6px;
      font-size: 15px;
      line-height: 22px;
    }
    .op-panel {
      display: flex;
      margin-top: 5px;
      font-size: 13px;
      align-items: center;
      color: #958e85;
      .time {
        margin-right: 20px;
      }
      .iconfont {
        margin-right: 15px;
        font-size: 14px;
        &::before {
          margin-right: 3px;
        }
      }
    }
  }
}
</style>
