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
      }]
    },
  ],
});

export default router;
