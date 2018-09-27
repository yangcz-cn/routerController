class Common{
	constructor(){
			
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
				i[v.replace('_','')] = item[v];
			}
			newData.push(i)
		}
		return newData;
	}
}
export default new Common();