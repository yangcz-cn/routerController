var express = require('express');
var router = express.Router();
const db = require('../model/mysql.js');
const Tools = require('../tools/Tools.js');
//const db = mysql.db;
//const jurisSql = require('../model/juris.js');
/* 状态码 n0100 - n0200 
2NNNN: 成功
4NNNN: 逻辑错误
5NNNN: 内部错误
*/

/* GET juris/ listing. */
router.get('/', function(req, res, next) {
res.end('ok');
	
});
/* post juris/list listing. */
router.post('/list',function(req,res,next){
	//res.json(Tools.failRet(40100,'参数错误！'))
	let body = Tools.post(req),conditions = [],v = [],page = body.page?body.page:1,pageSize = body.pageSize?body.pageSize:30;
	
	if(body.state != 'all'){
		conditions.push(['state']);
		v.push(body.state);
	}
	if(body.sRoteName){
		conditions.push(['name','like']);
		v.push('%'+ body.sRoteName +'%');
	}
	v.push((page-1)*pageSize);
	v.push(pageSize);
	let table = 'rote';
	try{
		(async ()=>{	
			let rows = await db.query(db.buildListSql(table,conditions),v);
			let c = await db.count(table,['state'],[body.state])
			res.json(Tools.successRet(20100,'查询成功',{count:c,rows:rows}));		
		})();
	}catch(err){
		res.json(Tools.successRet(20100,err,{count:c,rows:rows}));		
	}
	
});


module.exports = router;
