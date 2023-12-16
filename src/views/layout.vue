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
        <div class="menu-penal"></div>
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
          <el-button-group :style="{ 'margin-left': '10px' }">
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
    <div>
      <router-view />
    </div>
    <!-- 登录 注册 -->
    <Login ref="login" />
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  nextTick,
  computed,
  onMounted,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import Login from "./login.vue";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const showHeader = ref(true);

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
onMounted(() => initScroll());
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 60px;
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
  }

  .user-info-penal {
    display: flex;
    width: 300px;

    span {
      margin-left: 3px;
    }
  }
}
</style>
