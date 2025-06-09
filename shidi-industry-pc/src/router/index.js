/*
 * @Author: fanzhiwei
 * @Date: 2024-06-25 14:25:29
 * @LastEditors: fanzhiwei
 * @LastEditTime: 2024-06-25 19:43:07
 * @FilePath: /shidi-industry/shidi-industry-pc/src/router/index.js
 * @Description: 
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const constantRoutes = [

  {
    // 全域感知
    path: '/bigScreen/monitorWarn', component: () => import('@/views/homePage.vue'),//线上
  },
  {
    path: '/wetlandWork/index', component: () => import('@/views/wetlandWork/index.vue'),//表格页
  },
  {
    path: '/wetlandWork/addInfo', component: () => import('@/views/wetlandWork/component/addInfo.vue'),//新增编辑数据
  },
  {
    path: '/wetlandWork/detailInfo', component: () => import('@/views/wetlandWork/component/detailInfo.vue'),//详情页
  },

  {
    path: '/wetlandAnimal/index', component: () => import('@/views/wetlandAnimal/index.vue'),//表格页
  },
  {
    path: '/wetlandAnimal/addInfo', component: () => import('@/views/wetlandAnimal/component/addInfo.vue'),//新增编辑数据
  },
  {
    path: '/wetlandAnimal/detailInfo', component: () => import('@/views/wetlandAnimal/component/detailInfo.vue'),//详情页
  },
]

const router = new VueRouter({
  base: '/industry-11181', //端口降压
  // base: '',
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export default router