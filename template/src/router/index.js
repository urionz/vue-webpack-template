import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout'

Vue.use(Router)

// 静态路由
export const staticRouterMap = [
    {
        path: '/passport/login',
        component: () => import('@/views/passport/login')
    },
    {
        path: '/passport/redirect',
        component: () => import('@/views/passport/redirect')
    },
    {
        path: '',
        component: Layout,
        redirect: 'dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard'),
                name: 'dashboard'
            }
        ]
    }
]

// 异步动态路由
export const asyncRouterMap = [
    {
        path: 'permission',
        component: Layout,
        redirect: '/permission',
        children: [
            {
                path: 'page',
                component: () => import('@/views/permission/page'),
                name: 'pagePermission'
            }
        ]
    }
]

export default new Router({
    routes: staticRouterMap
})
