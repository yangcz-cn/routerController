const md5 = require('md5');
class Tools {
  constructor() {
    this.sort = 'yangcz'
  }

  //判断是否是手机号
  isPoneAvailable(pone) {
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(pone)) {
      return false;
    } else {
      return true;
    }
  }

  md5(str) {
    return md5(str);
  }
  userToken(username) {
    return this.md5(username + this.sort);
  }
  //成功响应
  successRet(code, msg, data = {}) {
    return { 'code': code, 'msg': msg, 'success': true, 'data': data };
  }
  //失败响应
  failRet(code, msg) {
    return { 'code': code, 'msg': msg, 'success': false };
  }
  //获取post参数
  post(req) {
    let ret = {};
    for (let index in req.body) {
      if (index === 'page') ret.page = parseInt(req.body[index]);
      if (index === 'pageSize') ret.pageSize = parseInt(req.body[index]);
      ret[index] = req.body[index];
    }
    return ret;
  }
  //判断data值是否有效
  isValid(data) {
    if (typeof (data) != "undefined" && data != null && data != 'null' && !(data === '')) {
      return true;
    } else {
      return false;
    }
  }
  // 获取客户端真实ip
  getClientIp(req) {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    console.log(ip);
    ip = ip.match(/\d+.\d+.\d+.\d+/);
    console.log(ip);
    return ip ? ip.join('.') : null;
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
module.exports = new Tools();