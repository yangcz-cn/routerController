<template>
	<div class="wrapper wrapper-content animated fadeInRight">
		<div class="row">
            <div class="col-sm-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5>用户{{this.id?'编辑':'添加'}} <small>  后台对用户的管理（带 <span class="red">*</span> 号为必填项）</small></h5>
                        <div class="ibox-tools">
                            <!--<a class="collapse-link">
                                <i class="fa fa-chevron-up"></i>
                            </a>
                            <a class="dropdown-toggle" data-toggle="dropdown" href="form_basic.html#">
                                <i class="fa fa-wrench"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-user">
                                <li><a href="form_basic.html#">选项1</a>
                                </li>
                                <li><a href="form_basic.html#">选项2</a>
                                </li>
                            </ul>
                            <a class="close-link">
                                <i class="fa fa-times"></i>
                            </a>-->
                        </div>
                    </div>
                    <div class="ibox-content">
						<el-form :model="user" :rules="rules" ref="user" label-width="100px" class="demo-user" v-loading="loading" 
                                element-loading-text="加载中..."
								>
							  <el-form-item label="用户名" prop="username">
								<el-input 
								v-model="user.username"
								placeholder="请输入用户名"
								></el-input>
							  </el-form-item>
							  
							  <el-form-item label="用户昵称" prop="nikename">
								<el-input 
								v-model="user.nikename"
								placeholder="请输入用户昵称"
								></el-input>
							  </el-form-item>
							  
							  <el-form-item label="手机号" prop="mobile">
								<el-input 
								v-model="user.mobile"
								placeholder="请输入手机号"
								></el-input>
							  </el-form-item>
							  
							  <el-form-item label="密码" prop="password">
								<el-input 
								v-model="user.password"
								placeholder="请设置初始密码"
								style="width:30rem;margin-right:1rem;"
								></el-input>
								<el-button size="small" icon="el-icon-refresh" round @click="user.password = Math.random().toString(36).substr(2,6);">生成</el-button>
							  </el-form-item>
							  
							  <el-form-item label="真实姓名" prop="realname">
								<el-input 
								v-model="user.realname"
								placeholder="请输入真实姓名"
								></el-input>
							  </el-form-item>
							  
							  <el-form-item label="用户角色" prop="rid">
								<el-select v-model="user.rid" filterable clearable  placeholder="输入可搜索">
									<el-option
									  v-for="item in roteAll"
									  :key="item.id"
									  :label="item.name"
									  :value="item.id"
									  >
									</el-option>
								</el-select>
							  </el-form-item>
							  
							  <el-form-item label="用户来源" prop="source">
								<el-radio-group v-model="user.source">
								<el-radio :label="1">后台添加</el-radio>
								<el-radio :label="2">前台注册</el-radio>
								</el-radio-group>
							  </el-form-item>
							  
							  
							  <el-form-item label="添加时间" porp="addTime">
								<el-date-picker
								  v-model="user.addTime"
								  type="datetime"
								  placeholder="默认当前时间"
								  >
								</el-date-picker>
							  </el-form-item>
							  
							  
							  <el-form-item label="是否有效">
								<el-switch
								  v-model="user.state"
								  active-color="#13ce66"
								  inactive-color="#ff4949"
								  active-text="有效"
								  inactive-text="无效"
								  >
								</el-switch>
							  </el-form-item>
							  <el-form-item>
								<el-button type="primary" @click="submitForm('user')"><i class="fa fa-save"></i>保存</el-button>
								<!--<el-button @click="resetForm('user')">重置</el-button>-->
							  </el-form-item>
						</el-form>
                    </div>
                </div>
            </div>
        </div>
	</div>
</template>
<script>

