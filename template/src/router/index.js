import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 静态路由
export const staticRouterMap = [
    {
        path: '',
        component: () => import('@/views/index')
    }
]

// 异步动态路由
export const asyncRouterMap = []

export default new Router({
    routes: staticRouterMap
})
