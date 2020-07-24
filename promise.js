const ENUM = {
    PENDING:'PENDING',//等待
    FULFILLED:'FULFILLED',//成功
    REJECTED:'REJECTED'//失败
}

const resolvePromise = (x,promise2,resolve,reject)=>{
    if(x === promise2) {
        reject(new TypeError(`TypeError:Chaining cycle detected for promise #<MyPromise>`));
    }
    if((typeof x === 'object' && x !== null) || typeof x === 'function'){
        let called; //防止多次调用
        //x 是一个对象或者函数
        try {
            let then = x.then;
            //如果上一次返回的是个promise则 复用上一次的promise的then方法
            if(typeof then == 'function'){
                then.call(x, y => {
                    if(called) return;
                    called = true;
                    resolvePromise(y,promise2,resolve,reject);
                }, r => {
                    if(called) return;
                    called = true;
                    reject(r);
                })
            }else{
                //普通值
                resolve(x);
            }
        } catch (e) {
            if(called) return;
            called = true;
            reject(e);
        }
       
    }else{
        //普通值
        resolve(x)
      
    }
}
class MyPromise{
    constructor(executor){
        this.status = ENUM.PENDING;
        this.value = undefined;
        this.reason = undefined;
        //成功队列
        this.onResolvedCallbacks = [];
        //失败队列
        this.onRejectedCallbacks = [];
        //只有等待态才能修改状态 不可逆
        const resolve = value => {
            if(value instanceof MyPromise){
                return value.then(resolve,reject)
            }
            if(this.status == ENUM.PENDING){
                this.value = value;       
                this.status = ENUM.FULFILLED;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }
        const reject = reason => {
            if(this.status == ENUM.PENDING){
                this.reason = reason;
                this.status = ENUM.REJECTED;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }
        try {
            executor(resolve,reject);//立即执行
        } catch (error) {
            reject(error);
        }
      
    }
    then(onFulfilled,onRejected) {
        //链式调用
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
       

        //调用then方法  创建一个新的promise
        let promise2 = new MyPromise((resolve,reject)=>{
            if(this.status == ENUM.FULFILLED){
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(x,promise2,resolve,reject);
                    } catch (e) {
                        reject(e);
                    }
                  
                }, 0);
                
            }
            if(this.status == ENUM.REJECTED){
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(x,promise2,resolve,reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if(this.status == ENUM.PENDING){
                this.onResolvedCallbacks.push(()=>{
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(x,promise2,resolve,reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                })
                this.onRejectedCallbacks.push(()=>{
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(x,promise2,resolve,reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                })
            }
        })
        return promise2
    }
    catch(errCallback) {
        return this.then(null,errCallback)
    }
    static resolve(val) {
        return new MyPromise((resolve,reject)=>{
            resolve(val)
        })
    }
    static reject(reason) {
        return new MyPromise((resolve,reject)=>{
            reject(reason)
        })
    }
  
    //解决并发 多个异步任务并发获取最终的结果
    static all(values){
        return new MyPromise((resolve,reject)=> {
            let resultArr = []
            let orderIndex = 0;
            const processResultByKey = (value,index)=>{
                resultArr[index] = value
                if(++orderIndex === values.length){
                    resolve(resultArr)
                }
            }
            for(let i = 0; i < values.length; i++) {             
                let value = values[i]          
                if(value && typeof value.then === 'function'){
                    value.then(value=>{
                        processResultByKey(value,i)
                    },reject)
                }else {
                    processResultByKey(value,i)
                }
            }
        })
    }
    
   
    
}
 //无论成功还是失败 都会执行
//如果返回的是成功的promise 会采用上一次的结果  如果是失败 则返回失败结果
MyPromise.prototype.finally = function(callback) {
    return this.then((value)=>{
        return  MyPromise.resolve(callback()).then(()=>value)
    },err=>{
        return  MyPromise.resolve(callback()).then(()=>{throw err})
    })
}



// promises-aplus-tests promise.js

MyPromise.defer = MyPromise.deferred = function() {
    let dfd = {}
    dfd.promise = new MyPromise((resolve,reject)=>{
        dfd.resolve  = resolve;
        dfd.reject = reject
    })
    return dfd
}

module.exports = MyPromise


