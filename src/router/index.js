import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'Home',
          component: () => import('../views/Home.vue')
        },
        {
          path: '/article-type',
          name: 'ArticleType',
          component: () => import('../views/article-type/articleType.vue')
        },
        {
          path: '/article',
          name: 'Article',
          component: () => import('../views/article/Article.vue')
        },
        // {
        //   path: '/role',
        //   name: 'role',
        //   component: () => import('../views/role/index.vue')
        // },
      ]
    },
    {
      path: '/add-article',
      name: 'AddArticle',
      component: () => import('../views/article/components/addArticle.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login/index.vue')
    },
  ],
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore() // 获取 auth 仓库实例
  if (to.name !== 'Login' && !userStore.token) {
    // 如果不是登录页面且没有 token，则跳转到登录页面
    next({ name: 'Login' })
  } else {
    next() // 否则继续导航
  }
})

export default router
