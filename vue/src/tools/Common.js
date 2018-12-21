class Common{
	constructor(){
		Date.prototype.Format = function (timestamp) {
			timestamp = timestamp || Date.parse(new Date())/1000; 
			var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
			var Y = date.getFullYear() + '-';
			var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
			var D = date.getDate() + ' ';
			var h = date.getHours() + ':';
			var m = date.getMinutes() + ':';
			var s = date.getSeconds();
			return Y+M+D+h+m+s;
		}
		
		Date.prototype.timestamp = function (date) {
			let d;
			if(date){
				d = new Date(date);
			}else{
				d = new Date();
			}
			return Date.parse(d)/1000;
		}
		/*function (fmt) { //author: yangcz 
			var o = {
				"M+": this.getMonth() + 1, //月份 
				"d+": this.getDate(), //日 
				"h+": this.getHours(), //小时 
				"m+": this.getMinutes(), //分 
				"s+": this.getSeconds(), //秒 
				"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
				"S": this.getMilliseconds() //毫秒 
			};
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		}*/
	}
	require(path = '/error404.vue'){
		return remolvse => require([`../view${path}`],remolvse);
	}
	isJson(str) {
		if (typeof str == 'string') {
			try {
				var obj = JSON.parse(str);
				if(typeof obj == 'object' && obj ){
					return true;
				}else{
					return false;
				}
			} catch(e) {
				return false;
			}
		}
		console.error('It is not a string!')
	}
	writeRouter(juris,router){
		if(juris && juris.length>0){
			juris.map(v=>{
				v.component = v.path ? this.require(v.path + '.vue') : this.require('/error404.vue');
                                v.path = v.path ;
			});
			router.options.routes[0].children = juris;
		}
	}
	getMenu(allMenu,juris){
		let m = [];
		for(let menu of allMenu){
			menu.children.map((v,k)=>{
				let flag = false;
				for(let j of juris){
					if(v.path == j.path) flag = true;
				}
				if(!flag) menu.children.splice(k,1);
			});
			if(menu.children.length > 0) m.push(menu);
		}
		return m;
	}
	dataToList(arr){
		let newData = [];
		for(let item of arr){
			let i = {};
			for(let v in item){
				if(v == 'state'){
					if(item[v] == 1){
						item[v] = '有效';
					}else if(item[v] == 2){
						item[v] = '无效';
					}
				}
				if(v == 'add_time'){
					item[v] = this.timeFormat(item[v]);
				}
				i[v.replace('_','')] = item[v];
			}
			newData.push(i)
		}
		return newData;
	}
	isPoneAvailable(pone) {
		let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
		if (!myreg.test(pone)) {
		  return false;
		} else {
		  return true;
		}
	}
	timeFormat(timestamp){
		timestamp = timestamp || Date.parse(new Date())/1000; 
		var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		var D = date.getDate() + ' ';
		var h = date.getHours() + ':';
		var m = date.getMinutes() + ':';
		var s = date.getSeconds();
		return Y+M+D+h+m+s;
	}
	timestamp(date) {
		let d;
		if(date){
			d = new Date(date);
		}else{
			d = new Date();
		}
		return Date.parse(d)/1000;
	}
	
}
export default new Common();