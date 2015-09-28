/*!
 * Helper源码分析-extend函数
 * Helper版本:1.4.2
 * 
 * ----------------------------------------------------------
 * 函数介绍
 * Helper.extend与Helper.fn.extend指向同一个函数对象
 * Helper.extend是Helper的属性函数(静态方法)
 * Helper.fn.extend是Helper函数所构造对象的属性函数(对象方法)
 *
 * ----------------------------------------------------------
 * 使用说明
 * extend函数根据参数和调用者实现功能如下：
 * 1.对象合并:
 * 对象合并不区分调用者,Helper.extend与Helper.fn.extend完全一致
 * 也就是说对Helper对象本身及Helper所构造的对象没有影响
 * 对象合并根据参数区分,参数中必须包括两个或两个以上对象
 * 如:$.extend({Object}, {Object}) 或 $.extend({Boolean},{Object}, {Object})
 * 对象合并返回最终合并后的对象,支持深度拷贝
 * 
 * 2.为Helper对象本身增加方法:
 * 这种方式从调用者和参数进行区分
 * 形式为 $.extend({Object})
 * 这种方式等同于 Helper.{Fnction Name}
 * 
 * 3.原型继承:
 * 原型继承方式可以为Helper所构造的对象增加方法
 * 这种方式也通过调用者和参数进行区分
 * 形式为 $.fn.extend({Object})
 * 这种方式实际上是将{Object}追加到Helper.prototype,实现原型继承
 * 
 * ----------------------------------------------------------
 * 
 */
var Helper = function(){

}
Helper.extend  = function(){

    //目标对象
    var target = arguments[0] || {},    
    
    //循环变量,它会在循环时指向需要复制的第一个对象的位置,默认为1
    //如果需要进行深度复制,则它指向的位置为2
    i = 1,    
    
    //实参长度
    length = arguments.length,    
    
    //是否进行深度拷贝
    //深度拷贝情况下,会对对象更深层次的属性对象进行合并和覆盖
    deep = false,    
    
    //用于在复制时记录参数对象
    options,    
    
    //用于在复制时记录对象属性名
    name,    
    
    //用于在复制时记录目标对象的属性值
    src,    
    
    //用于在复制时记录参数对象的属性值
    copy;
    
    //只有当第一个实参为true时,即需要进行深度拷贝时,执行以下分支
    if (typeof target === "boolean") {
        //deep = true,进行深度拷贝
        deep = target;
        
        //进行深度拷贝时目标对象为第二个实参,如果没有则默认为空对象
        target = arguments[1] || {};
        
        //因为有了deep深度复制参数,因此i指向的位置为第二个参数
        i = 2;
    }
    
    //当目标对象不是一个Object且不是一个Function时(函数也是对象,因此使用Helper.isFunction进行检查)
    if (typeof target !== "object" && !Helper.isFunction(target)) {
        
        //设置目标为空对象
        target = {};
    }
    
    //如果当前参数中只包含一个{Object}
    //如 $.extend({Object}) 或 $.extend({Boolean}, {Object})
    //则将该对象中的属性拷贝到当前Helper对象或实例中
    //此情况下deep深度复制仍然有效
    if (length === i) {
        
        //target = this;这句代码是整个extend函数的核心
        //在这里目标对象被更改,这里的this指向调用者
        //在 $.extend()方式中表示Helper对象本身
        //在 $.fn.extend()方式中表示Helper函数所构造的对象(即Helper类的实例)
        target = this;
        
        //自减1,便于在后面的拷贝循环中,可以指向需要复制的对象
        --i;
    }
    
    //循环实参,循环从第1个参数开始,如果是深度复制,则从第2个参数开始
    for (; i < length; i++) {
        
        //当前参数不为null,undefined,0,false,空字符串时
        //options表示当前参数对象
        if ((options = arguments[i]) != null) {
            
            //遍历当前参数对象的属性,属性名记录到name
            for (name in options) {
                
                //src用于记录目标对象中的当前属性值
                src = target[name];
                
                //copy用于记录参数对象中的当前属性值
                copy = options[name];
                
                //存在目标对象本身的引用,构成死循环,结束此次遍历
                if (target === copy) {
                    continue;
                }
                
                //如果需要进行深度拷贝,且copy类型为对象或数组
                if (deep && copy && (Helper.isPlainObject(copy) || Helper.isArray(copy))) {
                
                    //如果src类型为对象或数组,则clone记录src
                    //否则colne记录与copy类型一致的空值(空数组或空对象)
                    var clone = src && (Helper.isPlainObject(src) || Helper.isArray(src)) ? src : Helper.isArray(copy) ? [] : {};
                    
                    //对copy迭代深度复制
                    target[name] = Helper.extend(deep, clone, copy);
                    
                    //如果不需要进行深度拷贝
                } else if (copy !== undefined) {
                    
                    //直接将copy复制给目标对象
                    target[name] = copy;
                }
            }
        }
    }
    
    //返回处理后的目标对象
    return target;
};


