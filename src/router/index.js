import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout.vue'),
      redirect: '/forum/article',
      children: [
        {
          path: '/forum',
          name: '内容管理',
          children: [
            {
              path: 'article',
              name: '帖子管理',
              component: () => import('@/views/forum/article-list.vue')
            },
            {
              path: 'comment',
              name: '评论管理',
              component: () => import('@/views/forum/comment-list.vue')
            },
            {
              path: 'board',
              name: '板块管理',
              component: () => import('@/views/forum/board-list.vue')
            }
          ]
        },
        {
          path: '/user',
          name: '用户管理',
          children: [
            {
              path: 'list',
              name: '用户列表',
              component: () => import('@/views/user/user-list.vue')
            }
          ]
        },
        {
          path: '/settings',
          name: '设置',
          children: [
            {
              path: 'sys',
              name: '系统设置',
              component: () => import('@/views/settings/sys-settings.vue')
            }
          ]
        }
      ]
    }
  ]
})

export default router
