<template>
  <div class="layout-body">
    <el-container>
      <el-aside class="aside" :style="{ width: asideWidth + 'px' }">
        <div class="logo">
          <span v-if="!menuCollapse">EasyBBS管理后台</span>
        </div>
        <div class="menu-panel">
          <el-menu
            :default-openeds="defaultOpeneds"
            :collapse-transition="false"
            :collapse="menuCollapse"
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#3d3c4a"
            text-color="#fff"
            active-text-color="#ddd"
            router
            :defaultActive="defaultActive"
          >
            <template v-for="item in menuList">
              <el-sub-menu :index="item.path" v-if="item.children">
                <template #title>
                  <i :class="['iconfont', item.icon]"></i>
                  <span class="menu-name">{{ item.menuName }}</span>
                </template>
                <el-menu-item
                  v-for="subItem in item.children"
                  :index="subItem.path"
                >
                  <span class="menu-name">{{ subItem.menuName }}</span>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="item.path">
                <template #title>
                  <i :class="['iconfont', item.icon]"></i>
                  <span class="menu-name">{{ item.menuName }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div
            :class="[
              'op-menu',
              'iconfont',
              menuCollapse ? 'icon-expand' : 'icon-collapse'
            ]"
            @click="openMenu"
          ></div>
          <!-- 面包屑 -->
          <div class="menu-bread">
            <el-breadcrumb>
              <template v-for="item in menuBreadCrumbList">
                <el-breadcrumb-item v-if="item.name">
                  {{ item.name }}
                </el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </div>
        </el-header>

        <el-main> </el-main
      ></el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

// 系统菜单
const menuList = [
  {
    menuName: '内容管理',
    icon: 'icon-article',
    path: '/forum',
    children: [
      {
        menuName: '帖子管理',
        path: '/forum/article'
      },
      {
        menuName: '评论管理',
        path: '/forum/comment'
      },
      {
        menuName: '板块管理',
        path: '/forum/board'
      }
    ]
  },
  {
    menuName: '用户管理',
    icon: 'icon-user',
    path: '/user',
    children: [
      {
        menuName: '用户列表',
        path: '/user/list'
      }
    ]
  },
  {
    menuName: '设置',
    icon: 'icon-settings',
    path: '/settings',
    children: [
      {
        menuName: '系统设置',
        path: '/settings/sys'
      }
    ]
  }
]

// 默认打开菜单
const defaultOpeneds = ref([])
// 面包屑
const menuBreadCrumbList = ref([])

function init () {
  menuList.forEach(item => {
    defaultOpeneds.value.push(item.path)
  })
}
init()

// 默认选中
const defaultActive = ref()
watch(
  () => route,
  (newVal, oldVal) => {
    defaultActive.value = route.path
    menuBreadCrumbList.value = route.matched
  },
  { immediate: true, deep: true }
)

// 侧边栏宽度
const asideWidth = ref(250)
// 打开关闭菜单
const menuCollapse = ref(false)
// 侧边菜单展开关闭
function openMenu () {
  menuCollapse.value = !menuCollapse.value
  if (menuCollapse.value) {
    asideWidth.value = 63
  } else {
    asideWidth.value = 250
  }
}
</script>

<style lang="scss">
.layout-body {
  .aside {
    background: #3d3c4a;
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      color: #fff;
      background: #191828;
      font-size: 18px;
      padding-left: 5px;
    }
    .menu-panel {
      height: calc(100vh - 50px);
      .menu-name {
        padding-left: 10px;
      }
      // 去除边框
      .el-menu {
        border-right: none;
      }
      // 菜单颜色
      .el-menu-item {
        background: #353544;
      }
      .el-menu-item.is-active {
        color: #fff;
        background: #0577e9;
      }
      .el-menu-item:hover {
        color: #d8d8ee;
      }
    }
  }
  .header {
    display: flex;
    align-items: center;
    background: rgb(34, 35, 35);
    border-bottom: 1px solid #ddd;
    height: 50px;
    line-height: 50px;
    padding: 0 10px !important;
    .op-menu {
      font-size: 20px;
      cursor: pointer;
      color: #fff;
    }
    .menu-bread {
      margin-left: 10px;
      .el-breadcrumb__inner {
        color: #979187;
      }
    }
  }
}
// 侧边栏收起
.el-popper {
  border: none !important;
  .el-menu-item.is-active {
    color: #fff;
    background: #0577e9;
  }
  .el-menu-item:hover {
    color: #d8d8ee;
  }
  .el-menu-popup {
    padding: 0;
  }
}
</style>
