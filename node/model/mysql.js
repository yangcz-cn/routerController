const mysql = require('mysql');
const devConfig = require('../config/dev.config.js');
class mysqlModel {
    constructor(mysql, options = devConfig.db) {
        this.mysql = mysql;
        this.config = options;
        this.Transaction = null;
        this.initPool();
    }
    connection() {
        this.connections = this.mysql.createConnection({
            host: this.config.host,
            user: this.config.user,
            password: this.config.password,
            database: this.config.database,
            multipleStatements: true, //允许执行多条查询语句
        });
        this.connections.connect(err => {
            if (err)
                throw err;
        });
        return this;
    }
    initPool() {
        this.pool = this.mysql.createPool({
            host: this.config.host,
            user: this.config.user,
            password: this.config.password,
            database: this.config.database,
            multipleStatements: true, //允许执行多条查询语句
        });
        return this;
    }
    query(sql, value = false) {
        return new Promise((reslove, reject) => {
            this.getConnection().then(connect => {

                connect.query(sql, value, (err, rows) => {
                    if (err)
                        reject({msg: '查询失败！', err: err});
                    reslove(rows);
                    this.release(connect);
                });
            }).catch(err => reject({msg: '查询错误！', err: err}));
        });
    }
    getConnection() {//在mysql连接池中获取一个连接
        return new Promise((reslove, reject) => {
            this.pool.getConnection((err, connect) => {
                if (err)
                    reject({msg: '获取连接失败！', err: err});
                reslove(connect);
            });
        });
    }
    beginTransaction() {
        return new Promise((reslove, reject) => {
            this.getConnection().then(connect => {
                connect.beginTransaction(err => {
                    if (err)
                        reslove({success: false, err: err});
                    this.Transaction = connect;
                    reslove({success: true});
                });
            }).catch(err => {
                reject(err);
            });
        });

    }
    execAction(sql, value) {
        return new Promise((reslove, reject) => {
            if (!this.Transaction)
                reslove({success: false, msg: 'Transaction is not find！'});
            this.Transaction.query(sql, value, (err, rows) => {
                if (err)
                    reject(err);
                reslove({success: true, msg: rows});
            });
        });
    }
    commit() {
        return new Promise((reslove, reject) => {
            if (!this.Transaction)
                reslove({success: false, err: 'Transaction is not find!'});
            this.Transaction.commit(err => {
                if (err) {
                    this.rollback();
                    this.Transaction = null;
                    reslove({success: false, err: err});
                }
                this.release(this.Transaction);
                this.Transaction = null;
                reslove({success: true});
            });
        });
    }
    rollback() {
        return new Promise((reslove, reject) => {
            if (!this.Transaction)
                reslove('Transaction is not find!');
            this.Transaction.rollback(() => {
                this.release(this.Transaction);
                this.Transaction = null;
                reslove({success: true});
            });

        });
    }
    release(connect) {//关闭连接池获取的连接
        connect.release();
    }
    table(table, conditions = {}, select = '*'){
        return new Promise((reslove, reject) => {
            let sql = `select ${select} from ${table}`, c = [];
            if (typeof sql !== 'string')
                reject(`error sql:${sql}`);
            if (typeof conditions !== 'object')
                reject(`error conditions:${JSON.stringify(conditions)}`);
            for (let k in conditions) {
                c.push(" `" + k + "` = '" + conditions[k] + "' ");
            }
            if (c.length > 0) {
                sql += ' where '
                sql += c.join(' and ');
            }
            this.querySql(sql).then(res => reslove(res)).catch(err => reject(err));
            /*
             this.connection();
             this.connections.query(sql,(err,results)=>{
             if(err) reject(err) ;
             reslove(results);
             this.end();
             });*/
        });
    }
    querySql(sql) {
        return new Promise((reslove, reject) => {
            if (typeof sql !== 'string')
                reject(`error sql:${sql}`);
            this.connection();
            this.connections.query(sql, (err, results) => {
                if (err)
                    reject(err);
                reslove(results);
                this.end();
            });
        });
    }
    end() {
        this.connections.end(err => {
            if (err)
                throw err;

        });
        return this;
    }
    buildListSql(table, conditions = [], order = [], select = '*') {
        if (!table)
            return 'table is not null!';
        let sql = 'SELECT ' + select + ' FROM `' + table + '` ';
        for (let item of conditions) {
            if (item.length === 1) {
                if (!sql.includes('WHERE')) {
                    sql += ' WHERE ';
                } else {
                    sql += ' AND ';
                }
                sql += `${item[0]} = ?`;
            } else if (item.length === 2) {
                if (!sql.includes('WHERE')) {
                    sql += ' WHERE ';
                } else {
                    sql += ' AND ';
                }
                switch (item[1]) {
                    case 'like':
                        sql += `${item[0]} like ?`;
                        break;
                    case 'in':
                        sql += `${item[0]} in( ? )`;
                        break;
                    case '!=':
                        sql += `${item[0]} != ? ;`
                        break;
                }
            } else {
                break;
            }
        }
        sql += ' order by id desc ';
        for (let v of order) {
            if (v[0]) {
                let t = v[1] == 'asc' ? 'asc' : 'desc';
                sql += ` ,${v[0]} ${t} `;
            }
        }
        sql += ' LIMIT ?,?';
        return sql;

    }
    count(table, conditions = [], v = []) {
        return new Promise((reslove, reject) => {
            if (!table)
                reject('table is not null!');
            if (typeof conditions != 'object')
                reject('conditions is Array not a ' + typeof conditions);
            let sql = "SELECT COUNT(*) AS count from `" + table + "`";

            for (let item of conditions) {
                if (!sql.includes('WHERE')) {
                    sql += ' WHERE ';
                } else {
                    sql += ' AND ';
                }
                sql += `${item} = ?`;
            }
            this.query(sql, v).then(resault => reslove(resault[0].count)).catch(err => reject(err));
        });

    }
    buildSave(table,v,conditions = false){
        if (!table)
            return 'table is not null!';
        if(v.length<= 0)
            return 'values is not null!';
        let sql = '';
        if(conditions){
            sql  = 'Update `' + table + '` SET ';
            let vArr = [];
            for(let k in v){
                vArr.push('`' + k + '` = ' + "'" + v[k] + "'");
                 //'`' + k + '` = ' + "'" + v[k] + "'";
            }
            sql += vArr.join(',');
            for (let item of conditions) {
                if (!sql.includes('WHERE')) {
                    sql += ' WHERE ';
                } else {
                    sql += ' AND ';
                }
                sql += `${item} = ?`;
            }
        }else {
            sql = 'INSERT INTO `' + table + '` (';
            let kArr = [],vArr = [];

            for(let k in v){
                kArr.push('`'+ k.replace(/`/g,'\`') +'`');
                //console.log(v[k]);
                vArr.push("'"+ v[k].toString().replace(/'/g,'\'') +"'");
            }
            sql += kArr.join(',') + ') VALUES( ' + vArr.join(',') + ') ';
        }
        return sql;
    }
    buildFindById(table){
        return `SELECT * FROM ${table} WHERE id = ?`;
    }

}
module.exports = new mysqlModel(mysql);

