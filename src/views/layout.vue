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

        <el-main class="main-content">
          <div class="tag-content">
            <el-tabs
              type="border-card"
              v-model="defaultActive"
              @tab-change="tabClick"
              @edit="tabClose"
            >
              <el-tab-pane
                v-for="item in tabList"
                :name="item.path"
                :label="item.menuName"
                :closable="tabList.length > 1"
              ></el-tab-pane>
            </el-tabs>
          </div>
          <div class="container-body">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

const menuMap = {}
function init () {
  menuList.forEach(item => {
    defaultOpeneds.value.push(item.path)
    // 作一个路由映射关系 方便后续点击菜单添加tab获取属性
    item.children.forEach(subItem => {
      menuMap[subItem.path] = subItem
    })
  })
}
init()

// tab 操作
const tabList = ref([])
function tabClick (e) {
  // 切换路由
  router.push(e)
}
// 关闭tabs
function tabClose (targetKey, action) {
  if (action !== 'remove') return
  // 当前路由
  let currentPath = defaultActive.value
  let tabs = tabList.value
  // 关闭当前选中的tab
  if (targetKey === defaultActive.value) {
    tabs.forEach((tab, index) => {
      if (tab.path === targetKey) {
        // 关闭当前tab 会先切换后面的tab 如果没有再切换到前一个的tab
        let nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          currentPath = nextTab.path
        }
      }
    })
  }
  tabList.value = tabs.filter(tab => {
    // 过滤掉当前关闭的tab
    return tab.path !== targetKey
  })

  if (currentPath !== defaultActive.value) {
    router.push(currentPath)
  }
}

// 默认选中
const defaultActive = ref()
watch(
  () => route,
  (newVal, oldVal) => {
    defaultActive.value = route.path
    menuBreadCrumbList.value = route.matched

    // 不允许重复push
    let currentMenu = tabList.value.find(item => {
      return item.path === defaultActive.value
    })
    if (!currentMenu) {
      tabList.value.push(menuMap[route.path])
    }
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
  .main-content {
    padding: 0;
    .tag-content {
      .el-tabs--border-card {
        border: none;
      }
      .el-tabs__content {
        display: none;
      }
    }
    .content-body {
      overflow: hidden;
      padding: 10px 10px 5px 10px;
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
