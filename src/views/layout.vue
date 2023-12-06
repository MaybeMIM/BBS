<template>
  <div>
    <div class="header">
      <div
        class="header_content"
        :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
      >
        <router-link to="/" class="header_logo">
          <!-- TODO:优化一下 用图标svg -->
          <span
            v-for="(item, index) in logoInfo"
            :style="{ color: item.color }"
            :key="index"
            >{{ item.letter }}</span
          >
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
            <el-button type="primary" plain>登录</el-button>
            <el-button type="primary" plain>注册</el-button>
          </el-button-group>
        </div>
      </div>
    </div>
    <div>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const logoInfo = [
  {
    letter: "B",
    color: "red",
  },
  {
    letter: "B",
    color: "green",
  },
  {
    letter: "S",
    color: "blue",
  },
];
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 60px;
  position: fixed;
  box-shadow: 0 2px 6px 0 #ddd;
  &_content {
    display: flex;
    height: 60px;
    align-items: center;
    margin: 0px auto;
  }
  &_logo {
    display: block;
    margin-right: 5px;
    text-decoration: none;
    font-size: 30px;
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