export default {
    data() {
      return {
		id:false,
		loading:false,
		initUsername:false,
		initMobile:false,
        user: {
          username: '',
		  nikename:'',
		  mobile:'',
		  realname:'',
		  password:'',
		  rid:'',
		  source:1,
          addTime:'',
		  state:true
        },
		roteAll:[],
        rules: {
          username: [
            { required: true, validator:(rule,value,callback)=>{
					if (!value) {
						return callback(new Error('用户名不能为空'));
					}
					if(!this.id && this.initUsername == value){
						this.ajax(
							'用户名是否可用',
							{
								'username':value
							},
							resault=>{
								if(!resault.success){
									callback(new Error(resault.msg));
								}
								callback();
							}
						);
					}else{
						callback();
					}
				}, trigger: 'blur' },
			{ min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
          ],
		  mobile:[
			{ required: true, validator:(rule,value,callback)=>{
					if (!value) {
						return callback(new Error('手号不能为空'));
					}
					if (!this.Common.isPoneAvailable(value)) {
						callback(new Error('手机号格式有误'));
					} else {
						if(!this.id && this.initMobile == value){
							this.ajax(
								'手机号是否可用',
								{
									'mobile':value
								},
								resault=>{
									if(!resault.success){
										callback(new Error(resault.msg));
									}
									callback();
								}
							)
						}else{
							callback();
						}
						
					}
				},
			trigger: 'blur' },
		  ],
		  password:[
				{ required: true, message: '请输入密码', trigger: 'blur' },
				{ min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' },
				{ min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'change' }
		  ],
		  rid:[
			{ required: true, message: '请选择一个角色', trigger: 'change' },
		  ]
        }
      };
    },
	mounted: function () {
          this.id = this.$route.query.id;
		  this.init();
    },
    methods: {
	  init(){
		this.loading = true;
		this.getRoteAll();
		if(this.id){
			this.getUserById();
		}
		this.loading = false;
	  },
	  getRoteAll(){
		this.ajax(
			'角色选项卡',
			{},
			resault=>{
				if(resault.success){
					if(resault.success){
						this.roteAll = resault.data;
					}else{
						this.$message({
							type:'error',
							message:'角色获取失败',
							center:true,
							showClose:true,
							duration:3000
						});
					}
				}
			}
		);
	  },
	  getUserById(){
		this.ajax(
			'获取用户信息',
			{
				id:this.id
			},
			resault=>{
				if(resault.success){
				console.log(resault);
					this.initUsername = this.user.username = resault.data.username;
					this.user.nikename = resault.data.nikename;
					this.initMobile = this.user.mobile = resault.data.mobile;
					this.user.password = resault.data.password;
					this.user.rid = resault.data.rid;
					this.user.source = resault.data.source;
					this.user.addTime = this.Common.timeFormat(resault.data.add_time);
					if(resault.data.state == '1'){
						this.user.state = true;
						}else{
						this.user.state = false;
					}
				}else{
					this.$message({
							type:'error',
							message:'获取用户信息失败',
							center:true,
							showClose:true,
							duration:3000
						});
				}
			}
		);
	  },
      submitForm(formName) {
		console.log(formName);
        this.$refs[formName].validate((valid) => {
          if (valid) {
		  console.log(11);
			this.loading = true;
			if(!this.user.addTime){
				this.user.addTime = this.Common.timeFormat();
			}
			//console.log(this.user);return false;
            this.ajax(
				'用户保存',
				{
					id:this.id,
					username:this.user.username,
					nikename:this.user.nikename,
					mobile:this.user.mobile,
					realname:this.user.realname,
					password:this.user.password,
					rid:this.user.rid,
					source:this.user.source,
					addTime:this.Common.timestamp(this.user.addTime),
					state:this.user.state
				},
				resault=>{
					this.loading = false;
					if(resault.success){
						this.$message({
							type:'success',
							message:'保存成功！',
							center:true,
							showClose:true,
							duration:1000
						});
						this.$router.push({path:'/user/list'});
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
          } else {
		  console.log(112);
			this.$message({
                type:'error',
                message:'请按要求补全数据',
                center:true,
                showClose:true,
                duration:3000
                });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    }
  }
</script>