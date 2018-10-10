# 添加接口模块，配置后端的接口调用。
在src文件下新增interface文件夹，目的用来保存所有接口信息，建议一个模块一个接口文件，便于管理维护。
其中allInterface.js文件的目的是将所有的接口合并，目的在ajax调用时就不需要根据所要调用的接口来找不同的模块接口文件了。
## 接口的配置。
例：{'登录': { url: '/user/login', method: 'post' },'验证码': { url: "/pub/getCheckCode", method: 'get', responseType: 'blob' }····}。url:接口地址，method:请求方式，responseType：'返回数据类型'
##接口调用。
如想在全局通过this的方式调用，请按照如下步骤操作：
1、在入口文件引用ajax.js文件，ajax.js文件路径：src/tools/ajax.js。
2、Vue.prototype.ajax = ajax.ajax;
完成即可在所有组件通过this.ajax的方式调用了。
例：this.ajax('登录',{username:'system'},(res)=>{});第一个参数：接口名称，第二个参数：请求参数，第三个参数：回调函数。













