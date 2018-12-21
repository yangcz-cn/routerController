<template>
	<div class="wrapper wrapper-content animated fadeInRight">
		<div class="row">
            <div class="col-sm-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5>角色{{this.id?'编辑':'添加'}} <small>  角色用于用户的权限管理（带 <span class="red">*</span> 号为必填项）</small></h5>
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
						<el-form :model="rote" :rules="rules" ref="rote" label-width="100px" class="demo-rote" v-loading="loading"
                                element-loading-text="保存中..."
								>
							  <el-form-item label="角色名称" prop="name">
								<el-input 
								v-model="rote.name"
								placeholder="请输入角色名称"
								></el-input>
							  </el-form-item>
							  <el-form-item label="角色描述">
								<el-input 
								type="textarea"
								:rows="2"
								v-model="rote.desc" placeholder="请输入关于此角色的描述" ></el-input>
							  </el-form-item>
							  <el-form-item label="是否有效">
								<el-switch
								  v-model="rote.state"
								  active-color="#13ce66"
								  inactive-color="#ff4949"
								  active-text="有效"
								  inactive-text="无效"
								  >
								</el-switch>
							  </el-form-item>
							  <el-form-item>
								<el-button type="primary" @click="submitForm('rote')"><i class="fa fa-save"></i>保存</el-button>
								<el-button @click="resetForm('rote')">重置</el-button>
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
        rote: {
          name: '',
          path: '',
          desc: '',
		  state:true
        },
        rules: {
          name: [
            { required: true, message: '请输入角色称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
			{ min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
          ],
        }
      };
    },
	mounted: function () {
          this.id = this.$route.query.id;
		  this.init();
    },
    methods: {
	  init(){
		if(this.id){
		this.loading = true;
			this.ajax(
				'角色获取',
				{
					id:this.id
				},
				resault=>{
					this.loading = false;
					console.log(resault);
					if(resault.success){
						this.rote.name = resault.data.name;
						this.rote.desc = resault.data.desc;
						if(resault.data.state == '1'){
							this.rote.state = true;
						}else{
							this.rote.state = false;
						}
					}
				}
			);
		
		}
	  },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
			this.loading = true;
            this.ajax(
				'角色保存',
				{
					id:this.id,
					name:this.rote.name,
					desc:this.rote.desc,
					state:this.rote.state
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
						this.$router.push({path:'/rote/list'});
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
      }
    }
  }
</script>