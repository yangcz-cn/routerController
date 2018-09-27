/**
 * Created by Administrator on 2018/8/13.
 */
const config = {
    globalRouters:[
        '/',
        '/login',
        //'/register',
    ],
    page:{
        sizes:[10, 20, 30],
        size:10
    },
    menu:[//添加时请注意添加相应权限
        {
            name:'首页',
            icon:'fa fa-home',
            children: [
                {
                    name:'首页',
                    path:'/index',
                }
            ]
        },
        {
            name:'用户管理',
            icon:'fa fa-users',
            children: [
                {
                    name:'用户列表',
                    path:'/user/list'
                },
            ]
        },
        {
            name:'权限配置',
            icon:'fa fa-cogs',
            children:[
                {
                    name:'权限列表',
                    path:'/juris/list'
                },
                {
                    name:'角色列表',
                    path:'/rote/list'
                },       
          
            ]
        },


    ]
};
export default config;