// eslint-disable-next-line semi
import Vue from 'vue';
// eslint-disable-next-line semi
import Router from 'vue-router';

// 导入自动以组件
// import Login from "@/components/login.vue"
// import Home from '@/components/home.vue'
// import Users from '@/components/users/users.vue'
// import Rights from '@/components/rights/rights.vue'
// import Roles from '@/components/rights/roles.vue'
// import Categories from '@/components/products/categories.vue'
// import Goods from '@/components/products/goods.vue'
// import Add from '@/components/products/add.vue'

// 按需加载Login组件
// const Login = function() {
//   return import("@/components/login.vue");
// };
const Login = () =>
  import(/* webpackChunkName: 'login' */ '@/components/login.vue')
const Home = () =>
  import(/* webpackChunkName: 'home' */ '@/components/home.vue')
const Users = () =>
  import(/* webpackChunkName: 'user' */ '@/components/users/users.vue')
const Rights = () =>
  import(/* webpackChunkName: 'right' */ '@/components/rights/rights.vue')
const Roles = () =>
  import(/* webpackChunkName: 'right' */ '@/components/rights/roles.vue')
const Categories = () =>
  import(
    /* webpackChunkName: 'product' */ '@/components/products/categories.vue'
  )
const Goods = () =>
  import(/* webpackChunkName: 'product' */ '@/components/products/goods.vue')
const Add = () =>
  import(/* webpackChunkName: 'product' */ '@/components/products/add.vue')

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
