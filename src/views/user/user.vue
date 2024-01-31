<template>
  <div
    class="container-body user-center"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="user-nav">
      <router-link to="/">首页</router-link>
      <span class="iconfont icon-right"></span>
      <span>个人中心</span>
    </div>
    <div class="user-panel">
      <div class="user-side">
        <!-- 头像一栏信息 -->
        <div class="avatar-panel">
          <div class="edit-btn" v-if="isCurrentUser" @click="showEditUserInfo">
            修改资料
          </div>
          <div class="avatar-inner">
            <Avatar :userId="userInfo.userId" :width="120"></Avatar>
          </div>
          <div class="nick-name">
            <span class="name">{{ userInfo.nickName }}</span>
            <span v-if="userInfo.sex === 0" class="iconfont icon-woman"></span>
            <span v-if="userInfo.sex === 1" class="iconfont icon-man"></span>
          </div>
          <div class="desc">
            {{
              userInfo.personDescription
                ? userInfo.personDescription
                : '暂无简介'
            }}
          </div>
        </div>
        <!-- 扩展信息 -->
        <div class="user-extend-panel">
          <div class="info-item">
            <div class="label iconfont icon-integral">积分</div>
            <div
              class="value a-link"
              v-if="isCurrentUser"
              @click="showIntegralRecord"
            >
              {{ userInfo.currentIntegral }}
            </div>
            <div class="value" v-else>
              {{ userInfo.currentIntegral }}
            </div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-like">获赞</div>
            <div class="value">{{ userInfo.likeCount }}</div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-post">发帖</div>
            <div class="value">{{ userInfo.postCount }}</div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-register">加入</div>
            <div class="value">{{ userInfo.joinTime }}</div>
          </div>
          <div class="info-item">
            <div class="label iconfont icon-login">最后登录</div>
            <div class="value">{{ userInfo.lastLoginTime }}</div>
          </div>
        </div>
      </div>
      <div class="article-panel">
        <el-tabs :model-value="activeTabName" @tab-change="changeTab">
          <el-tab-pane label="发帖" :name="0"></el-tab-pane>
          <el-tab-pane label="评论" :name="1"></el-tab-pane>
          <el-tab-pane label="点赞" :name="2"></el-tab-pane>
        </el-tabs>
        <div class="article-list">
          <DataList
            :loading="loading"
            :dataSource="articleListInfo"
            emptyMsg="暂无相关文章"
            @loadData="loadArticle"
          >
            <template #default="{ data }">
              <ArticleListItem :data="data" />
            </template>
          </DataList>
        </div>
      </div>
    </div>
    <!-- 编辑用户信息 -->
    <EditUserInfo
      ref="editUserInfo"
      @reset-user-info="handleReset"
    ></EditUserInfo>
    <!-- 用户积分 -->
    <UserIntegral ref="integralRecord"></UserIntegral>
  </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataList from '@/components/data-list.vue'
import ArticleListItem from '@/views/forum/article-list-item.vue'
import EditUserInfo from './edit-user-info.vue'
import UserIntegral from './user-integral.vue'
import { getUserInfo, loadUserArticle } from '@/model/api.js'
import store from '@/store'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const userId = ref(null)
const userInfo = ref({})
const isCurrentUser = ref(false)

const articleListInfo = ref({})
const loading = ref(false)

const activeTabName = ref(0)

// 监听登录用户信息
// 登录后
watch(
  () => store.state.loginUserInfo,
  () => {
    resetCurrentUser()
  },
  { immediate: true, deep: true }
)

// 监听路由上的userId (原是onMounted 但是因为watch优先onMounted触发)
// 登录前
watch(
  () => route.params.userId,
  (newVal, oldVal) => {
    if (newVal) {
      userId.value = newVal
      resetCurrentUser()
      loadUserInfo()
      loadArticle()
    }
  },
  { immediate: true, deep: true }
)

async function loadUserInfo () {
  // 用户不存在或者其他情况
  const errorCallback = () => {
    setTimeout(() => {
      router.push('/')
    }, 1500)
  }

  let result = await getUserInfo({ userId: userId.value }, errorCallback)

  if (!result) return

  userInfo.value = result.data
}

// 重新设置当前用户
function resetCurrentUser () {
  const loginUserInfo = store.getters.getLoginUserInfo

  if (loginUserInfo && loginUserInfo.userId === userId.value) {
    isCurrentUser.value = true
  } else {
    isCurrentUser.value = false
  }
}

// 右侧文章
function changeTab (type) {
  activeTabName.value = type
  loadArticle()
}

async function loadArticle () {
  if (loading.value) return
  loading.value = true

  let params = {
    pageNo: articleListInfo.value.pageNo,
    type: activeTabName.value,
    userId: userId.value
  }

  // 有了骨架就不需要遮罩loading
  let result = await loadUserArticle(params, false)

  loading.value = false
  if (!result) return

  articleListInfo.value = result.data
}

// 修改用户信息
const editUserInfo = ref()
function showEditUserInfo () {
  editUserInfo.value.showEditUserInfo(userInfo.value)
}

// 更新用户信息
function handleReset (data) {
  userInfo.value = data
}

// 用户积分记录
const integralRecord = ref()
function showIntegralRecord () {
  integralRecord.value.showRecord()
}
</script>

<style lang="scss">
.user-center {
  .user-nav {
    font-size: initial;
    color: #c4c4c4;
    line-height: 35px;
    .icon-right {
      padding: 0 5px;
    }
  }
  .user-panel {
    display: flex;
    .user-side {
      width: 300px;
      margin-right: 10px;
      .avatar-panel {
        background: #fff;
        text-align: center;
        padding: 10px;
        position: relative;
        .edit-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 14px;
          color: var(--link);
          cursor: pointer;
        }
        .avatar-inner {
          display: flex;
          justify-content: center;
        }
        .nick-name {
          .name {
            margin-left: 21px;
          }
          .icon-man {
            margin-left: 5px;
            color: var(--link);
          }
          .icon-woman {
            margin-left: 5px;
            color: var(--pink);
          }
        }
        .desc {
          text-align: center;
          margin-top: 5px;
          font-size: 14px;
          color: #868686;
        }
      }
      .user-extend-panel {
        margin-top: 10px;
        padding: 10px;
        background: #fff;
        .info-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          line-height: 30px;
          .label {
            display: flex;
            align-items: center;
            font-size: 13px;
          }
          .iconfont::before {
            font-size: 20px;
            padding-right: 5px;
            color: #868686;
          }
          .value {
            font-size: 13px;
          }
          .a-link {
            color: var(--link);
            cursor: pointer;
          }
        }
      }
    }
    .article-panel {
      flex: 1;
      background: rgba(0, 0, 0, 0.2);
      padding: 0 10px 10px 10px;
    }
  }
}
</style>
