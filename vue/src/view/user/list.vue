<template>
<div class="wrapper wrapper-content animated fadeInRight">
    <div class="row">
        <div class="col-sm-12">
            <div class="ibox float-e-margins">
            <div>
                <el-form :inline="true" :model="search" class="demo-form-inline">
                    <el-form-item label="用户名">
                        <el-input v-model="search.username" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="search.mobile" placeholder="手机号"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" circle @click="onSearch"></el-button>
                        <el-button  @click="onFlash" icon="el-icon-refresh" circle></el-button>
                        <!--<el-button type="primary"  icon="el-icon-search">搜索</el-button>-->
                        <el-button round type="primary" @click="onAddUser" icon="glyphicon glyphicon-plus">添加</el-button>

                    </el-form-item>
                </el-form>
                <!--<el-radio-group v-model="radio3">-->
                    <!--<el-radio-button label="有效"></el-radio-button>-->
                    <!--<el-radio-button label="无效"></el-radio-button>-->
                <!--</el-radio-group>-->
            </div>
            <el-table
                    v-loading="userListLoading"
                    element-loading-text="玩命加载中..."
                    :data="userList"
                    style="width: 100%"
                    max-height="500">
                <el-table-column
                        prop="id"
                        label="编号"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="realname"
                        label="姓名"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="用户名"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="手机号"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="nikename"
                        label="昵称"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="add_time"
                        label="添加时间"
                        width="120">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                       >
                    <template slot-scope="scope">
                        <!--<div class="fa-hover col-md-3 col-sm-4">-->
                            <el-button size="small" round><i class="fa fa-user-times"></i>无效</el-button>
                        <!--</div>-->

                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
                <!--使用.sync 实现双向绑定 使用 v-on 实现自定义事件 在子组件调用自定义的事件-->
                <page
                        :total.sync="page.total"
                        :isShow.sync="page.isShow"
                      v-on:pageChange="pageChange($event)"
                      v-on:pageSizeChange="pageSizeChange($event)"

                ></page>
            </div>
        </div>
    </div>
</div>
</div>

</template>
<script>
    import page from '../../components/page.vue';
    export default{
        components:{
            page
        },
        data(){
            return {
                search:{
                    username: '',
                    mobile: ''
                },
                page:{
                    isShow:false,
                    total:0,
                    pageNum:1,
                    pageSize:this.config.page.size,
                    totalPage:1
                },
                userList: [],
                radio3:'有效',
                userListLoading: true,
                userMsg:'dd',
                userType:'success',
                state:1
            }
        },
        mounted:function(){
            this.init();
        },
        methods:{
            init(){
                let _this = this;
                this.getUserList();
            },
            deleteRow(index, rows) {
                rows.splice(index, 1);
            },
            getUserList(r = false){
                this.userListLoading = true;
                this.Http.post('user/list',{
                    searchName:this.search.username,
                    searchMobile:this.search.mobile,
                    pageSize:this.page.pageSize,
                    page:this.page.pageNum,
                    state:this.state
                }).then(msg=>{
                    if(msg.success){
                        if(r){
                            this.$message({
                                message: r,
                                type: 'success',
                                showClose: true,
                                center: true,
                                duration:1000
                            });
                        }
                        this.userList = msg.data.rows;
                        this.userListLoading = false;
                        this.page.total = msg.data.count;
                        if(this.page.total/this.page.pageSize>1){
                            this.page.isShow = true;
                        }else {
                            this.page.isShow = false;
                        }
                    }else {
                        this.$message.error({
                            message: msg.msg,
                            type: 'error',
                            showClose: true,
                            center: true,
                            duration:3000
                        });
                    }
                }).catch(err=>{
                    this.$message.error({
                    message:'系统错误！',
                    type: 'error',
                    showClose: true,
                    center: true,
                    duration:3000
                });
                });
            },
            onSearch() {
                this.getUserList('搜索成功！');
            },
            onAddUser(){
                console.log('aaaaaaaaddddddd')
            },
            onFlash(){
                this.getUserList('刷新成功！');
            },
            pageChange($event){
                this.page.pageNum = $event;
                this.getUserList();
            },
            pageSizeChange($event){
                this.page.pageSize = $event;
                this.getUserList();
            }
        }
    }

</script>