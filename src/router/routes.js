import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          auth: true
        },
        component: _import('system/index')
      },
      {
        path: 'comment',
        name: 'comment',
        meta: {
          title: '评论管理',
          auth: true
        },
        component: _import('page/comment')
      },
      {
        path: 'user',
        name: 'user',
        meta: {
          title: '用户管理',
          auth: true
        },
        component: _import('page/user')
      },
      {
        path: 'invitation',
        name: 'invitation',
        meta: {
          title: '帖子管理',
          auth: true
        },
        component: _import('page/invitation')
      },
      {
        path: 'keyword',
        name: 'keyword',
        meta: {
          title: '关键字管理',
          auth: true
        },
        component: _import('page/keyword')
      },
      {
        path: 'fishFriends',
        name: 'fishFriends',
        meta: {
          title: '鱼友管理',
          auth: true
        },
        component: _import('page/fishFriends')
      },
      {
        path: 'advert',
        name: 'advert',
        meta: {
          title: '广告管理',
          auth: true
        },
        component: _import('page/advert')
      },
      {
        path: 'article',
        name: 'article',
        meta: {
          title: '咨询发布',
          auth: true
        },
        component: _import('page/article')
      },
      {
        path: 'article/edit',
        name: 'article/edit',
        meta: {
          title: '咨询发布',
          auth: true
        },
        component: _import('page/article/edit')
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          title: '角色管理',
          auth: true
        },
        component: _import('page/role')
      },
      // 系统 前端日志
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
