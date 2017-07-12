import Vue from 'vue'
import Router from 'vue-router'
// const Project = resolve => require(['@/components/Project'], resolve)
const Project = resolve => {
    // require.ensure 是 Webpack 的特殊语法，用来设置 code-split point
    // （代码分块）
    require.ensure(['@/components/Project'], () => {
      resolve(require('@/components/Project'))
    })
  }
  // import Project from '@/components/Project'
import Hello from '@/components/Hello'
import Index from '@/components/test/index'
import Login from '@/components/pages/login'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [{
    path: '/',
    name: 'default',
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    },
    component: Project,
    children: [{
      path: 'index',
      name: 'index',
      meta: {
        requireAuth: true
      },
      component: Index
    }, {
      path: 'statisticAnalysis',
      name: 'statisticAnalysis',
      meta: {
        requireAuth: true
      },
      component: require('@/components/pages/statisticAnalysis/statisticAnalysis')
    }]
  }, {
    path: '/hello',
    name: 'hello',
    meta: {
      requireAuth: true
    },
    component: Hello
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/project',
    name: 'project',
    component: Project,
    meta: {
      requireAuth: true
    }
  }]
})
