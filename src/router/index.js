import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('@/views/layout.vue'),
      children: [
        {
          path: '/',
          name: 'article',
          component: () => import('@/views/forum/article-list.vue')
        },
        {
          path: '/user/:userId',
          name: '用户信息',
          component: () => import('@/views/user/user.vue')
        },
        {
          path: '/forum/:pBoardId',
          name: '一级板块',
          component: () => import('@/views/forum/article-list.vue')
        },
        {
          path: '/forum/:pBoardId/:boardId/',
          name: '二级板块',
          component: () => import('@/views/forum/article-list.vue')
        },
        {
          path: '/post/:articleId/',
          name: '文章详情',
          component: () => import('@/views/forum/article-detail.vue')
        },
        {
          path: '/newPost',
          name: '发布文章',
          component: () => import('@/views/forum/edit-post.vue')
        },
        {
          path: '/editPost/:articleId',
          name: '编辑文章',
          component: () => import('@/views/forum/edit-post.vue')
        },
        {
          path: '/user/message/:type',
          name: '消息中心',
          component: () => import('@/views/user/message-list.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path.indexOf('/user') !== -1) {
    store.commit('setActivePBoardId', -1)
  }
  next()
})

export default router
