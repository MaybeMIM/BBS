<template>
  <div>
    <div class="header" v-if="showHeader">
      <div
        class="header_content"
        :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
      >
        <router-link to="/" class="header_logo">
          <!-- TODO:优化一下 用图标svg -->
          <img
            src="../assets/bbs_nav_icon.svg"
            alt="bbs_icon"
            class="bbs_icon"
          />
          <span class="header_title">BBS</span>
        </router-link>
        <!-- 模块信息 -->
        <div class="menu-penal">
          <span class="menu-item">全部</span>
          <template v-for="board in boardList">
            <el-popover
              placement="bottom-start"
              :width="300"
              trigger="hover"
              v-if="board.children.length > 0"
            >
              <template #reference>
                <span class="menu-item">{{ board.boardName }}</span>
              </template>
              <div class="sub-board-list">
                <span class="sub-board" v-for="subBoard in board.children">{{
                  subBoard.boardName
                }}</span>
              </div>
            </el-popover>
            <span class="menu-item" v-else>{{ board.boardName }}</span>
          </template>
        </div>
        <!-- 登录注册 / 用户信息 -->
        <div class="user-info-penal">
          <div class="op-btn">
            <el-button type="primary">
              发帖<span class="iconfont icon-add"></span>
            </el-button>
            <el-button type="primary">
              搜索<span class="iconfont icon-search"></span>
            </el-button>
          </div>
          <!-- 显示用户头像以及消息 -->
          <template v-if="userInfo.userId">
            <div class="message-info">
              <el-dropdown>
                <!-- 🔔 消息按钮与消息数量 -->
                <el-badge :value="12" class="item">
                  <div class="iconfont icon-message"></div>
                </el-badge>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>回复我的</el-dropdown-item>
                    <el-dropdown-item>赞了我的文章</el-dropdown-item>
                    <el-dropdown-item>赞了我的评论</el-dropdown-item>
                    <el-dropdown-item>下载了我的文章</el-dropdown-item>
                    <el-dropdown-item>系统消息</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="user-info">
              <el-dropdown>
                <!-- 头像 -->
                <avatar :userId="userInfo.userId" :width="50"></avatar>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>我的主页</el-dropdown-item>
                    <el-dropdown-item>退出</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <!-- 显示登录注册 -->
          <el-button-group v-else :style="{ 'margin-left': '10px' }">
            <el-button type="primary" plain @click="loginAndResign(1)"
              >登录</el-button
            >
            <el-button type="primary" plain @click="loginAndResign(0)"
              >注册</el-button
            >
          </el-button-group>
        </div>
      </div>
    </div>
    <div class="body-content">
      <router-view />
    </div>
    <!-- 登录 注册 -->
    <Login ref="login" />
  </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance, onMounted } from "vue";
import Login from "./login.vue";
import store from "@/store";
const { proxy } = getCurrentInstance();

const showHeader = ref(true);

// TODO：优化这个api(放数据模型类 或者 接口文件)
const api = {
  getUserInfo: "/getUserInfo",
  loadBoard: "/board/loadBoard",
};

// 获取滚动条高度 (用于header的行为)
const getScrollTop = () => {
  return document.documentElement.scrollTop || document.body.scrollTop;
};
function initScroll() {
  let initScrollTop = getScrollTop();
  let scrollType = 0;
  window.addEventListener("scroll", () => {
    let currentScrollTop = getScrollTop();
    if (currentScrollTop > initScrollTop) {
      // 往下滚动
      scrollType = 1;
    } else {
      scrollType = 0;
    }
    initScrollTop = currentScrollTop;
    if (scrollType === 1 && currentScrollTop > 150) {
      showHeader.value = false;
    } else {
      showHeader.value = true;
    }
  });
}

// 登录 注册
const login = ref();
function loginAndResign(type) {
  login.value.showPanel(type);
}

// 用户信息
const userInfo = ref({});
// 监听 登录用户信息
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal !== undefined && newVal !== null) {
      userInfo.value = newVal;
    } else {
      userInfo.value = {};
    }
  },
  { immediate: true, deep: true }
);

// 监听是否展示登录框
watch(
  () => store.state.showLogin,
  (newVal, oldVal) => {
    if (newVal) {
      loginAndResign(1);
    }
  },
  { immediate: true, deep: true }
);

// 获取用户信息
async function getUserInfo() {
  let result = await proxy.Request({
    url: api.getUserInfo,
  });

  if (!result) return;
  // 无出错 更新当前用户信息
  store.commit("updateLoginUserInfo", result.data);
}

// 获取板块信息
const boardList = ref([]);
async function loadBoard() {
  let result = await proxy.Request({
    url: api.loadBoard,
  });

  if (!result) return;
  boardList.value = result.data;
}

onMounted(() => {
  initScroll();
  getUserInfo();
  loadBoard();
});
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 60px;
  top: 0;
  position: fixed;
  box-shadow: 0 2px 6px 0 #50a7d9;
  z-index: 999;
  background: #f3f2f2;
  transition: all 0.3s;

  &_content {
    display: flex;
    height: 60px;
    align-items: center;
    margin: 0px auto;
  }

  &_logo {
    display: flex;
    align-items: center;
    .bbs_icon {
      width: 90px;
    }
  }

  &_title {
    font-size: 36px;
    color: #585858;
    margin-left: 5px;
  }
  .menu-penal {
    flex: 1;
    .menu-item {
      cursor: pointer;
      margin-left: 20px;
    }
  }

  .user-info-penal {
    display: flex;
    width: 300px;
    align-items: center;
    span {
      margin-left: 3px;
    }
    .message-info {
      .icon-message {
        font-size: 25px;
        color: rgb(147, 147, 147);
      }
      margin: 0 25px 0 5px;
      cursor: pointer;
    }
  }
}
.sub-board-list {
  display: flex;
  flex-wrap: wrap;
  .sub-board {
    padding: 0 10px;
    border-radius: 20px;
    margin-right: 10px;
    margin-top: 5px;
    background: #ebeaea;
    border: 1px solid #ddd;
    color: rgb(109, 108, 108);
    cursor: pointer;
  }
  .sub-board:hover {
    color: var(--link);
  }
}
.body-content {
  margin-top: 60px;
  position: relative;
}
</style>
