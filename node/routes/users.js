var express = require('express');
var router = express.Router();
const db = require('../model/mysql.js');
const Tools = require('../tools/Tools.js');
const userSql = require('../model/user.js');
const config = require('../config/dev.config.js');
const superAdminId = config.superAdminId;//有且只有一个超级管理员防止权限被删除系统出错
/* 状态码 n0001 - n0100  
 2NNNN: 成功
 4NNNN: 逻辑错误
 5NNNN: 内部错误
 */
/* GET users listing. */
router.get('/actionTest', function (req, res, next) {
  /*let data = {};
   db.beginTransaction().then(msg=>{
   if(!msg.success) res.json(msg);
   //inser INSERT INTO tools(`name`) VALUES('bb')
   //del delete FROM tools WHERE id = 15
   //up update tools set ddd `name`='test aaaaaaaa cc' where id = 4 
   db.execAction("INSERT INTO tools(`name`) VALUES('bbbbbbddacbbdfdasf')").then(m=>{
   //console.log(rows) {"inserterr":{"code":"ER_PARSE_ERROR","errno":1064,"sqlMessage":"You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'ddd' at line 1","sqlState":"42000","index":0,"sql":"INSERT INTO tools(`name`) VALUES('ccc') ddd"}}
   //{"insertRet":{"fieldCount":0,"affectedRows":1,"insertId":19,"serverStatus":3,"warningCount":0,"message":"","protocol41":true,"changedRows":0}}
   //if(rows.insertRet.affectedRows){
   db.execAction("update tools set ddd `name`='test aaaaaaaa cc 7 ' where id = 5").then(rows=>{
   if(false){
   db.commit();
   res.json({ccc:rows})
   }else{
   
   db.rollback();
   res.json(rows)
   }
   }).catch(err=>{
   
   data.inserterr = err;
   res.json(data)
   });
   //}
   
   //data.insertRet = rows;  
   //res.json(data)
   }).catch(err=>{
   console.log(err);
   data.inserterr = 123456;
   res.json(data)
   });
   
   }).catch(err=>{
   res.json(err);
   });
   
   
   
   db.beginTransaction(msg=>{
   
   res.json(msg);
   });
   */
  let sql = "SELECT `juris_id` FROM `rg_juris` as rg where state = ? ";
  db.query(userSql.getRoteAndGroupByRid, [1]).then(rote => {
    db.query(userSql.getJurisByJids.replace('?', rote[0].jids)).then(juris => {

      res.json(Tools.successRet(10001, '登录成功', { rote: rote, juris: juris }));
      //res.json(juris);
    }).catch(err => {
      res.json(err);
    });
    ;

  }).catch(err => {
    res.json(err);
  });
  /*db.pool.getConnection((err,connect)=>{
   if(err) res.json({msg:'获取连接失败！',err:err});
   connect.query(userSql.getJurisByJids,(err,rows)=>{
   if(err) res.json({msg:'查询失败！',err:err});
   connect.release();
   res.json({msg:'dd',err:rows});
   });	
   });*/
  //res.json(Tools.failRet(50001,{a:'1',sql:db.pool}));


});


/* Post users/check listing. */
router.post('/check', function (req, res, next) {
  let username = req.body.username, token = req.body.token;

  if (token === Tools.userToken(username)) {
    res.json(Tools.successRet(10002, '已登录'));
  } else {
    res.json(Tools.failRet(40003, '未登录'));
  }
});


/* *
 * @updateTime 2018-9-29 10:55:34
 * @updateAuthor yangcz
 * @updateData 更新登录用户名检测方式，使用占位符生成预处理语句，预防sql注入，添加超级管理员用户，不需要角色拥有所有权限，预防角色权限的删除
 * Post users/login listing. 登录方法 */
