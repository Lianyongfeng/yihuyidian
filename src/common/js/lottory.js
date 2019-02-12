import Layer from './layer.js';
import Time from './time.js';
import WXAPI from './wxapi.js';
import MD5 from './md5.js'
import Request from './request.js'
import Interface from './interface.js'
import Encryption from './encryption.js'
//实现深度拷贝，多重继承,target为拷贝的对象，source为被拷贝的对象
const copyProperties = function(target, source) {
        for (let key of Reflect.ownKeys(source)) { //Reflect.ownKeys(source)可以拿到所有的属性
            if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
                let desc = Object.getOwnPropertyDescriptor(source, key); //方法返回指定对象上一个自有属性对应的属性描述符。（自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性）
                Object.defineProperty(target, key, desc); //复制对象，key为值，desc为值的描述
            }
        }
    }
    //实现多重继承
const mix = function(...mixins) {
    class Mix {}
    for (let mixin of mixins) {
        copyProperties(Mix, mixin);
        copyProperties(Mix.prototype, mixin.prototype);
    }
    return Mix
}
class Lottery extends mix(Layer, Time, WXAPI, MD5, Request, Interface, Encryption) {
    constructor() {
        super();
        this.baseUrl = "https://jihu.api.juworker.com/api/"
    }
}

export default Lottery;