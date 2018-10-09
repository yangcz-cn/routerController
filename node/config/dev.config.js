const Config = {
	db:{
		host:'localhost',
		user:'root',
		password:'root',
		database:'test'
	},
	superAdminId:1,//有且只有一个超级管理员防止权限被删除系统出错
	isGzip:0,//是否开启Gzip 压缩 1 开启 0 关闭 (因为没用使用node view 所以占时没有任何作用)
}
module.exports = Config;