// eslint-disable-next-line semi
import Vue from 'vue';
// eslint-disable-next-line semi
import Router from 'vue-router';

// 导入自动以组件
// eslint-disable-next-line semi
import Login from '@/components/login.vue';
// eslint-disable-next-line semi
import Home from '@/components/home.vue';
// eslint-disable-next-line semi
import Users from '@/components/users/users.vue';
// eslint-disable-next-line semi
import Rights from '@/components/rights/rights.vue';
// eslint-disable-next-line semi
import Roles from '@/components/rights/roles.vue';
// eslint-disable-next-line semi
import Categories from '@/components/products/categories.vue';
// eslint-disable-next-line semi
import Goods from '@/components/products/goods.vue';
// eslint-disable-next-line semi
import Add from '@/components/products/add.vue';

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      // 给home路由配置子路由
      children: [
        {
          // Users 会被渲染在 Home 的 <router-view> 中
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/rights',
          name: 'rights',
          component: Rights
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/goods-add',
          name: 'goods-add',
          component: Add
        }
      ]
    }
  ]
})

// 给router注册导航守卫
// to：要到哪儿去
// from：从哪儿来
// next()放行，next('/login')去登入页

router.beforeEach((to, from, next) => {
  // 如果login也要放行，不然死循环
  // token中是否有值
  let token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    // 如果有值，放行
    next()
  } else {
    // 如果没有token，去登入页
    next('/login')
  }
})

export default router
