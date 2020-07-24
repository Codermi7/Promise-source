// 柯里化
//判断一个元素的类型 数组 对象 。。。

// 类型判断应该使用什么方法来判断
//1.typeof 不能判断对象类型 数组,
//2.constructor 可以判断这个实例是通过谁来构造出来的
//3.instanceof 区分实例 __proto__
//4.Object.prototype.toString.call([]) 区分具体的类型，(不能区分实例)

// function isType(content,typing) {
//     return Object.prototype.toString.call(content) == `[object ${typing}]`
// }
// console.log(isType(123,'Number'))//用户传入类型 错误 就全是false 

const curring = (fn, arr = []) => {
    let len = fn.length;
    // console.log(len)
    return (...args)=>{
        let concatArgs = [...arr,...args];
        //获取长度 和值的关系
        if(concatArgs.length < len) {
            return curring(fn,concatArgs)
        }else{
            return fn(...concatArgs)
        }
    }
}
const isType = (typing)=> {
    return (value)=>{
        console.log(typing,value)
        return Object.prototype.toString.call(value) == `[object ${typing}]`
    }
}

let util = {};
['String','Number','Null','Undefined'].forEach(type => {
    util['is'+type] = curring(isType)(type)
});
console.log(util.isNumber('123'))

// function sum(a,b,c,d){
//     console.log(a,b,c,d)
// }

// let newSum = curring(sum)

// newSum(1,2)(4)(6)