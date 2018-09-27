# admin

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
#
#前端 vue+vue-router+elementUi+(H+基本架构与css)+axios+vue-cookies
#后端 nodejs express +mysql
# 前后端分离 通过axios请求 nodejs 暴露的接口  操作mysql
################# 基本功能权限功能实现 #######################
通过 登录 获取用户自己的权限(其实也就是 vue-router 的路由)，并存储入cookie，将所有的权限 写入 vue 的路由 进入首页 ，对比 配置中（/src/tools/config.js =>menu）的菜单，将拥有权限的菜单写入min.vue 的 数据中 拥有菜单