router.post('/login', function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  if (!Tools.isValid(username) || !Tools.isValid(password)) {
    res.json(Tools.failRet(50001, '用户名及密码不可为空'));
  }

  try {
    (async () => {
      //判断是手机号登录还是用户名登录
      let key = Tools.isPoneAvailable(username) ? 'mobile' : 'username';
//      let obj = {};
//      obj[key] = username
//      let results = await db.table('user', obj);
      let results = await db.query(userSql.login.replace('#',key),[username]);

      if (results.length < 1) {
        res.json(Tools.failRet(50001, '未找到此用户,请先注册'));
        return;
      }
      if (results[0].password != password) {
        res.json(Tools.failRet(50001, '登录密码错误'));
        return;
      }
	  let rote,juris;
	  if(results[0].id === superAdminId){
		   rote = {'id':99999999,name:'超级管理员(超出权限之外，不在数据之中)'};
		   juris = await db.query(userSql.getAllJuris);
	  }else{
		  if (!results[0].rid)
			res.json(Tools.failRet(40001, '您暂无角色！'));
		  let r = await db.query(userSql.getRote, [results[0].rid]);
		   rote = r[0];
		  if (!rote.id)
			res.json(Tools.failRet(40001, '角色无效！'));
		    juris = await db.query(userSql.getRoteView.replace('?', rote.id));			
	  }

      if (results && rote && juris) {
        let token = Tools.userToken(results[0].username);
        res.cookie('username', results[0].username, { maxAge: 1000 * 3600 * 2 });
        res.cookie('token', token, { maxAge: 1000 * 3600 * 2 });
        res.cookie('userId', results[0].id);
        res.cookie('roteName', rote.name);
        res.cookie('juris', JSON.stringify(juris));
        req.session.username = results[0].username;
        
        res.json(Tools.successRet(10001, '登录成功', { username: results[0].username, token: token, rote: rote, juris: juris }));
      } else {
        res.json(Tools.failRet(50001, '查询错误！'));
      }
    })();
  } catch (err) {
    res.json(Tools.failRet(50001, err));
  }
});


/* Post users/login listing. 登录方法 */
router.post('/login-bak', function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  if (!Tools.isValid(username) || !Tools.isValid(password)) {
    res.json(Tools.failRet(50001, '用户名及密码不可为空'));
  }

  try {
    (async () => {
      //判断是手机号登录还是用户名登录
      let key = Tools.isPoneAvailable(username) ? 'mobile' : 'username';
      let obj = {};
      obj[key] = username
      let results = await db.table('user', obj);
      if (results.length < 1) {
        res.json(Tools.failRet(50001, '未找到此用户,请先注册'));
        return;
      }
      if (results[0].password != password) {
        res.json(Tools.failRet(50001, '登录密码错误'));
        return;
      }
      if (!results[0].rid)
        res.json(Tools.failRet(40001, '您暂无角色！'));
      let r = await db.query(userSql.getRote, [results[0].rid]);
      let rote = r[0];
      if (!rote.id)
        res.json(Tools.failRet(40001, '角色无效！'));
      let juris = await db.query(userSql.getRoteView.replace('?', rote.id));
      if (results && rote && juris) {
        let token = Tools.userToken(results[0].username);
        res.cookie('username', results[0].username, { maxAge: 1000 * 3600 * 2 });
        res.cookie('token', token, { maxAge: 1000 * 3600 * 2 });
        res.cookie('userId', results[0].id);
        res.cookie('roteName', rote.name);
        res.cookie('juris', JSON.stringify(juris));
        req.session.username = results[0].username;
        delete rote.gid;
        delete rote.grid;
        delete rote.jids;
        res.json(Tools.successRet(10001, '登录成功', { username: results[0].username, token: token, rote: rote, juris: juris }));
      } else {
        res.json(Tools.failRet(50001, '查询错误！'));
      }
    })();
  } catch (err) {
    res.json(Tools.failRet(50001, err));
  }
});



/* Post users/list listing. */
router.post('/list', function (req, res, next) {
  let body = Tools.post(req), searchName = body.searchName, searchMobile = body.searchMobile, page = body.page ? body.page : 1, pageSize = body.pageSize ? body.pageSize : 10, offset = (page - 1) * pageSize, state = body.state;
  let conditions = [], param = [];
  if (searchName) {
    conditions.push(['username', 'like']);
    param.push('%' + searchName + '%');
  }
  if (searchMobile) {
    conditions.push(['mobile', 'like']);
    param.push('%' + searchMobile + '%')
  }
  conditions.push(['state']);
  let table = 'user';
  try {
    (async () => {
      let rows = await db.query(db.buildListSql(table, conditions), [...param, body.state, offset, pageSize]);
      let c = await db.count(table, ['state'], [body.state]);
      res.json(Tools.successRet(20003, '查询成功！', { rows: rows, count: c }));
    })();
    //res.json(Tools.failRet(50003,{s:db.buildListSql(table,conditions),c:[...param,body.state,offset,pageSize]}));
  } catch (err) {
    res.json(Tools.failRet(50003, err));
  }
  ;

});


module.exports = router;
