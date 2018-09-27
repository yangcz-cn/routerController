<template>
    <body class="signin">
    <div class="signinpanel">
        <div class="row">
            <div class="col-sm-7">
                <div class="signin-info">
                    <div class="logopanel m-b">
                        <h1>[ H+ ]</h1>
                    </div>
                    <div class="m-b"></div>
                    <h4>欢迎使用 <strong>H+ 后台主题UI框架</strong></h4>
                    <ul class="m-b">
                        <li><i class="fa fa-arrow-circle-o-right m-r-xs"></i> 优势一</li>
                        <li><i class="fa fa-arrow-circle-o-right m-r-xs"></i> 优势二</li>
                        <li><i class="fa fa-arrow-circle-o-right m-r-xs"></i> 优势三</li>
                        <li><i class="fa fa-arrow-circle-o-right m-r-xs"></i> 优势四</li>
                        <li><i class="fa fa-arrow-circle-o-right m-r-xs"></i> 优势五</li>
                    </ul>
                    <strong>还没有账号？ <a href="#">立即注册&raquo;</a></strong>
                </div>
            </div>
            <div class="col-sm-5">
                <form>
                    <h4 class="no-margins">登录：</h4>
                    <p class="m-t-md">登录到H+后台主题UI框架</p>
                    <input type="text" class="form-control uname" v-model="username"   placeholder="用户名/手机号" />
                    <input type="password" class="form-control pword m-b" v-model="password"  placeholder="密码" />
                    <!--<a href="">忘记密码了？</a>-->
                    <a class="btn btn-success btn-block" @click="login">登录</a>
                </form>
            </div>
        </div>
        <div class="signup-footer">
            <div class="pull-left">
                &copy; 2018 All Rights Reserved.
            </div>
        </div>
    </div>
    </body>
</template>
<script>
    import '../../../static/css/login.css';
    export default {
        data(){
            return {
                username:'',
                password:''
            }
        },
        mounted:function(){

        },
        methods:{
            login(){
                if(!this.username){
                    this.$message({
                        message: '用户名或手机号不能空！',
                        type: 'warning',
                        showClose: true,
                        center: true,
                        duration:3000
                    });
                    return false;
                }
                if(!this.password){
                    this.$message({
                        message: '密码不能为空！',
                        type: 'warning',
                        showClose: true,
                        center: true,
                        duration:3000
                    });
                    return false;
                }
                this.Http.post('/user/login',{
                    username:this.username,
                    password:this.password
                }).then(res=>{
                    if(res.success){
                        this.Storage.set('username',res.data.username);
                        this.Storage.set('token',res.data.token);
                        this.Common.writeRouter(res.data.juris,this.$router);
                        this.$router.addRoutes(this.$router.options.routes);
                        this.$router.push({path:'/index'});
                    }
                }).catch(error=>{
                    this.$router.push({path:'/error'});
                   console.error(error);
                });
                /*this.$http.post(
                        '/login',
                        {
                            username:this.username,
                            password:this.password
                        }
                ).then(msg=>{

                }).catch(err=>{

                });*/
            }
        }
    }
</script>