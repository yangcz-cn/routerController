const Config = {
	db:{
		host:'localhost',
		user:'root',
		password:'root',
		database:'test'
	},
	superAdminId:1,//有且只有一个超级管理员防止权限被删除系统出错
}
module.exports = Config;