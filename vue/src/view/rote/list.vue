<template>
    <div class="wrapper wrapper-content animated fadeInRight">
        <div class="row">
            <div class="col-sm-12">
                <div class="ibox float-e-margins">
                    <div class="search">
                        <el-form :inline="true" :model="search" class="demo-form-inline">
                            <el-form-item label="名称">
                                <el-input v-model="search.name" placeholder="名称"></el-input>
                            </el-form-item>
                            <!--<el-form-item label="手机号">-->
                                <!--<el-input v-model="" placeholder="手机号"></el-input>-->
                            <!--</el-form-item>-->
                            <el-form-item>
                                <el-button icon="el-icon-search" circle @click="onSearch"></el-button>
                                <el-button  @click="onFlash" icon="el-icon-refresh" circle></el-button>
                                <el-button round type="primary" @click="onAdd" icon="glyphicon glyphicon-plus">添加</el-button>

                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="table">
                        <el-table
                                v-loading="loading"
                                element-loading-text="玩命加载中..."
                                :data="jurisList"
                                @filter-change="filterChange"
                                style="width: 100%"
                                max-height="700">
                            <el-table-column
                                    prop="id"
                                    label="编号"
                                    width="100">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="名称"
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="desc"
                                    label="描述"
                                    >
                            </el-table-column>
                            <el-table-column
                                    prop="state"
                                    label="状态"
                                    width="120"
                                    :filters="[{ text: '有效', value: '1' }, { text: '无效', value: '2' }]"

                                    :filter-multiple="false"
                                    :filtered-value="[1]"
                                    column-key="state"

                            >
                                <!--:filter-method=""-->
                                <template slot-scope="scope">
                                    <el-tag
                                            :type="scope.row.state === '无效' ? 'primary' : 'success'"
                                            disable-transitions>{{scope.row.state}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="200">
                                <template slot-scope="scope">
                                    <el-button size="small" round><i class="fa fa-times-circle-o"></i>无效</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="block page">
                        <!--使用.sync 实现双向绑定 使用 v-on 实现自定义事件 在子组件调用自定义的事件-->
                        <page :total.sync="page.total"
                              v-on:pageChange="pageChange($event)"
                              v-on:pageSizeChange="pageSizeChange($event)"
                              :isShow.sync="page.isShow"
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
                loading:false,
                jurisList:[],
                state:'all',
                page:{
                    isShow:false,
                    total:0,
                    pageNum:1,
                    pageSize:this.config.page.size,
                    totalPage:1
                },
                search:{
                    name:''
                }
            }
        },
        mounted: function () {
          this.init();
        },
        methods:{
            init(){

                this.getList();
            },
            getList(r = false){
                this.loading = true;
				this.ajax(
					"角色列表",
					{
					   state:this.state,
						page:this.page.pageNum,
						pageSize:this.page.pageSize,
						sJurisTitle:this.search.name
					},
					resault => {
					   if(resault.success){
							this.loading = false;
							if(r){
								this.$message({
									type:'success',
									message:r,
									center:true,
									showClose:true,
									duration:1000
								});
							}


							this.jurisList = this.Common.dataToList(resault.data.rows);
							this.page.total = resault.data.count;
							if(this.page.total/this.page.pageSize>1){
								this.page.isShow = true;
							}else {
								this.page.isShow = false;
							}
						}else {
							this.$message({type:'waring', message:resault.msg, center:true, showClose:true, duration:3000});
						}
					}
				);
                /*this.Http.post('/api/rote/list',{
                    state:this.state,
                    page:this.page.pageNum,
                    pageSize:this.page.pageSize,
                    sRoteName:this.search.name
                }).then(resault=>{
                    if(resault.success){
                        this.loading = false;
                        if(r){
                            this.$message({
                                type:'success',
                                message:r,
                                center:true,
                                showClose:true,
                                duration:1000
                            });
                        }


                        this.jurisList = this.Common.dataToList(resault.data.rows);
                        this.page.total = resault.data.count;
                        if(this.page.total/this.page.pageSize>1){
                            this.page.isShow = true;
                        }else {
                            this.page.isShow = false;
                        }
                    }else {
                        this.$message({type:'waring', message:resault.msg, center:true, showClose:true, duration:3000});
                    }
                }).catch(err=>{
                    this.$message({
                        type:'error',
                        message:'系统错误！',
                        center:true,
                        showClose:true,
                        duration:3000
                     });
                });*/
            },
            onSearch(){
                this.getList('搜索成功！');
            },
            onFlash(){
                this.getList('刷新成功！');
            },
            onAdd(){
				Router.push({path:`/rote/add`});
            },
            pageChange($event){
                this.page.pageNum = $event;
                this.getList();
            },
            pageSizeChange($event){
                this.page.pageSize = $event;
                this.getList();
            },
            filterChange(value) {
                if(value.state.length>0){
                    this.state = value.state[0];
                }else {
                    this.state = 'all';
                }
                this.getList('筛选成功');
            },

        }
    }
</script>