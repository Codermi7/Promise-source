//executor 执行器 默认立即执行
//2.默认promise 的状态是等待态 （三个状态： 等待 成功 失败）
//3.当调用resolve时 状态变为成功  调reject 为失败态
//4.返回的实例上有一个then方法，then中需要提供两个参数，分别是成功和失败对应的函数
//5.如果同时调用两个，默认会采用第一次调用的结果
//6.抛出异常就走失败的逻辑
//7.成功时可以传入成功的值，失败可以传入失败的原因
let Promise = require('./promise.js')
// let promise = new Promise((resolve,reject)=>{
//     console.log(1)
//     resolve(new Promise((resolve,reject)=>{
//         setTimeout(() => {
//             reject(5)
//         }, 1000);
//     }))
      
// }).then(res=>{console.log(res)},err=>{ err+=5;console.log(err)})

Promise.resolve(100).finally(()=>{
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve(3200)
        }, 1000);
    })
}).then(data=>{
    console.log('success',data)
}).catch(err=>{
    console.log('catch',err)
})

Promise.all([1,2,3,4,new Promise((resolve,reject)=>{
    reject('err')
})]).then(data=>{
    console.log(data)
},err=>{
    console.log(err)
})
//then的使用方式 
//1.then中的回调有两个方法  成功或者失败，他们的返回结果（普通值）会继续传递给下一个then
//2.返回的是一个promise，那么会用这个promise的状态作为结果
//3.错误处理 默认先找离自己最近的错误处理，找不到向下查找，找到后就执行
//then抛出异常 或者返回一个失败的promise 都会执行错误
// 一旦成功 不能失败，一旦失败 不能成功  promise.then返回一个新的promise


