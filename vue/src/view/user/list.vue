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
            </div>
            <el-table
                    v-loading="userListLoading"
                    element-loading-text="玩命加载中..."
                    :data="userList"
                    style="width: 100%"
					@filter-change="filterChange"
                    max-height="500"
					>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="80"
						align="center"
						>
                </el-table-column>
                <el-table-column
                        prop="realname"
                        label="姓名"
                        width="100"
						align="center"
						>
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="用户名"
                        width="100"
						align="center"
						>
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="手机号"
                        width="110"
						align="center"
						>
                </el-table-column>
                <el-table-column
                        prop="nikename"
                        label="昵称"
                        width="100"
						align="center"
						>
                </el-table-column>
				
				<el-table-column
                        prop="rname"
                        label="角色"
                        width="120"
						align="center"
						>
                </el-table-column>
				
				<el-table-column
                        prop="source"
                        label="用户来源"
                        width="120"
						align="center"
						>
                </el-table-column>
				
                <el-table-column
                        prop="addtime"
                        label="添加时间"
                        width="160"
						align="center"
						>
                </el-table-column>
				
				<el-table-column
                    prop="state"
                    label="状态"
                    width="100"
                    :filters="[{ text: '有效', value: '1' }, { text: '无效', value: '2' }]"
                    :filter-multiple="false"
                    :filtered-value="[1]"
                    column-key="state"
					>
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.state === '无效' ? 'primary' : 'success'"
                            disable-transitions>{{scope.row.state}}</el-tag>
                    </template>
				</el-table-column>
				
                <el-table-column
                        fixed="right"
                        label="操作"
						width="200"
                       >
                    <template slot-scope="scope">
						<el-button size="small" round @click="onState(scope.row.id,scope.row.state)">
										<i :class="scope.row.state == '有效' ? 'fa fa-times-circle-o':'fa fa-check-circle-o'"></i>
										{{scope.row.state === '无效'?'有效':'无效'}}
						</el-button>
						<el-button size="small" round @click="onEdit(scope.row.id)">
							<i class="fa fa-edit"></i>
							编辑
						</el-button>
                        

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
                userListLoading: true,
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
				this.ajax(
					"用户列表",
					{
					   state:this.state,
						page:this.page.pageNum,
						pageSize:this.page.pageSize,
						sJurisTitle:this.search.name
					},
					msg => {
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
							msg.data.rows.map(v=>{
								v.source = this.config.userSource[v.source]?this.config.userSource[v.source]:this.config.notfind;
							});
							this.userList = this.Common.dataToList(msg.data.rows);
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
					}
				);
                /*this.Http.post('/api/user/list',{
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
                });*/
            },
            onSearch() {
                this.getUserList('搜索成功！');
            },
            onAddUser(){
              this.$router.push({path:`/user/add`});			  
            },
            onFlash(){
                this.getUserList('刷新成功！');
            },
			filterChange(value) {
                if(value.state.length>0){
                    this.state = value.state[0];
                }else {
                    this.state = 'all';
                }
                this.getUserList('筛选成功');
            },
            pageChange($event){
                this.page.pageNum = $event;
                this.getUserList();
            },
            pageSizeChange($event){
                this.page.pageSize = $event;
                this.getUserList();
            },
			onEdit(id){
				this.$router.push({path:'/user/add',query:{id:id}});
			},
			onState(id,state){
				if(state == '有效'){
					state = 2;
				}else{
					state = 1;
				}			 
				this.ajax(
					'用户状态',
					{
						'id':id,
						'state':state
					},
					resault=>{
						if(resault.success){
							this.$message({
								type:'success',
								message:'修改成功',
								center:true,
								showClose:true,
								duration:1000
							 });
							this.userList.map(val=>{
								if(val.id == id){
									if(state == 1){
										val.state = '有效';
									}else{
										val.state = '无效';
									}
								}
							});
						}else{
							this.$message({
								type:'error',
								message:resault.msg,
								center:true,
								showClose:true,
								duration:3000
							 });
						
						}
					}
				);
			}
        }
    }

</script>