Helper.extend({
        // Create a simple deferred (one callbacks list)
        _Deferred: function () {
            var // callbacks list
            callbacks = [],
            //储存上下文环境和函数参数  stored [ context , args ]
            fired,
            //避免函数提前触发
            firing,
            //标示这个延迟对象是否被取消了  cancel方法
            cancelled,
            // the deferred itself
            deferred = {

                /*把要依次处理的函数(arguments)[可以是函数列表,也可以是函数数组]加入到队列表(callbacks)中,,返回 deferred 对象
                */
                done: function () {
                    if (!cancelled) {
                        //arguments函数参数对象,可以看出Helper喜欢把一个函数所有的参数定义到头部
                        var args = arguments,
                            i,
                            length,
                            elem,
                            type,
                            _fired;
                        //如果这个延迟对象已经触发，用 _fired保存[context , args ]
                        if (fired) {
                            _fired = fired;
                            fired = 0;   //修改fired=0,以便以后继续调用done()函数
                        }
                        for (i = 0, length = args.length; i < length; i++) {
                            elem = args[i];
                            //这里调用了静态的$.type方法
                            type = Helper.type(elem);
                            //do([f1,f2]),继续回头调用这个方法
                            if (type === "array") {
                                deferred.done.apply(deferred, elem);
                            } else if (type === "function") {
                                //callbacks 函数集合
                                callbacks.push(elem);
                            }
                        }
                        //如果这个延迟对象已触发，立即调用resolveWith方法
                        if (_fired) {
                            deferred.resolveWith(_fired[0], _fired[1]);
                        }
                    }
                    return this;
                },

                /*在给定的上下文(context默认为deferred=this对象)中执行队列,清除队列 resolve 执行队列,返回 deferred 对象
                */
                resolveWith: function (context, args) {
                    //没有被取消&&没有被已经触发&&避免提前触发
                    if (!cancelled && !fired && !firing) {
                        // make sure args are available (#8421)
                        args = args || [];
                        //阻止callbacks提前触发
                        firing = 1;
                        try {
                            //循环执行回调函数队列，不错的写法
                            while (callbacks[0]) {
                                callbacks.shift().apply(context, args);
                            }
                        }
                        finally {
                            //修改deferred里的变量状态,firing=0 阻止回调函数触发,fired store[context,args]
                            //其实这里的fired firing相当于deferred对象的私有变量，通过改变他的值判断函数队列的执行。
                            fired = [context, args];
                            firing = 0;
                        }
                    }
                    return this;
                },

                /* resolve with this as context and given arguments,这里的this指代deferred对象
                 */
                resolve: function () {
                    //当resolve后，以后done（）进来的函数都会立即执行，这个在$(function(){});运用的非常好！这里$(function(){})=
                    $(document).ready(function(){})原因可以在init实例化的函数中看到
                    if (Helper.isFunction(selector)) {return rootHelper.ready(selector)};
                    deferred.resolveWith(this, arguments);
                    return this;
                },

                /* Has this deferred been resolved?为什么要用!!了,这样才能返回true或者false,比如!!1 !!0 通过deferred对象私有变量判断是否已被
                       resolved
                */
                isResolved: function () {
                    return !!(firing || fired);
                },

                // Cancel cancelled=1可以阻止callbacks触发,并清空callbacks.这个函数其实我们自己用不到Helper后面扩展我们使用的Deferred对象时候会取消掉
                cancel: function () {
                    cancelled = 1;
                    callbacks = [];
                    return this;
                }
            };

            return deferred;
        },

        /*这个$.Deferred()才是给我们使用的，然后根据私有的_Deferred对象扩展出fail，reject等等，这个其实跟done,resolve是同理的，所有作者这里进行了代码公用，只是取了个不同的名字
         */
        Deferred: function (func) {
            //建立两个私有的延迟对象,扩展deferred，用failDeferred去代替fail ,rejectWith ,reject
            var deferred = Helper._Deferred(),
            failDeferred = Helper._Deferred(),
            promise;
            //增加错误的deferred methods,and promise
            Helper.extend(deferred, {
                //两个参数，一个成功回调函数队列，一个失败回调函数队列
                then: function (doneCallbacks, failCallbacks) {
                    deferred.done(doneCallbacks).fail(failCallbacks);
                    return this;
                },
                //不管失败与否都调用
                always: function () {
                    // done的上下文设置为deferred，fail的上下文设置为this
                    // done和fail的上下文不一致吗？一致！在这里this等于deferred
                    //这行代码同 deferred.done(arguments).fail(arguments);这里感觉有点怪，为了让这个函数队列arguments执行，不得不在done和fail队列同时添加一种回调函数队列然后 return this;但是后面后删除done队列或者fail队列，看那个函数被执行了 答案在这deferred.done(failDeferred.cancel).fail(deferred.cancel);
                    return deferred.done.apply(deferred, arguments).fail.apply(this, arguments);
                },
                //这几个方法跟上面done,resolveWith,resolve,isResolve的同理
                fail: failDeferred.done,
                rejectWith: failDeferred.resolveWith,
                reject: failDeferred.resolve,
                isRejected: failDeferred.isResolved,
                pipe: function (fnDone, fnFail) {
                  //暂时没搞懂这个拿来干什么,直到怎么理解的可以留下言谢谢
                    return Helper.Deferred(function (newDefer) {
                       //遍历一个对象
                        Helper.each({
                            done: [fnDone, "resolve"],
                            fail: [fnFail, "reject"]
                        }, function (handler, data) {
                            var fn = data[0],
                            action = data[1],
                            returned;
                            if (Helper.isFunction(fn)) {
                                deferred[handler](function () {
                                    returned = fn.apply(this, arguments);
                                    if (returned && Helper.isFunction(returned.promise)) {
                                        returned.promise().then(newDefer.resolve, newDefer.reject);
                                    } else {
                                        newDefer[action + "With"](this === deferred ? newDefer : this, [returned]);
                                    }
                                });
                            } else {
                                deferred[handler](newDefer[action]);
                            }
                        });
                    }).promise();
                },

                /* 返回一个包含 done fail isResolved isRejected promise then always pipe的deferred对象，不让外部修改状态，只能读状态
                 */
                promise: function (obj) {
                    if (obj == null) {
                        if (promise) {
                            return promise;
                        }
                        promise = obj = {};
                    }
                    var i = promiseMethods.length;
                    //又一个经典的循环方法，这样更快，这样i--是跟0比较，而不用跟promiseMethods.length比较,学到吧
                    while (i--) {
                        obj[promiseMethods[i]] = deferred[promiseMethods[i]];
                    }
                    return obj;
                }
            });
            // 成功队列执行完成后，会执行失败带列的取消方法
            // 失败队列执行完成后，会执行成功队列的取消方法
            // 确保只有一个函数队列会被执行，即要么执行成功队列，要么执行失败队列；
            // 即状态只能是或成功、或失败，无交叉调用
            deferred.done(failDeferred.cancel).fail(deferred.cancel);
            // Unexpose cancel
            delete deferred.cancel;
            //如果有函数传进来则立即执行 传入deferred对象,调用回调函数,如def=$.Deferred(funciton(defer){ defer.resolve;.. })
            if (func) {
                func.call(deferred, deferred);
            }
            //返回deferred对象
            return deferred;
        },

        /* Deferred helper
           异步队列工具函数
          firstParam：一个或多个Deferred对象或JavaScript普通对象
        */
        when: function (firstParam) {
           //如果参数的长度等于1，并且存在promise函数，表面是一个deferred对象，它这样判断传入的参数是个deferred对象。如果都不满足则新建一个$.Deferred()对象
            var args = arguments,
            i = 0,
            length = args.length,
            count = length,
            deferred = length <= 1 && firstParam && Helper.isFunction(firstParam.promise) ?
                firstParam :
                Helper.Deferred();
             // 构造成功（resolve）回调函数
            function resolveFunc(i) {
                return function (value) {
                    // 如果传入的参数大于一个，则将传入的参数转换为真正的数组 sliceDeferred=[].slice
                    args[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;
                    //直到count为0的时候
                    if (!(--count)) {
                        // Strange bug in FF4:
                        // Values changed onto the arguments object sometimes end up as undefined values
                        // outside the $.when method. Cloning the object into a fresh array solves the issue
                        //resolve deferred 响应这个deferred对象，上面这句话好像是解决一个奇怪的bug
                        deferred.resolveWith(deferred, sliceDeferred.call(args, 0));
                    }
                };
            }
            if (length > 1) {
                for (; i < length; i++) {
                    //存在agrs[i]并且是args[i]是deferred对象，那这样的话作者怎么不直接Helper.isFunction(args[i].promise)，感觉多判断了，作者也蒙了吧
                    if (args[i] && Helper.isFunction(args[i].promise)) {
                        //执行一次resolveFunc(i)count就减少一个
                        args[i].promise().then(resolveFunc(i), deferred.reject);
                    } else {
                      // 计数器，表示发现不是Deferred对象，而是普通JavaScript象 ,反正最后只要count==0才能resovle deferred
                        --count;
                    }
                }
                if (!count) {
                    deferred.resolveWith(deferred, args);
                }
            } else if (deferred !== firstParam) {  //如果只传了一个参数，而这个参数又不是deferred对象，则立即resolve
                deferred.resolveWith(deferred, length ? [firstParam] : []);
            }
            return deferred.promise();  //返回deferred只读视图
        }
    });