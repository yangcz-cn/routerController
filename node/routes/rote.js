var express = require('express');
var router = express.Router();
const db = require('../model/mysql.js');
const Tools = require('../tools/Tools.js');
const userSql = require('../model/user.js');
//const db = mysql.db;
//const jurisSql = require('../model/juris.js');
/* 本页功能状态码 n0200 - n0300
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
			let c = await db.count(table,['state'],[body.state]);
			res.json(Tools.successRet(20200,'查询成功',{count:c,rows:rows}));
			db.adminLog({
				'uid':req.cookies.userId,
				'type':2,
				'action':'查看角色列表',
				'data':JSON.stringify(body),
				'ip':Tools.getClientIp(req),
				'add_time':Tools.timestamp()
			});
		})();
	}catch(err){
		res.json(Tools.successRet(50200,err,{count:c,rows:rows}));
	}
	
});

/**
 * @author:yang cz
 * post rote/save listing. **/
router.post('/save',function(req,res,next){
	let body = Tools.post(req);
	if(body.state){
		body.state = 1;
	}else {
		body.state = 2;
	}
	let val = {
		'name':body.name,
		'desc':body.desc,
		'state':body.state
	};
	let table = 'rote';
	try{
		(async ()=>{
			let flag = false;
		if(body.id){
			let row = db.query(db.buildFindById(table),['id']);
			let sql = db.buildSave(table,val,['id']);
			flag = await db.query(sql,body.id);
			db.adminLog({
				'uid':req.cookies.userId,
				'type':3,
				'action':'修改角色id:'+ body.id,
				'data':JSON.stringify({oldData:row[0],newData:val}),
				'ip':Tools.getClientIp(req),
				'add_time':Tools.timestamp()
			});
		}else{
			flag = await db.querySql(db.buildSave(table,val));
			db.adminLog({
				'uid':req.cookies.userId,
				'type':5,
				'action':'新增角色',
				'data':JSON.stringify(val),
				'ip':Tools.getClientIp(req),
				'add_time':Tools.timestamp()
			});
		}
		if(flag){
			res.json(Tools.successRet(20201,'保存成功',{}));
		}else {
			res.json(Tools.failRet(50202,'保存失败'));
		}
	})();
	}catch(err){
		res.json(Tools.failRet(50201,err.message));
	}
});

/**
 * @author:yang cz
 * post rote/byId listing. **/
router.post('/byId',function(req,res,next){
	//res.json(Tools.failRet(40100,'参数错误！'))
	let body = Tools.post(req);
	if(!body.id){
		res.json(Tools.failRet(40100,'参数错误！'))
	}
	let table = 'rote';
	try{
		(async ()=>{
			let rows = await db.query(db.buildFindById(table),body.id);
		if(rows){
			res.json(Tools.successRet(20202,'获取成功',rows[0]));
			db.adminLog({
				'uid':req.cookies.userId,
				'type':2,
				'action':'查看角色id:'+ body.id +'的状态',
				'data':JSON.stringify(val),
				'ip':Tools.getClientIp(req),
				'add_time':Tools.timestamp()
			});
		}else {
			res.json(Tools.failRet(50203,'获取失败'));
		}
	})();
	}catch(err){
		res.json(Tools.failRet(50204,err.message));
	}
});

/**
 * @author:yang cz
 * post rote/upState listing. **/
router.post('/upState',function(req,res,next){
	//res.json(Tools.failRet(40100,'参数错误！'))
	let body = Tools.post(req);
	if(!body.id || !body.state){
		res.json(Tools.failRet(40100,'参数错误！'));
		return false;
	}
	let val = {
		state:parseInt(body.state)
	};
	let table = 'rote';
	try{
		(async ()=>{
			let rows = await db.query(db.buildSave(table,val,['id']),body.id);
		if(rows){
			res.json(Tools.successRet(20103,'修改成功',rows[0]));
			db.adminLog({
				'uid':req.cookies.userId,
				'type':3,
				'action':'修改角色id:'+ body.id +'的状态',
				'data':JSON.stringify(body),
				'ip':Tools.getClientIp(req),
				'add_time':Tools.timestamp()
			});
		}else {
			res.json(Tools.failRet(50105,'修改失败'));
		}
	})();
	}catch(err){
		res.json(Tools.failRet(50106,err.message));
	}
});

/**
 * @author:yang cz
 * post rote/select listing.
 * 角色选项卡数据
 * **/
router.post('/getSelect',function(req,res,next){
	//res.json(Tools.failRet(40100,'参数错误！'))
	let table = 'rote';
	try{
		(async ()=>{
			let rows = await db.query(userSql.getRoteSelect);
			res.json(Tools.successRet(20207,'查询成功',rows));
		})();
	}catch(err){
		res.json(Tools.failRet(50207,err.message));
	}
});


module.exports = router;
