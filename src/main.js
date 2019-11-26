// import vue from 'vue'默认导入的是vue.runtime.esm.js
// eslint-disable-next-line semi
import Vue from 'vue';
// eslint-disable-next-line semi
import App from './App';
// eslint-disable-next-line semi
import router from './router';
// 引入element-ui
// eslint-disable-next-line semi
import ElementUI from 'element-ui';
// 引入ElementUI样式
// eslint-disable-next-line semi
import 'element-ui/lib/theme-chalk/index.css';

// 引入通用样式
// eslint-disable-next-line semi
import '@/assets/common.css';

// eslint-disable-next-line semi
import moment from 'moment';

// 引入富文本编辑器
// eslint-disable-next-line semi
import VueQuillEditor from 'vue-quill-editor';
// require styles
// eslint-disable-next-line semi
import 'quill/dist/quill.core.css';
// eslint-disable-next-line semi
import 'quill/dist/quill.snow.css';
// eslint-disable-next-line semi
import 'quill/dist/quill.bubble.css';

// 引入axios
// eslint-disable-next-line semi
import axios from 'axios';
// 把axios放到vue原型上，将来所有的vue实例都能用
Vue.prototype.axios = axios

// 把富文本编辑器 当初vue插件，这样以后所有的组件都可以用
Vue.use(VueQuillEditor /* { default global options } */)

// 给axiso配置默认值和给axios设置请求拦截器设置baseURL，效果一样
// 但是默认值会被axios中的值覆盖掉
// 默认值不设置会变化的值，token一直变化，不能用默认值
// eslint-disable-next-line semi
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

// 给axios设置请求拦截器
// 拦截器会覆盖掉axios中的值
axios.interceptors.request.use(
  function (config) {
    // 给config配置baseURL
    // config.baseURL = 'http://localhost:8888/api/private/v1/'
    // 给config配置baseURL
    config.headers.Authorization = localStorage.getItem('token')

    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 引入ElementUI插件
Vue.use(ElementUI)

// 定义过滤器
Vue.filter('dateFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input * 1000).format(format)
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,

  // render：createElement根据组件穿件元素，渲染到页面
  render: function (createElement) {
    return createElement(App)
  }
  // 简写
  // render: h => h(App)

  // 这里其实也可以这么写
  // components: {
  //   App: {App}
  // },
  // template: '<App></App>'
})
