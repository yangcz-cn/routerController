// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import config from './tools/config';
import Http from './tools/Http';
import Storage from './tools/Storage';
import VueCookies from 'vue-cookies';
import Common from './tools/Common';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ajax from './tools/ajax';


Vue.use(VueCookies);
Vue.use(ElementUI);

Vue.prototype.config = config;
Vue.prototype.Http = Http;
Vue.prototype.Storage = Storage;
Vue.prototype.Common = Common;
Vue.prototype.VueCookies = VueCookies;
Vue.prototype.ajax = ajax.ajax;


Vue.config.productionTip = false;

let juris = JSON.parse(VueCookies.get('juris'));
/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
  config.globalRouters.find(path => {
    if (to.path == path) {
      next();
    }
  });
  if (!juris) juris = JSON.parse(VueCookies.get('juris'));
  let username = VueCookies.get('username'), token = VueCookies.get('token');
  if (username && token && juris && juris.length > 0) {
    Http.token = token;
    //Http.post('/user/check',{username:username}).then(res=>{if(!res.success) next({path:'login'});});
    next();
  } else {
    console.error(username, token, juris);
    next({ path: 'login' })
  }
  next();
});

Common.writeRouter(juris, router);
router.addRoutes(router.options.routes);
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
