/**
 * Created by Yangcz on 2018/8/13.
 */
import axios from 'axios'
class Http {
    constructor(){
        this.token = '';
    }
    /* *
    * @author:yangcz
    * @param: url (string) Not Null
    * @param: params (object) default {}
    * */
    get(url,params = {}){
        return new Promise((resolve,reject)=>{
            if(this._checkUrl(url)) reject('url is Not Null!');
            params.token = this.token;
            axios.get(url,{params:params}).then(res=>resolve(res.data)).catch(error=>reject(error));
        });
    }
    /* *
    * @author:yangcz
    * @param: url (string) Not Null
    * @param: params (object) default {}
    * */
    post(url,params = {}){
        return new Promise((resolve,reject)=>{
            if(this._checkUrl(url,reject)) reject('url is Not Null');
            params.token = this.token;
            axios.post(url,params).then(res=>resolve(res.data)).catch(error=>reject(error));
        });
    }
    /* *
     * @author:yangcz
     * @param: url (string) Not Null
     * @param: params (object) default {}
     * */
    /*jsonP(url,params = {}){//暂时不考虑跨域
        return new Promise((resolve,reject)=>{
               this._checkUrl(url,reject);
                params.token = this.token;
        .jsonP(url,{params:params}).then(res=>resolve(res.data)).catch(error=>reject(error));
            });
    }*/
    /* *
     * @author:yangcz
     * @param: options ((object)) Not Null
     * */
    ajax(options){
        return Prosime((reslove,reject)=>{
                this._checkUrl(options,reject);
        axios(options).then(res=>reslove(res.data)).catch(error=>reject(error));
            });
    }
    /* *
    * 检测url 是否合法
    * */
    _checkUrl(url,reject){
        if(!url){
            reject('url is Not Null');
        }
    }
    /* *
     * 返回请求 token
     * */
    _getToken(){
        return this.token;
    }

}
export default new Http();