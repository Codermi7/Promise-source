//观察者模式  基于发布订阅  而且两者有关联    观察者、被观察者(被观察者需要收集所有观察者)
//vue dep收集watcher 
class Subject {
    constructor(name) {
        this.name = name
        this.observers = []
        this.state = '开心'
    }
    attach(o) {
        this.observers.push(o)
    }
    setState(newState){
        this.state = newState
        this.observers.forEach(o=>{
            o.update(this)
        })
    }
}

class Observer {
    constructor(name){
        this.name = name
    }
    update(baby) {
        console.log(this.name+'知道了'+baby.name+'状态是'+baby.state)
    }
}

let baby = new Subject('小宝宝')

let o1 = new Observer('Dad')
let o2 = new Observer('Mom')

baby.attach(o1)
baby.attach(o2)

baby.setState('不开心')