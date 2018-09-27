const md5 = require('md5');
class Tools {
	constructor(){
		this.sort = 'yangcz'
	}
	
	isPoneAvailable(pone) {
		let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
		if (!myreg.test(pone)) {
		  return false;
		} else {
		  return true;
		}
	}
  
	md5(str){
		return md5(str);
	}
	
	userToken(username){
		return this.md5(username+this.sort);
	}
	successRet(code,msg,data = {}){
		return {'code':code,'msg':msg,'success':true,'data':data};
	}
	failRet(code,msg){
		return {'code':code,'msg':msg,'success':false};
	}
	post(req){
		let ret = {};
		for(let index in req.body){
			if(index === 'page') ret.page = parseInt(req.body[index]);
			if(index === 'pageSize') ret.pageSize = parseInt(req.body[index]);
			ret[index] = req.body[index];
		}
		return ret;
	}
}
module.exports = new Tools();