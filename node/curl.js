var request = require("request");
const mysql = require('mysql');
const config = {
	host:'localhost',
	user:'root',
	password:'root',
	database:'test',
	table:'futures'
};
let pool = mysql.createPool({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            multipleStatements: true, //允许执行多条查询语句
});

let con = null;		
function  insert(sql,value = false){
	
	if(con){
		console.log('已有');
		con.query(sql, value, (err, rows) => {
                    if (err) console.log('查询失败！');
                       console.log('入库成功')
					   console.log('时间:',_date(new Date(),"yyyy-MM-dd hh:mm:ss.S"))
                   // con.release(); //释放连接
                });
	}else{
		console.log('新建');
		pool.getConnection((err, connect) => {
                if (err) console.log('获取连接失败！');
                   con   = connect;  
               connect.query(sql, value, (err, rows) => {
                    if (err) console.log('查询失败！');
                       console.log('入库成功')
					   console.log('时间:',_date(new Date(),"yyyy-MM-dd hh:mm:ss.S"))
                   // connect.release(); //释放连接
                });
		});
	}
	
}

const nData = [
					
					{
						'name':'黄金',
						'code':'AU0',
					},
					{
						'name':'白银',
						'code':'AG0',
					},
					{
						'name':'沪铜',
						'code':'CU0',
					},
					{
						'name':'玉米',
						'code':'C0',
					},
					//外盘数据
					{
						'name':'CBOT黄豆',
						'code':'hf_S',
					},
					{
						'name':'CBOT小麦',
						'code':'hf_W',
					},
					{
						'name':'CBOT玉米',
						'code':'hf_C',
					},
					{
						'name':'CBOT黄豆油',
						'code':'hf_BO',
					},
					{
						'name':'CBOT黄豆粉',
						'code':'hf_SM',
					},
					{
						'name':'CME瘦猪肉',
						'code':'hf_LHC',
					},
					{
						'name':'欧元期货',
						'code':'hf_EC',
					},
					{
						'name':'英镑期货',
						'code':'hf_BP',
					},
			];


let nStr,nV = [];
for(let v of nData ){
	nV.push(v.code);
	nStr = nV.join();
}

setInterval(function(){get(nStr)},1000);

function get(code){
	request({'url':'http://hq.sinajs.cn/list='+code}, function(err, response, body){
		let res = [];
		if('body' in response){
			res = response.body.split(';');
		}else{
			return;
		}
		let data = [];
		
		for(let item of res ){
			
			if(item && item.trim()){			
				if(item.includes('hf_')){
					data.push(w(item));
					
				}else{
					data.push(n(item));
				}
			}
			
		}
		
		let sql = 'insert into futures(`name`,`code`,`open_price`,`max_price`,`min_price`,`close_price`,`news_price`,`sell_price`,`buy_price`,`balance_price`,`yesterday_balance_price`,`buy_num`,`sell_num`,`hold_num`,`deal_num`,`exchange`,`date`,`time`,`time_int`,`type`) values';
		for(let row of data){
			sql +='(';
			sql += "'" + row.name + "',";
			sql += "'" + row.code + "',";
			sql += "'" + row.openPrice + "',";
			sql += "'" + row.maxPrice + "',";
			sql += "'" + row.minPrice + "',";
			sql += "'" + row.closePrice + "',";
			if(row.newsPrice){
				sql += "'" + row.newsPrice + "',";
			}else{
				sql += "'null',";
			}
			if(row.sellPrice){
				sql += "'" + row.sellPrice + "',";
			}else{
				sql +=  "'null',";
			}
			if(row.buyPrice){
				sql += "'" + row.buyPrice + "',";
			}else{
				sql += "'null',";
			}
			if(row.balancePrice){
				sql += "'" + row.balancePrice + "',";
			}else{
				sql += "'null',";
			}
			if(row.yesterdayBalancePrice){
				sql += "'" + row.yesterdayBalancePrice + "',";
			}else{
				sql += "'null',";
			}
			if(row.buyNum){
				sql += "'" + row.buyNum + "',";
			}else{
				sql += "'null',";
			}
			if(row.sellNum){
				sql += "'" + row.sellNum + "',";
			}else{
				sql += "'null',";
			}
			if(row.holdNum){
				sql += "'" + row.holdNum + "',";
			}else{
				sql += "'null',";
			}
			if(row.dealNum){
				sql += "'" + row.dealNum + "',";
			}else{
				sql += "'null',";
			}
			if(row.exchange){
				sql += "'" + row.exchange + "',";
			}else{
				sql += "'null',";
			}
			if(row.date){
				sql += "'" + row.date + "',";
			}else{
				sql += "'null',";
			}
			if(row.time){
				sql += "'" + row.time + "',";
			}else{
				sql += "'null',";
			}

			
			let timestamp =  Date.parse(new Date())/1000;//秒级时间戳
			sql += timestamp + ',';
			sql += "'" + row.type + "'),";
		}
		let q = sql.substring(0,sql.length-1);
		insert(q);	
	});
}

function n(item){
	//内盘
	let auo = {};
	auo.code = _sC(item);
	let res = item.split(',');
	auo.openPrice = res[2];//开盘价
	auo.maxPrice = res[3];//最高价
	auo.minPrice = res[4];//最低价
	auo.closePrice = res[5];//昨日收盘价
	
	auo.newsPrice = res[6];//最新价(收盘价 )
	
	auo.sellPrice = res[7]//卖价
	auo.buyPrice = res[8];//买价
	auo.balancePrice = res[9];//结算价
	auo.yesterdayBalancePrice = res[10];//昨日结算价
	
	auo.buyNum = res[11];//11 //买量
	auo.sellNum = res[12];//12 //卖量
	auo.holdNum = res[13];//13 //持仓量
	auo.dealNum = res[14];//14 //成交量
	auo.exchange = res[15];//交易所简称 
	auo.name = _getNameByCode(_sC(item));//简称
	auo.date = res[17];//日期
	auo.type = '内盘';
	return auo;
	
}

function w(res){
	let obj = {} , data = _sV(res);
	//外盘
	 data = data.split(',');
	
	obj.code = _sC(res);
	
	obj.closePrice = data[0]; //最新价（收盘价）
	obj.buyPrice = data[2];// 买价
	obj.sellPrice = data[3];// 卖价
	obj.maxPrice = data[4];// 最高价
	obj.minPrice = data[5];// 最低价
	obj.time = data[6];// 时间
	obj.yesterdayBalancePrice = data[7];// 昨日结算价
	obj.openPrice = data[8];// 开盘价
	obj.holdNum = data[9];// 持仓量
	obj.dealNum = data[10];// 持仓量
	
	obj.date = data[13];// 13 日期
	
	obj.name = _getNameByCode(_sC(res));// 14 名称
	obj.type = '外盘';// 14
	return obj;
}

function _sV(s){
	return s.match(/\"(.*)\"/)[1]; 
};
function _sC(s){
	
	return s.match(/var (.*)\=/)[1].toString().substr(7); 
};

 function _date(_this,fmt) { //author: meizz 
    var o = {
        "M+": _this.getMonth() + 1, //月份 
        "d+": _this.getDate(), //日 
        "h+": _this.getHours(), //小时 
        "m+": _this.getMinutes(), //分 
        "s+": _this.getSeconds(), //秒 
        "q+": Math.floor((_this.getMonth() + 3) / 3), //季度 
        "S": _this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function _getNameByCode(c){
	for(let name of nData){
		if(name.code == c){
			return name.name;
		}
	}
}


