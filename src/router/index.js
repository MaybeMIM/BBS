import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      component: () => import("@/views/layout.vue"),
      children: [{
        path: '/',
        name: 'article',
        component: () => import('@/views/forum/article-list.vue')
      }, {
        path: '/user/:userId',
        name: '用户信息',
        component: () => import('@/views/user/user.vue')
      },
      {
        path: '/forum/:pBoardId',
        name: '一级板块',
        component: () => import('@/views/forum/article-list.vue')
      }, {
        path: '/forum/:pBoardId/:boardId/',
        name: '二级板块',
        component: () => import('@/views/forum/article-list.vue')
      },

      ]
    },
  ],
});

export default router;
