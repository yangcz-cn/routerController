/**
 * Created by Administrator on 2018/8/14.
 */
class Toast
{
    constructor(){
        this.ToastDivId = 'toastDiv';
        this.confirmText = '确认';
        this.cancelText = '取消';
        this.msg = 'Toast';
        this._initStyle();
    };
    confirm(msg = 'Toast',options = {confirm:'确认',cancel:'取消'}){
        this.init(msg,options);
        return this;
    };
    alert(msg = 'Toast',options = {confirm:'确认',cancel:false}){
        this.init(msg,options);
        return this;
    };
    init(msg = 'Toast',options = {confirm:'确认',cancel:'取消'}){
        this.msg = msg;
        if(typeof options == 'object'){
            if(!(options.confirm === undefined)){
                this.confirmText = options.confirm;
            }
            if(!(options.cancel === undefined)){
                this.cancelText = options.cancel;
            }
        }else {
            console.error('options error ');
            return false;
        }
        this._initHtml();
        let div = document.createElement('div');
        div.id = this.ToastDivId;
        document.body.appendChild(div);
        document.getElementById(this.ToastDivId).innerHTML = this.html;
        if(!this.confirmText === false){
            this.btnConfirm()
        }
        if(!this.cancelText === false){
            this.btnCancel()
        }
        return this;
    };
    _initHtml(){
        let html = `<section style="`+ this.container +`" ><div style="` + this.toast + `"><span>` + this.msg + `</span><div style="` + this.btn + `" v-if="btnFlag">`;
        if(!(this.confirmText === false)) {
            html += `<button style="` + this.confirmStyle + `" id="ToastBtnConfirm">` + this.confirmText + `</button>`;
        }
        if(!(this.cancelText === false)){
            html += `<button style="`+ this.cancel +`" id="ToastBtnCancel">` + this.cancelText + `</button>`;
        }
        html += `</div></div></section>`;
        this.html = html;
    };
    _initStyle(){
        this.container = `position: absolute;left: 0;top: 0;bottom: 0;right: 0;z-index: 9999999;display: flex;justify-content: center;align-items: center;background: rgba(0,0,0,.2);`
        this.toast = `width: 23rem;height: 10rem;line-height: 10rem;text-align: center;background-color: #4e4b4a;border-radius: 10rem;color: #fff;`
        this.btn = `width: 23rem;height: 2rem;line-height: 2rem;margin: 1rem 0rem;`
        this.confirmStyle = `width: 4rem;height: 2rem;margin: 0rem 1rem;border-width:0;border-radius: 1rem;color: #fff;background-color: #5cb85c;border-color: #4cae4c;cursor: pointer;`
        this.cancel = `width: 4rem;height: 2rem;margin: 0rem 1rem;color: #fff;background-color: #f0ad4e;border-color: #f0ad4e;border-width:0;border-radius: 1rem;cursor: pointer;`
    };
    btnConfirm(confirm = ()=>{}){
        document.getElementById('ToastBtnConfirm').onclick = ()=>
        {
            document.getElementById(this.ToastDivId).remove();
            confirm();
        }
        return this;
    };
    btnCancel(cancel = ()=>{} ){
        document.getElementById('ToastBtnCancel').onclick = ()=>
        {
            document.getElementById(this.ToastDivId).remove();
            cancel();
        }
        return this;
    };
}
export default new Toast();
