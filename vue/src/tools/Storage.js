/**
 * Created by Yangcz on 2018/8/15.
 */
class Storage {
    constructor(window){
        this.storage = window.localStorage;
    }
    get(key){
        if(!key.toString()) return 'not find key!';
        return this.storage.getItem(key);
    }
    set(key,val){
        if(!key.toString()) return 'not find key!';
        if(typeof val === 'object'){
            val = JSON.stringify(val);
        }
        return this.storage.setItem(key,val);
    }
    remove(key){
        if(!key.toString()) return 'not find key!';
        return this.storage.removeItem(key);
    }
    removeAll(){
        return this.storage.clear();
    }
    getAll(){
        let ret = {};
        for(let i = 0;i<this.storage.length;i++){
            ret[this.storage.key(i)] = this.get(this.storage.key(i));
        }
        return ret;
    }
    addEnd(key,val){
        let v = this.get(key);
        if(!key) return 'not find key!';
        v += val;
        this.set(key,v);
    }
    addAfter(key,val){
        let v = this.get(key);
        if(!key) return 'not find key!';
        val += v;
        this.set(key,val);
    }
}
export default new Storage(window);