let fs = require('fs')//fileSystem

let obj = {}
let event = {
    _arr:[],
    on(fn) {//订阅
        this._arr.push(fn)
    },
    emit() {//发布
        this._arr.forEach(fn=>fn())
    }
}
event.on(function(){ //先订阅再发布，两者之间没有任何关联,可以用来解耦
    console.log('数据来了')
})
event.on(function(){
    if(Object.keys(obj).length == 2){
        console.log(obj)
    }
})
fs.readFile('./age.txt','utf-8',(err,data)=>{
    obj.age = data
    event.emit()
})
fs.readFile('./name.txt','utf-8',(err,data)=>{
    obj.name = data
    event.emit()
})
// console.log(obj)