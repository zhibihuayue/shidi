import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const moduleRoutes = [
  /*{
    path: '/VideoManager',
    component: async () => await import('@/views/VideoManager.vue')
  },*/
  {
    path: '/bigScreen/monitorWarn',
    // component: async () => await import('@/views/allAlarm.vue')
    // component: async () => await import('@/views/VideoManager.vue')
    // component: async () => await import('@/views/EpidemicWood.vue')
    // component: async () => await import('@/views/BannerManager.vue')
    // component: async () => await import('@/views/localTest.vue')
    // component: async () => await import('@/views/ARVideoManager.vue')
    // component: async () => await import('@/views/dataCenter.vue')
    component: async () => await import('@/views/inspectionTask.vue')
    // component: async () => await import('@/views/NomalScreen.vue')
  }
  // {
  //   path: '/EpidemicWood',
  //   component: async () => await import('@/views/EpidemicWood.vue')
  // },
  // {
  //   path: '/BannerManager',
  //   component: async () => await import('@/views/BannerManager.vue')
  // },
  // {
  //   path: '/localTest',
  //   component: async () => await import('@/views/localTest.vue')
  // },
  // {
  //   path: '/ARVideoManager',
  //   component: async () => await import('@/views/ARVideoManager.vue')
  // },
  // {
  //   path: '/dataCenter',
  //   component: async () => await import('@/views/dataCenter.vue')
  // },
  // {
  //   path: '/',
  //   component: async () => await import('@/views/inspectionTask.vue')
  // },
  // {
  //   path: '/NomalScreen',
  //   component: async () => await import('@/views/NomalScreen.vue')
  // }
]

const router = new VueRouter({
  // mode: 'history',
  // base: '/bigScreen/monitorWarn/',
  // routes: moduleRoutes
  base: '/industry-11181', //端口降压
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: moduleRoutes
})

export default router
