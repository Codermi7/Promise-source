//高阶函数

function say(a,b,c,d) {
    console.log('说话',a,b,c,d)
}
Function.prototype.before = function(callback) {
    return(...args) => {
        callback();
        this(...args)
    }
}

let newSay = say.before(()=>{
    console.log('说话前')
})

newSay(1,2,3,4)
var x = 3,obj = {x:5}
global.x = 3
obj.fn = (function(){
    this.x *= ++x;
   
    return function(y){
        this.x *= (++x) +y;//19*5 
        console.log(globalThis)
        console.log(x);
        
    }
})()
var fn = obj.fn;
obj.fn(6);//window.x =13 obj.x = 95
fn(4);//18*13=234
console.log(obj.x,x);//95 234
// x : 3    window.x = 12
// obj  {x:5 fn:fn(){}}
//fn : fn(){}


// x:5  obj.x = 55
//6 

