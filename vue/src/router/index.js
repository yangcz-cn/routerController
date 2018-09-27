import Common from '../tools/Common'
import Vue from 'vue'
import Router from 'vue-router'
import error404 from '@/view/error404'
import error500 from '@/view/error500'
import login from '@/view/user/login'
import min from '@/view/min'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: '管理中心',
      component: min,
      children:[
        //{
        //  path:'/admin',
        //  name:'管理中心',
        //  component:Common.require('/index.vue'),
        //}
      ]
  },
  {
    path:'*',
    name:'not find',
    component:error404
  },
  {
      path:'/error',
      name:'Error:500',
      component:error500
  },
    {
      path:'/login',
      name:'登录',
      component:login
    },
  ]
})
