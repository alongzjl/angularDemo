
 /*
 @Name : layDate v1.1 日期控件
 @Author: 贤心
 @Date: 2014-06-25
 @QQ群：176047195
 @Site：http://sentsin.com/layui/laydate
 
 */

;!function(win){

//全局配置，如果采用默认均不需要改动
var config =  {
    path: '', //laydate所在路径
    defSkin: 'default', //初始化皮肤
    format: 'YYYY-MM-DD', //日期格式
    min: '1900-01-01 00:00:00', //最小日期
    max: '2099-12-31 23:59:59', //最大日期
    isv: false
};

var DatesOne = {}, doc = document, creat = 'createElement', byid = 'getElementById', tags = 'getElementsByTagName';
var as = ['laydate_box', 'laydate_void', 'laydate_click', 'LayDateSkin', 'skins/', '/laydate.css'];


//主接口
win.laydateOne = function(options){
    options = options || {};
    try{
        as.event = win.event ? win.event : laydateOne.caller.arguments[0];
    } catch(e){};
    DatesOne.run(options);
    return laydateOne;
};

laydateOne.v = '1.1';

//获取组件存放路径
DatesOne.getPath = (function(){
    var js = document.scripts, jsPath = js[js.length - 1].src;
    return config.path ? config.path : jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
}());

DatesOne.use = function(lib, id){
    var link = doc[creat]('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = DatesOne.getPath + lib + as[5];
    id && (link.id = id);
    doc[tags]('head')[0].appendChild(link);
    link = null;
};

DatesOne.trim = function(str){
    str = str || '';
    return str.replace(/^\s|\s$/g, '').replace(/\s+/g, ' ');
};

//补齐数位
DatesOne.digit = function(num){
    return num < 10 ? '0' + (num|0) : num;
};

DatesOne.stopmp = function(e){
    e = e || win.event;
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    return this;
};

DatesOne.each = function(arr, fn){
    var i = 0, len = arr.length;
    for(; i < len; i++){
        if(fn(i, arr[i]) === false){
            break
        }
    }
};

DatesOne.hasClass = function(elem, cls){
    elem = elem || {};
    return new RegExp('\\b' + cls +'\\b').test(elem.className);
};

DatesOne.addClass = function(elem, cls){
    elem = elem || {};
    DatesOne.hasClass(elem, cls) || (elem.className += ' ' + cls);
    elem.className = DatesOne.trim(elem.className);
    return this;
};

DatesOne.removeClass = function(elem, cls) {
    elem = elem || {};
    if (DatesOne.hasClass(elem, cls)) {
        var reg = new RegExp('\\b' + cls +'\\b');
        elem.className = elem.className.replace(reg, '');
    }
    return this;
};

//清除css属性
DatesOne.removeCssAttr = function(elem, attr){
    var s = elem.style;
    if(s.removeProperty){
        s.removeProperty(attr);
    } else {
        s.removeAttribute(attr);
    }
};

//显示隐藏
DatesOne.shde = function(elem, type){
    elem.style.display = type ? 'none' : 'block';
};

//简易选择器
DatesOne.query = function(node){
    if(node && node.nodeType === 1){
        if(node.tagName.toLowerCase() !== 'input'){
            throw new Error('选择器elem错误');
        }
        return node;
    }

    var node = (DatesOne.trim(node)).split(' '), elemId = doc[byid](node[0].substr(1)), arr;
    if(!elemId){
        return;
    } else if(!node[1]){
        return elemId;
    } else if(/^\./.test(node[1])){
        var find, child = node[1].substr(1), exp = new RegExp('\\b' + child +'\\b');
        arr = []
        find = doc.getElementsByClassName ? elemId.getElementsByClassName(child) : elemId[tags]('*');
        DatesOne.each(find, function(ii, that){
            exp.test(that.className) && arr.push(that); 
        });
        return arr[0] ? arr : '';
    } else {
        arr = elemId[tags](node[1]);
        return arr[0] ? elemId[tags](node[1]) : '';
    }
};

//事件监听器
DatesOne.on = function(elem, even, fn){
    elem.attachEvent ? elem.attachEvent('on'+ even, function(){
        fn.call(elem, win.even);
    }) : elem.addEventListener(even, fn, false);
    return DatesOne;
};

//阻断mouseup
DatesOne.stopMosup = function(evt, elem){
    if(evt !== 'mouseup'){
        DatesOne.on(elem, 'mouseup', function(ev){
            DatesOne.stopmp(ev);
        });
    }
};

DatesOne.run = function(options){
    var S = DatesOne.query, elem, devt, even = as.event, target;
    try {
        target = even.target || even.srcElement || {};
    } catch(e){
        target = {};
    }
    elem = options.elem ? S(options.elem) : target;
    if(even && target.tagName){
        if(!elem || elem === DatesOne.elem){
            return;
        }
        DatesOne.stopMosup(even.type, elem);
        DatesOne.stopmp(even);
        DatesOne.view(elem, options);
        DatesOne.reshow();
    } else {
        devt = options.event || 'click';
        DatesOne.each((elem.length|0) > 0 ? elem : [elem], function(ii, that){
            DatesOne.stopMosup(devt, that);
            DatesOne.on(that, devt, function(ev){
                DatesOne.stopmp(ev);
                if(that !== DatesOne.elem){
                    DatesOne.view(that, options);
                    DatesOne.reshow();
                }
            });
        });
    }
};

DatesOne.scroll = function(type){
    type = type ? 'scrollLeft' : 'scrollTop';
    return doc.body[type] | doc.documentElement[type];
};

DatesOne.winarea = function(type){
    return document.documentElement[type ? 'clientWidth' : 'clientHeight']
};

//判断闰年
DatesOne.isleap = function(year){
    return (year%4 === 0 && year%100 !== 0) || year%400 === 0;
};

//检测是否在有效期
DatesOne.checkVoid = function(YY, MM, DD){
    var back = [];
    YY = YY|0;
    MM = MM|0;
    DD = DD|0;
    if(YY < DatesOne.mins[0]){
        back = ['y'];
    } else if(YY > DatesOne.maxs[0]){
        back = ['y', 1];
    } else if(YY >= DatesOne.mins[0] && YY <= DatesOne.maxs[0]){
        if(YY == DatesOne.mins[0]){
            if(MM < DatesOne.mins[1]){
                back = ['m'];
            } else if(MM == DatesOne.mins[1]){
                if(DD < DatesOne.mins[2]){
                    back = ['d'];
                }
            }
        }
        if(YY == DatesOne.maxs[0]){
            if(MM > DatesOne.maxs[1]){
                back = ['m', 1];
            } else if(MM == DatesOne.maxs[1]){
                if(DD > DatesOne.maxs[2]){
                    back = ['d', 1];
                }
            }
        }
    }
    return back;
};

//时分秒的有效检测
DatesOne.timeVoid = function(times, index){
    if(DatesOne.ymd[1]+1 == DatesOne.mins[1] && DatesOne.ymd[2] == DatesOne.mins[2]){
        if(index === 0 && (times < DatesOne.mins[3])){
            return 1;
        } else if(index === 1 && times < DatesOne.mins[4]){
            return 1;
        } else if(index === 2 && times < DatesOne.mins[5]){
            return 1;
        }
    } else if(DatesOne.ymd[1]+1 == DatesOne.maxs[1] && DatesOne.ymd[2] == DatesOne.maxs[2]){
        if(index === 0 && times > DatesOne.maxs[3]){
            return 1;
        } else if(index === 1 && times > DatesOne.maxs[4]){
            return 1;
        } else if(index === 2 && times > DatesOne.maxs[5]){
            return 1;
        }
    }
    if(times > (index ? 59 : 23)){
        return 1;
    }
};

//检测日期是否合法
DatesOne.check = function(){
    var reg = DatesOne.options.format.replace(/YYYY|MM|DD|hh|mm|ss/g,'\\d+\\').replace(/\\$/g, '');
    var exp = new RegExp(reg), value = DatesOne.elem[as.elemv];
    var arr = value.match(/\d+/g) || [], isvoid = DatesOne.checkVoid(arr[0], arr[1], arr[2]);
    if(value.replace(/\s/g, '') !== ''){
        if(!exp.test(value)){
            DatesOne.elem[as.elemv] = '';
            DatesOne.msg('日期不符合格式，请重新选择。');
            return 1;
        } else if(isvoid[0]){
            DatesOne.elem[as.elemv] = '';
            DatesOne.msg('日期不在有效期内，请重新选择。');
            return 1;
        } else {
            isvoid.value = DatesOne.elem[as.elemv].match(exp).join();
            arr = isvoid.value.match(/\d+/g);
            if(arr[1] < 1){
                arr[1] = 1;
                isvoid.auto = 1;
            } else if(arr[1] > 12){
                arr[1] = 12;
                isvoid.auto = 1;
            } else if(arr[1].length < 2){
                isvoid.auto = 1;
            }
            if(arr[2] < 1){
                arr[2] = 1;
                isvoid.auto = 1;
            } else if(arr[2] > DatesOne.months[(arr[1]|0)-1]){
                arr[2] = 31;
                isvoid.auto = 1;
            } else if(arr[2].length < 2){
                isvoid.auto = 1;
            }
            if(arr.length > 3){
                if(DatesOne.timeVoid(arr[3], 0)){
                    isvoid.auto = 1;
                };
                if(DatesOne.timeVoid(arr[4], 1)){
                    isvoid.auto = 1;
                };
                if(DatesOne.timeVoid(arr[5], 2)){
                    isvoid.auto = 1;
                };
            }
            if(isvoid.auto){
                DatesOne.creation([arr[0], arr[1]|0, arr[2]|0], 1);
            } else if(isvoid.value !== DatesOne.elem[as.elemv]){
                DatesOne.elem[as.elemv] = isvoid.value;
            }
        }
    }
};

//生成日期
DatesOne.months = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
DatesOne.viewDate = function(Y, M, D){
    var S = DatesOne.query, log = {}, De = new Date();
    Y < (DatesOne.mins[0]|0) && (Y = (DatesOne.mins[0]|0));
    Y > (DatesOne.maxs[0]|0) && (Y = (DatesOne.maxs[0]|0));
    
    De.setFullYear(Y, M, D);
    log.ymd = [De.getFullYear(), De.getMonth(), De.getDate()];
    
    DatesOne.months[1] = DatesOne.isleap(log.ymd[0]) ? 29 : 28;
    
    De.setFullYear(log.ymd[0], log.ymd[1], 1);
    log.FDay = De.getDay();
    
    log.PDay = DatesOne.months[M === 0 ? 11 : M - 1] - log.FDay + 1;
    log.NDay = 1;
    
    //渲染日
    DatesOne.each(as.tds, function(i, elem){
        var YY = log.ymd[0], MM = log.ymd[1] + 1, DD;
        elem.className = '';
        if(i < log.FDay){
            elem.innerHTML = DD = i + log.PDay;
            DatesOne.addClass(elem, 'laydate_nothis');
            MM === 1 && (YY -= 1);
            MM = MM === 1 ? 12 : MM - 1; 
        } else if(i >= log.FDay && i < log.FDay + DatesOne.months[log.ymd[1]]){
            elem.innerHTML = DD = i  - log.FDay + 1;
            if(i - log.FDay + 1 === log.ymd[2]){
                DatesOne.addClass(elem, as[2]);
                log.thisDay = elem;
            }
        } else {
            elem.innerHTML = DD = log.NDay++;
            DatesOne.addClass(elem, 'laydate_nothis');
            MM === 12 && (YY += 1);
            MM = MM === 12 ? 1 : MM + 1; 
        }
       
        if(DatesOne.checkVoid(YY, MM, DD)[0]){
            DatesOne.addClass(elem, as[1]);
        }
        
        DatesOne.options.festival && DatesOne.festival(elem, MM + '.' + DD);
        elem.setAttribute('y', YY);
        elem.setAttribute('m', MM);
        elem.setAttribute('d', DD);
        YY = MM = DD = null;
    });
    
    DatesOne.valid = !DatesOne.hasClass(log.thisDay, as[1]);
    DatesOne.ymd = log.ymd;
    
    //锁定年月
    as.year.value = DatesOne.ymd[0] + '年';
    as.month.value = DatesOne.digit(DatesOne.ymd[1] + 1) + '月';
    
    //定位月
    DatesOne.each(as.mms, function(i, elem){
        var getCheck = DatesOne.checkVoid(DatesOne.ymd[0], (elem.getAttribute('m')|0) + 1);
        if(getCheck[0] === 'y' || getCheck[0] === 'm'){
            DatesOne.addClass(elem, as[1]);
        } else {
            DatesOne.removeClass(elem, as[1]);
        }
        DatesOne.removeClass(elem, as[2]);
        getCheck = null
    });
    DatesOne.addClass(as.mms[DatesOne.ymd[1]], as[2]);
        
    //定位时分秒
    log.times = [
        DatesOne.inymd[3]|0 || 0, 
        DatesOne.inymd[4]|0 || 0, 
        DatesOne.inymd[5]|0 || 0
    ];
    DatesOne.each(new Array(3), function(i){
        DatesOne.hmsin[i].value = DatesOne.digit(DatesOne.timeVoid(log.times[i], i) ? DatesOne.mins[i+3]|0 : log.times[i]|0);
    });
    
    //确定按钮状态
    DatesOne[DatesOne.valid ? 'removeClass' : 'addClass'](as.ok, as[1]);
};

//节日
DatesOne.festival = function(td, md){
    var str;
    switch(md){
        case '1.1':
            str = '元旦';
        break;
        case '3.8':
            str = '妇女';
        break;
        case '4.5':
            str = '清明';
        break;
        case '5.1':
            str = '劳动';
        break;
        case '6.1':
            str = '儿童';
        break;
        case '9.10':
            str = '教师';
        break;
        case '10.1':
            str = '国庆';
        break;
    };
    str && (td.innerHTML = str);
    str = null;
};

//生成年列表
DatesOne.viewYears = function(YY){
    var S = DatesOne.query, str = '';
    DatesOne.each(new Array(14), function(i){
        if(i === 7) {
            str += '<li '+ (parseInt(as.year.value) === YY ? 'class="'+ as[2] +'"' : '') +' y="'+ YY +'">'+ YY +'年</li>';
        } else {
            str += '<li y="'+ (YY-7+i) +'">'+ (YY-7+i) +'年</li>';
        }
    }); 
    S('#laydate_ys').innerHTML = str;
    DatesOne.each(S('#laydate_ys li'), function(i, elem){
        if(DatesOne.checkVoid(elem.getAttribute('y'))[0] === 'y'){
            DatesOne.addClass(elem, as[1]);
        } else {
            DatesOne.on(elem, 'click', function(ev){
                DatesOne.stopmp(ev).reshow();
                DatesOne.viewDate(this.getAttribute('y')|0, DatesOne.ymd[1], DatesOne.ymd[2]);
            });
        }
    });
};

//初始化面板数据
DatesOne.initDate = function(){
    var S = DatesOne.query, log = {}, De = new Date();
    var ymd = DatesOne.elem[as.elemv].match(/\d+/g) || [];
    if(ymd.length < 3){
        ymd = DatesOne.options.start.match(/\d+/g) || [];
        if(ymd.length < 3){
            ymd = [De.getFullYear(), De.getMonth()+1, De.getDate()];
        }
    }
    DatesOne.inymd = ymd;
    DatesOne.viewDate(ymd[0], ymd[1]-1, ymd[2]);
};

//是否显示零件
DatesOne.iswrite = function(){
    /*var S = DatesOne.query, log = {
        time: S('#laydate_hms')
    };
    DatesOne.shde(log.time, !DatesOne.options.istime);
    DatesOne.shde(as.oclear, !('isclear' in DatesOne.options ? DatesOne.options.isclear : 1));
    DatesOne.shde(as.otoday, !('istoday' in DatesOne.options ? DatesOne.options.istoday : 1));
    DatesOne.shde(as.ok, !('issure' in DatesOne.options ? DatesOne.options.issure : 1));*/
};

//方位辨别
DatesOne.orien = function(obj, pos){
    var tops, rect = DatesOne.elem.getBoundingClientRect();
    obj.style.left = rect.left + (pos ? 0 : DatesOne.scroll(1)) + 'px';
    if(rect.bottom + obj.offsetHeight/1.5 <= DatesOne.winarea()){
        tops = rect.bottom - 1;         
    } else {
        tops = rect.top > obj.offsetHeight/1.5 ? rect.top - obj.offsetHeight + 1 : DatesOne.winarea() - obj.offsetHeight;
    }
    obj.style.top = tops + (pos ? 0 : DatesOne.scroll()) + 'px';
};

//吸附定位
DatesOne.follow = function(obj){
    if(DatesOne.options.fixed){
        obj.style.position = 'fixed';
        DatesOne.orien(obj, 1);
    } else {
        obj.style.position = 'absolute';
        DatesOne.orien(obj);
    }
};

//生成表格
DatesOne.viewtb = (function(){
    var tr, view = [], weeks = [ '日', '一', '二', '三', '四', '五', '六'];
    var log = {}, table = doc[creat]('table'), thead = doc[creat]('thead');
    thead.appendChild(doc[creat]('tr'));
    log.creath = function(i){
        var th = doc[creat]('th');
        th.innerHTML = weeks[i];
        thead[tags]('tr')[0].appendChild(th);
        th = null;
    };
    
    DatesOne.each(new Array(6), function(i){
        view.push([]);
        tr = table.insertRow(0);
        DatesOne.each(new Array(7), function(j){
            view[i][j] = 0;
            i === 0 && log.creath(j);
            tr.insertCell(j);
        });
    });
    
    table.insertBefore(thead, table.children[0]); 
    table.id = table.className = 'laydate_table';
    tr = view = null;
    return table.outerHTML.toLowerCase();
}());

//渲染控件骨架
DatesOne.view = function(elem, options){
    var S = DatesOne.query, div, log = {};
    options = options || elem;

    DatesOne.elem = elem;
    DatesOne.options = options;
    DatesOne.options.format || (DatesOne.options.format = config.format);
    DatesOne.options.start = DatesOne.options.start || '';
    DatesOne.mm = log.mm = [DatesOne.options.min || config.min, DatesOne.options.max || config.max];
    DatesOne.mins = log.mm[0].match(/\d+/g);
    DatesOne.maxs = log.mm[1].match(/\d+/g);
    
    as.elemv = /textarea|input/.test(DatesOne.elem.tagName.toLocaleLowerCase()) ? 'value' : 'innerHTML';
       
    if(!DatesOne.box){
        div = doc[creat]('div');
        div.id = as[0];
        div.className = as[0];
        div.style.cssText = 'position: absolute;';
        div.setAttribute('name', 'laydate-v'+ laydateOne.v);
        
        div.innerHTML =  log.html = '<div class="laydate_top">'
          +'<div class="laydate_ym laydate_y" id="laydate_YY">'
            +'<a class="laydate_choose laydate_chprev laydate_tab"><cite></cite></a>'
            +'<input id="laydate_y" readonly><label></label>'
            +'<a class="laydate_choose laydate_chnext laydate_tab"><cite></cite></a>'
            +'<div class="laydate_yms">'
              +'<a class="laydate_tab laydate_chtop"><cite></cite></a>'
              +'<ul id="laydate_ys"></ul>'
              +'<a class="laydate_tab laydate_chdown"><cite></cite></a>'
            +'</div>'
          +'</div>'
          +'<div class="laydate_ym laydate_m" id="laydate_MM">'
            +'<a class="laydate_choose laydate_chprev laydate_tab"><cite></cite></a>'
            +'<input id="laydate_m" readonly><label></label>'
            +'<a class="laydate_choose laydate_chnext laydate_tab"><cite></cite></a>'
            +'<div class="laydate_yms" id="laydate_ms">'+ function(){
                var str = '';
                DatesOne.each(new Array(12), function(i){
                    str += '<span m="'+ i +'">'+ DatesOne.digit(i+1) +'月</span>';
                });
                return str;/**
 
 @Name : layDate 5.0.5 日期时间控件
 @Author: 贤心
 @Site：http://www.layui.com/laydate/
 @License：MIT
 
 */

;!function(){
  "use strict";

  var isLayui = window.layui && layui.define, ready = {
    getPath: function(){
      var js = document.scripts, script = js[js.length - 1], jsPath = script.src;
      if(script.getAttribute('merge')) return;
      return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
    }()
    
    //获取节点的style属性值
    ,getStyle: function(node, name){
      var style = node.currentStyle ? node.currentStyle : window.getComputedStyle(node, null);
      return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
    }
    
    //载入CSS配件
    ,link: function(href, fn, cssname){
      
      //未设置路径，则不主动加载css
      if(!laydateOne.path) return;
      
      var head = document.getElementsByTagName("head")[0], link = document.createElement('link');
      if(typeof fn === 'string') cssname = fn;
      var app = (cssname || href).replace(/\.|\//g, '');
      var id = 'layuicss-'+ app, timeout = 0;
      
      link.rel = 'stylesheet';
      link.href = laydateOne.path + href;
      link.id = id;
      
      if(!document.getElementById(id)){
        head.appendChild(link);
      }
      
      if(typeof fn !== 'function') return;
      
      //轮询css是否加载完毕
      (function poll() { 
        if(++timeout > 8 * 1000 / 100){
          return window.console && console.error('laydate.css: Invalid');
        };
        parseInt(ready.getStyle(document.getElementById(id), 'width')) === 1989 ? fn() : setTimeout(poll, 100);
      }());
    }
  }

  ,laydateOne = {
    v: '5.0.5'
    ,config: {} //全局配置项
    ,index: (window.laydateOne && window.laydateOne.v) ? 100000 : 0
    ,path: ready.getPath
    
    //设置全局项
    ,set: function(options){
      var that = this;
      that.config = ready.extend({}, that.config, options);
      return that;
    }
    
    //主体CSS等待事件
    ,ready: function(fn){
      var cssname = 'laydate', ver = ''
      ,path = (isLayui ? 'modules/laydate/' : 'theme/') + 'default/laydate.css?v='+ laydateOne.v + ver;
      if(typeof define === 'function' && define.amd) return fn();
      isLayui ? layui.addcss(path, fn, cssname) : ready.link(path, fn, cssname);
      return this;
    }
  }
  
  //操作当前实例
  ,thisDate = function(){
    var that = this;
    return {
      //提示框
      hint: function(content){
        that.hint.call(that, content);
      }
      ,config: that.config
    };
  }

  //字符常量
  ,MOD_NAME = 'laydate', ELEM = '.layui-laydate', THIS = 'layui-this', SHOW = 'layui-show', HIDE = 'layui-hide', DISABLED = 'laydate-disabled', TIPS_OUT = '开始日期超出了结束日期<br>建议重新选择', LIMIT_YEAR = [100, 200000]
  
  ,ELEM_LIST = 'layui-laydate-list', ELEM_SELECTED = 'laydate-selected', ELEM_HINT = 'layui-laydate-hint', ELEM_PREV = 'laydate-day-prev', ELEM_NEXT = 'laydate-day-next', ELEM_FOOTER = 'layui-laydate-footer', ELEM_CONFIRM = '.laydate-btns-confirm', ELEM_TIME_TEXT = 'laydate-time-text', ELEM_TIME_BTN = '.laydate-btns-time'
  
  //组件构造器
  ,Class = function(options){
    var that = this;
    that.index = ++laydateOne.index;
    that.config = lay.extend({}, that.config, laydateOne.config, options);
    laydateOne.ready(function(){
      that.init();
    });
  }
  
  //DOM查找
  ,lay = function(selector){   
    return new LAY(selector);
  }
  
  //DOM构造器
  ,LAY = function(selector){
    var index = 0
    ,nativeDOM = typeof selector === 'object' ? [selector] : (
      this.selector = selector
      ,document.querySelectorAll(selector || null)
    );
    for(; index < nativeDOM.length; index++){
      this.push(nativeDOM[index]);
    }
  };
  
  
  /*
    lay对象操作
  */
  
  LAY.prototype = [];
  LAY.prototype.constructor = LAY;
  
  //普通对象深度扩展
  lay.extend = function(){
    var ai = 1, args = arguments
    ,clone = function(target, obj){
      target = target || (obj.constructor === Array ? [] : {}); 
      for(var i in obj){
        //如果值为对象，则进入递归，继续深度合并
        target[i] = (obj[i] && (obj[i].constructor === Object))
          ? clone(target[i], obj[i])
        : obj[i];
      }
      return target;
    }

    args[0] = typeof args[0] === 'object' ? args[0] : {};

    for(; ai < args.length; ai++){
      if(typeof args[ai] === 'object'){
        clone(args[0], args[ai])
      }
    }
    return args[0];
  };
  
  //ie版本
  lay.ie = function(){
    var agent = navigator.userAgent.toLowerCase();
    return (!!window.ActiveXObject || "ActiveXObject" in window) ? (
      (agent.match(/msie\s(\d+)/) || [])[1] || '11' //由于ie11并没有msie的标识
    ) : false;
  }();
  
  //中止冒泡
  lay.stope = function(e){
    e = e || win.event;
    e.stopPropagation 
      ? e.stopPropagation() 
    : e.cancelBubble = true;
  };
  
  //对象遍历
  lay.each = function(obj, fn){
    var key
    ,that = this;
    if(typeof fn !== 'function') return that;
    obj = obj || [];
    if(obj.constructor === Object){
      for(key in obj){
        if(fn.call(obj[key], key, obj[key])) break;
      }
    } else {
      for(key = 0; key < obj.length; key++){
        if(fn.call(obj[key], key, obj[key])) break;
      }
    }
    return that;
  };
  
  //数字前置补零
  lay.digit = function(num, length, end){
    var str = '';
    num = String(num);
    length = length || 2;
    for(var i = num.length; i < length; i++){
      str += '0';
    }
    return num < Math.pow(10, length) ? str + (num|0) : num;
  };
  
  //创建元素
  lay.elem = function(elemName, attr){
    var elem = document.createElement(elemName);
    lay.each(attr || {}, function(key, value){
      elem.setAttribute(key, value);
    });
    return elem;
  };
  
  //追加字符
  LAY.addStr = function(str, new_str){
    str = str.replace(/\s+/, ' ');
    new_str = new_str.replace(/\s+/, ' ').split(' ');
    lay.each(new_str, function(ii, item){
      if(!new RegExp('\\b'+ item + '\\b').test(str)){
        str = str + ' ' + item;
      }
    });
    return str.replace(/^\s|\s$/, '');
  };
  
  //移除值
  LAY.removeStr = function(str, new_str){
    str = str.replace(/\s+/, ' ');
    new_str = new_str.replace(/\s+/, ' ').split(' ');
    lay.each(new_str, function(ii, item){
      var exp = new RegExp('\\b'+ item + '\\b')
      if(exp.test(str)){
        str = str.replace(exp, '');
      }
    });
    return str.replace(/\s+/, ' ').replace(/^\s|\s$/, '');
  };
  
  //查找子元素
  LAY.prototype.find = function(selector){
    var that = this;
    var index = 0, arr = []
    ,isObject = typeof selector === 'object';
    
    this.each(function(i, item){
      var nativeDOM = isObject ? [selector] : item.querySelectorAll(selector || null);
      for(; index < nativeDOM.length; index++){
        arr.push(nativeDOM[index]);
      }
      that.shift();
    });
    
    if(!isObject){
      that.selector =  (that.selector ? that.selector + ' ' : '') + selector
    }
    
    lay.each(arr, function(i, item){
      that.push(item);
    });
    
    return that;
  };
  
  //DOM遍历
  LAY.prototype.each = function(fn){
    return lay.each.call(this, this, fn);
  };
  
  //添加css类
  LAY.prototype.addClass = function(className, type){
    return this.each(function(index, item){
      item.className = LAY[type ? 'removeStr' : 'addStr'](item.className, className)
    });
  };
  
  //移除css类
  LAY.prototype.removeClass = function(className){
    return this.addClass(className, true);
  };
  
  //是否包含css类
  LAY.prototype.hasClass = function(className){
    var has = false;
    this.each(function(index, item){
      if(new RegExp('\\b'+ className +'\\b').test(item.className)){
        has = true;
      }
    });
    return has;
  };
  
  //添加或获取属性
  LAY.prototype.attr = function(key, value){
    var that = this;
    return value === undefined ? function(){
      if(that.length > 0) return that[0].getAttribute(key);
    }() : that.each(function(index, item){
      item.setAttribute(key, value);
    });   
  };
  
  //移除属性
  LAY.prototype.removeAttr = function(key){
    return this.each(function(index, item){
      item.removeAttribute(key);
    });
  };
  
  //设置HTML内容
  LAY.prototype.html = function(html){
    return this.each(function(index, item){
      item.innerHTML = html;
    });
  };
  
  //设置值
  LAY.prototype.val = function(value){
    return this.each(function(index, item){
      item.value = value;
    });
  };
  
  //追加内容
  LAY.prototype.append = function(elem){
    return this.each(function(index, item){
      typeof elem === 'object' 
        ? item.appendChild(elem)
      :  item.innerHTML = item.innerHTML + elem;
    });
  };
  
  //移除内容
  LAY.prototype.remove = function(elem){
    return this.each(function(index, item){
      elem ? item.removeChild(elem) : item.parentNode.removeChild(item);
    });
  };
  
  //事件绑定
  LAY.prototype.on = function(eventName, fn){
    return this.each(function(index, item){
      item.attachEvent ? item.attachEvent('on' + eventName, function(e){
        e.target = e.srcElement;
        fn.call(item, e);
      }) : item.addEventListener(eventName, fn, false);
    });
  };
  
  //解除事件
  LAY.prototype.off = function(eventName, fn){
    return this.each(function(index, item){
      item.detachEvent 
        ? item.detachEvent('on'+ eventName, fn)  
      : item.removeEventListener(eventName, fn, false);
    });
  };
  
  
  /*
    组件操作
  */
  
  
  //是否闰年
  Class.isLeapYear = function(year){
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };
  
  //默认配置
  Class.prototype.config = {
    type: 'date' //控件类型，支持：year/month/date/time/datetime
    ,range: false //是否开启范围选择，即双控件
    ,format: 'yyyy-MM-dd' //默认日期格式
    ,value: null //默认日期，支持传入new Date()，或者符合format参数设定的日期格式字符
    ,min: '1900-1-1' //有效最小日期，年月日必须用“-”分割，时分秒必须用“:”分割。注意：它并不是遵循 format 设定的格式。
    ,max: '2099-12-31' //有效最大日期，同上
    ,trigger: 'focus' //呼出控件的事件
    ,show: false //是否直接显示，如果设置true，则默认直接显示控件
    ,showBottom: true //是否显示底部栏
    ,btns: ['clear', 'now', 'confirm'] //右下角显示的按钮，会按照数组顺序排列
    ,lang: 'cn' //语言，只支持cn/en，即中文和英文
    ,theme: 'default' //主题
    ,position: null //控件定位方式定位, 默认absolute，支持：fixed/absolute/static
    ,calendar: false //是否开启公历重要节日，仅支持中文版
    ,mark: {} //日期备注，如重要事件或活动标记
    ,zIndex: null //控件层叠顺序
    ,done: null //控件选择完毕后的回调，点击清空/现在/确定也均会触发
    ,change: null //日期时间改变后的回调
  };
  
  //多语言
  Class.prototype.lang = function(){
    var that = this
    ,options = that.config
    ,text = {
      cn: {
        weeks: ['日', '一', '二', '三', '四', '五', '六']
        ,time: ['时', '分', '秒']
        ,timeTips: '选择时间'
        ,startTime: '开始时间'
        ,endTime: '结束时间'
        ,dateTips: '返回日期'
        ,month: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
        ,tools: {
          confirm: '确定'
          ,clear: '清空'
          ,now: '现在'
        }
      }
      ,en: {
        weeks: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        ,time: ['Hours', 'Minutes', 'Seconds']
        ,timeTips: 'Select Time'
        ,startTime: 'Start Time'
        ,endTime: 'End Time'
        ,dateTips: 'Select Date'
        ,month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        ,tools: {
          confirm: 'Confirm'
          ,clear: 'Clear'
          ,now: 'Now'
        }
      }
    };
    return text[options.lang] || text['cn'];
  };
  
  //初始准备
  Class.prototype.init = function(){
    var that = this
    ,options = that.config
    ,dateType = 'yyyy|y|MM|M|dd|d|HH|H|mm|m|ss|s'
    ,isStatic = options.position === 'static'
    ,format = {
      year: 'yyyy'
      ,month: 'yyyy-MM'
      ,date: 'yyyy-MM-dd'
      ,time: 'HH:mm:ss'
      ,datetime: 'yyyy-MM-dd HH:mm:ss'
    };
    
    options.elem = lay(options.elem);
    options.eventElem = lay(options.eventElem);
    
    if(!options.elem[0]) return;
    
    //日期范围分隔符
    if(options.range === true) options.range = '-';
    
    //根据不同type，初始化默认format
    if(options.format === format.date){
      options.format = format[options.type];
    }
    
    //将日期格式转化成数组
    that.format = options.format.match(new RegExp(dateType + '|.', 'g')) || [];
    
    //生成正则表达式
    that.EXP_IF = ''; 
    that.EXP_SPLIT = ''; 
    lay.each(that.format, function(i, item){
      var EXP =  new RegExp(dateType).test(item) 
        ? '\\b\\d{1,'+ function(){
          if(/yyyy/.test(item)) return 4;
          if(/y/.test(item)) return 308;
          return 2;
        }() +'}\\b' 
      : '\\' + item;
      that.EXP_IF = that.EXP_IF + EXP;
      that.EXP_SPLIT = that.EXP_SPLIT + (that.EXP_SPLIT ? '|' : '') + '('+ EXP + ')';
    });
    that.EXP_IF = new RegExp('^'+ (
      options.range ? 
        that.EXP_IF + '\\s\\'+ options.range + '\\s' + that.EXP_IF
      : that.EXP_IF
    ) +'$');
    that.EXP_SPLIT = new RegExp(that.EXP_SPLIT, 'g');
    
    //如果不是input|textarea元素，则默认采用click事件
    if(!that.isInput(options.elem[0])){
      if(options.trigger === 'focus'){
        options.trigger = 'click';
      }
    }
    
    //设置唯一KEY
    if(!options.elem.attr('lay-key')){
      options.elem.attr('lay-key', that.index);
      options.eventElem.attr('lay-key', that.index);
    }
    
    //记录重要日期
    options.mark = lay.extend({}, (options.calendar && options.lang === 'cn') ? {
      '0-1-1': '元旦'
      ,'0-2-14': '情人'
      ,'0-3-8': '妇女'
      ,'0-3-12': '植树'
      ,'0-4-1': '愚人'
      ,'0-5-1': '劳动'
      ,'0-5-4': '青年'
      ,'0-6-1': '儿童'
      ,'0-9-10': '教师'
      ,'0-9-18': '国耻'
      ,'0-10-1': '国庆'
      ,'0-12-25': '圣诞'
    } : {}, options.mark);
    
    //获取限制内日期
    lay.each(['min', 'max'], function(i, item){
      var ymd = [], hms = [];
      if(typeof options[item] === 'number'){ //如果为数字
        var day = options[item]
        ,time = new Date().getTime()
        ,STAMP = 86400000 //代表一天的时间戳
        ,thisDate = new Date(
          day ? (
            day < STAMP ? time + day*STAMP : day //如果数字小于一天的时间戳，则数字为天数，否则为时间戳
          ) : time
        );
        ymd = [thisDate.getFullYear(), thisDate.getMonth() + 1, thisDate.getDate()];
        day < STAMP || (hms = [thisDate.getHours(), thisDate.getMinutes(), thisDate.getSeconds()]);
      } else {
        ymd = (options[item].match(/\d+-\d+-\d+/) || [''])[0].split('-');
        hms = (options[item].match(/\d+:\d+:\d+/) || [''])[0].split(':');
      }
      options[item] = {
        year: ymd[0] | 0 || new Date().getFullYear()
        ,month: ymd[1] ? (ymd[1] | 0) - 1 : new Date().getMonth()
        ,date: ymd[2] | 0 || new Date().getDate()
        ,hours: hms[0] | 0
        ,minutes: hms[1] | 0
        ,seconds: hms[2] | 0
      };
    });
    
    that.elemID = 'layui-laydate'+ options.elem.attr('lay-key');
    
    if(options.show || isStatic) that.render();
    isStatic || that.events();
    
    //默认赋值
    if(options.value){
      if(options.value.constructor === Date){
        that.setValue(that.parse(0, that.systemDate(options.value))); 
      } else {
        that.setValue(options.value); 
      }
    }
  };
  
  //控件主体渲染
  Class.prototype.render = function(){
    var that = this
    ,options = that.config
    ,lang = that.lang()
    ,isStatic = options.position === 'static'
    
    //主面板
    ,elem = that.elem = lay.elem('div', {
      id: that.elemID
      ,'class': [
        'layui-laydate'
        ,options.range ? ' layui-laydate-range' : ''
        ,isStatic ? ' layui-laydate-static' : ''
        ,options.theme && options.theme !== 'default' && !/^#/.test(options.theme) ? (' laydate-theme-' + options.theme) : ''
      ].join('')
    })
    
    //主区域
    ,elemMain = that.elemMain = []
    ,elemHeader = that.elemHeader = []
    ,elemCont = that.elemCont = []
    ,elemTable = that.table = []

    //底部区域
    ,divFooter = that.footer = lay.elem('div', {
      'class': ELEM_FOOTER
    });
    
    if(options.zIndex) elem.style.zIndex = options.zIndex;
    
    //单双日历区域
    lay.each(new Array(2), function(i){
      if(!options.range && i > 0){
        return true;
      }

      //头部区域
      var divHeader = lay.elem('div', {
        'class': 'layui-laydate-header'
      })
      
      //左右切换
      ,headerChild = [function(){ //上一年
        var elem = lay.elem('i', {
          'class': 'layui-icon laydate-icon laydate-prev-y'
        });
        elem.innerHTML = '&#xe65a;';
        return elem;
      }(), function(){ //上一月
        var elem = lay.elem('i', {
          'class': 'layui-icon laydate-icon laydate-prev-m'
        });
        elem.innerHTML = '&#xe603;';
        return elem;
      }(), function(){ //年月选择
        var elem = lay.elem('div', {
          'class': 'laydate-set-ym'
        }), spanY = lay.elem('span'), spanM = lay.elem('span');
        elem.appendChild(spanY);
        elem.appendChild(spanM);
        return elem;
      }(), function(){ //下一月
        var elem = lay.elem('i', {
          'class': 'layui-icon laydate-icon laydate-next-m'
        });
        elem.innerHTML = '&#xe602;';
        return elem;
      }(), function(){ //下一年
        var elem = lay.elem('i', {
          'class': 'layui-icon laydate-icon laydate-next-y'
        });
        elem.innerHTML = '&#xe65b;';
        return elem;
      }()]
      
      //日历内容区域
      ,divContent = lay.elem('div', {
        'class': 'layui-laydate-content'
      })
      ,table = lay.elem('table')
      ,thead = lay.elem('thead'), theadTr = lay.elem('tr');
      
      //生成年月选择
      lay.each(headerChild, function(i, item){
        divHeader.appendChild(item);
      });
      
       //生成表格
      thead.appendChild(theadTr);
      lay.each(new Array(6), function(i){ //表体
        var tr = table.insertRow(0);
        lay.each(new Array(7), function(j){
          if(i === 0){
            var th = lay.elem('th');
            th.innerHTML = lang.weeks[j];
            theadTr.appendChild(th);
          }
          tr.insertCell(j);
        });
      });
      table.insertBefore(thead, table.children[0]); //表头
      divContent.appendChild(table);
      
      elemMain[i] = lay.elem('div', {
        'class': 'layui-laydate-main laydate-main-list-'+ i
      });
      
      elemMain[i].appendChild(divHeader);
      elemMain[i].appendChild(divContent);
      
      elemHeader.push(headerChild);
      elemCont.push(divContent);
      elemTable.push(table);
    });
    
    //生成底部栏
    lay(divFooter).html(function(){
      var html = [], btns = [];
      if(options.type === 'datetime'){
        html.push('<span lay-type="datetime" class="laydate-btns-time">'+ lang.timeTips +'</span>');
      }
      lay.each(options.btns, function(i, item){
        var title = lang.tools[item] || 'btn';
        if(options.range && item === 'now') return;
        if(isStatic && item === 'clear') title = options.lang === 'cn' ? '重置' : 'Reset';
        btns.push('<span lay-type="'+ item +'" class="laydate-btns-'+ item +'">'+ title +'</span>');
      });
      html.push('<div class="laydate-footer-btns">'+ btns.join('') +'</div>');
      return html.join('');
    }());
    
    //插入到主区域
    lay.each(elemMain, function(i, main){
      elem.appendChild(main);
    });
    options.showBottom && elem.appendChild(divFooter);
    
    //生成自定义主题
    if(/^#/.test(options.theme)){
      var style = lay.elem('style')
      ,styleText = [
        '#{{id}} .layui-laydate-header{background-color:{{theme}};}'
        ,'#{{id}} .layui-this{background-color:{{theme}} !important;}'
      ].join('').replace(/{{id}}/g, that.elemID).replace(/{{theme}}/g, options.theme);
      
      if('styleSheet' in style){
        style.setAttribute('type', 'text/css');
        style.styleSheet.cssText = styleText;
      } else {
        style.innerHTML = styleText;
      }
      
      lay(elem).addClass('laydate-theme-molv');
      elem.appendChild(style);
    }
    
    //移除上一个控件
    that.remove(); 
    
    //如果是静态定位，则插入到指定的容器中，否则，插入到body
    isStatic ? options.elem.append(elem) : (
      document.body.appendChild(elem)
      ,that.position() //定位
    );
    
    that.checkDate().calendar(); //初始校验
    that.changeEvent(); //日期切换
    
    Class.thisElem = that.elemID;
    
    typeof options.ready === 'function' && options.ready(lay.extend({}, options.dateTime, {
      month: options.dateTime.month + 1
    }));
  };
  
  //控件移除
  Class.prototype.remove = function(){
    var that = this
    ,options = that.config
    ,elem = lay('#'+ that.elemID);
    if(elem[0] && options.position !== 'static'){
      that.checkDate(function(){
        elem.remove();
      });
    }
    return that;
  };
  
  //定位算法
  Class.prototype.position = function(){
    var that = this
    ,options = that.config
    ,elem = that.bindElem || options.elem[0]
    ,rect = elem.getBoundingClientRect() //绑定元素的坐标
    ,elemWidth = that.elem.offsetWidth //控件的宽度
    ,elemHeight = that.elem.offsetHeight //控件的高度
    
    //滚动条高度
    ,scrollArea = function(type){
      type = type ? 'scrollLeft' : 'scrollTop';
      return document.body[type] | document.documentElement[type];
    }
    ,winArea = function(type){
      return document.documentElement[type ? 'clientWidth' : 'clientHeight']
    }, margin = 5, left = rect.left, top = rect.bottom;
    
    //如果右侧超出边界
    if(left + elemWidth + margin > winArea('width')){
      left = winArea('width') - elemWidth - margin;
    }
    
    //如果底部超出边界
    if(top + elemHeight + margin > winArea()){
      top = rect.top > elemHeight //顶部是否有足够区域显示完全
        ? rect.top - elemHeight 
      : winArea() - elemHeight;
      top = top - margin*2;
    }
    
    if(options.position){
      that.elem.style.position = options.position;
    }
    that.elem.style.left = left + (options.position === 'fixed' ? 0 : scrollArea(1)) + 'px';
    that.elem.style.top = top + (options.position === 'fixed' ? 0 : scrollArea()) + 'px';
  };
  
  //提示
  Class.prototype.hint = function(content){
    var that = this
    ,options = that.config
    ,div = lay.elem('div', {
      'class': ELEM_HINT
    });
    
    div.innerHTML = content || '';
    lay(that.elem).find('.'+ ELEM_HINT).remove();
    that.elem.appendChild(div);

    clearTimeout(that.hinTimer);
    that.hinTimer = setTimeout(function(){
      lay(that.elem).find('.'+ ELEM_HINT).remove();
    }, 3000);
  };
  
  //获取递增/减后的年月
  Class.prototype.getAsYM = function(Y, M, type){
    type ? M-- : M++;
    if(M < 0){
      M = 11;
      Y--;
    }
    if(M > 11){
      M = 0;
      Y++;
    }
    return [Y, M];
  };
  
  //系统消息
  Class.prototype.systemDate = function(newDate){
    var thisDate = newDate || new Date();
    return {
      year: thisDate.getFullYear() //年
      ,month: thisDate.getMonth() //月
      ,date: thisDate.getDate() //日
      ,hours: newDate ? newDate.getHours() : 0 //时
      ,minutes: newDate ? newDate.getMinutes() : 0 //分
      ,seconds: newDate ? newDate.getSeconds() : 0 //秒
    }
  };
  
  //日期校验
  Class.prototype.checkDate = function(fn){
    var that = this
    ,thisDate = new Date()
    ,options = that.config
    ,dateTime = options.dateTime = options.dateTime || that.systemDate()
    ,thisMaxDate, error
    
    ,elem = that.bindElem || options.elem[0]
    ,valType = that.isInput(elem) ? 'val' : 'html'
    ,value = that.isInput(elem) ? elem.value : (options.position === 'static' ? '' : elem.innerHTML)
    
    //校验日期有效数字
    ,checkValid = function(dateTime){
      if(dateTime.year > LIMIT_YEAR[1]) dateTime.year = LIMIT_YEAR[1], error = true; //不能超过20万年
      if(dateTime.month > 11) dateTime.month = 11, error = true;
      if(dateTime.hours > 23) dateTime.hours = 0, error = true;
      if(dateTime.minutes > 59) dateTime.minutes = 0, dateTime.hours++, error = true;
      if(dateTime.seconds > 59) dateTime.seconds = 0, dateTime.minutes++, error = true;
      
      //计算当前月的最后一天
      thisMaxDate = laydateOne.getEndDate(dateTime.month + 1, dateTime.year);
      if(dateTime.date > thisMaxDate) dateTime.date = thisMaxDate, error = true;
    }
    
    //获得初始化日期值
    ,initDate = function(dateTime, value, index){
      var startEnd = ['startTime', 'endTime'];
      value = value.match(that.EXP_SPLIT);
      index = index || 0;
      if(options.range){
        that[startEnd[index]] = that[startEnd[index]] || {};
      }
      lay.each(that.format, function(i, item){
        var thisv = parseFloat(value[i]);
        if(value[i].length < item.length) error = true;
        if(/yyyy|y/.test(item)){ //年
          if(thisv < LIMIT_YEAR[0]) thisv = LIMIT_YEAR[0], error = true; //年不能低于100年
          dateTime.year = thisv;
        } else if(/MM|M/.test(item)){ //月
          if(thisv < 1) thisv = 1, error = true;
          dateTime.month = thisv - 1;
        } else if(/dd|d/.test(item)){ //日
          if(thisv < 1) thisv = 1, error = true;
          dateTime.date = thisv;
        } else if(/HH|H/.test(item)){ //时
          if(thisv < 1) thisv = 0, error = true;
          dateTime.hours = thisv;
          options.range && (that[startEnd[index]].hours = thisv);
        } else if(/mm|m/.test(item)){ //分
          if(thisv < 1) thisv = 0, error = true;
          dateTime.minutes = thisv;
          options.range && (that[startEnd[index]].minutes = thisv);
        } else if(/ss|s/.test(item)){ //秒
          if(thisv < 1) thisv = 0, error = true;
          dateTime.seconds = thisv;
          options.range && (that[startEnd[index]].seconds = thisv);
        }
      });
      checkValid(dateTime)
    };
    
    if(fn === 'limit') return checkValid(dateTime), that;
    
    value = value || options.value;
    if(typeof value === 'string'){
      value = value.replace(/\s+/g, ' ').replace(/^\s|\s$/g, '');
    }
    
    //如果点击了开始，单未选择结束就关闭，则重新选择开始
    if(that.startState && !that.endState){
      delete that.startState;
      that.endState = true;
    };

    if(typeof value === 'string' && value){
      if(that.EXP_IF.test(value)){ //校验日期格式
        if(options.range){
          value = value.split(' '+ options.range +' ');
          that.startDate = that.startDate || that.systemDate();
          that.endDate = that.endDate || that.systemDate();
          options.dateTime = lay.extend({}, that.startDate);
          lay.each([that.startDate, that.endDate], function(i, item){
            initDate(item, value[i], i);
          });
        } else {
          initDate(dateTime, value)
        }
      } else {
        that.hint('日期格式不合法<br>必须遵循下述格式：<br>'+ (
          options.range ? (options.format + ' '+ options.range +' ' + options.format) : options.format
        ) + '<br>已为你重置');
        error = true;
      }
    } else if(value && value.constructor === Date){ //如果值为日期对象时
      options.dateTime = that.systemDate(value);
    } else {
      options.dateTime = that.systemDate();
      delete that.startState;
      delete that.endState;
      delete that.startDate;
      delete that.endDate;
      delete that.startTime;
      delete that.endTime;
    }

    checkValid(dateTime);

    if(error && value){
      that.setValue(
        options.range ? (that.endDate ? that.parse() : '') : that.parse()
      );
    }
    fn && fn();
    return that;
  };
  
  //公历重要日期与自定义备注
  Class.prototype.mark = function(td, YMD){
    var that = this
    ,mark, options = that.config;
    lay.each(options.mark, function(key, title){
      var keys = key.split('-');
      if((keys[0] == YMD[0] || keys[0] == 0) //每年的每月
      && (keys[1] == YMD[1] || keys[1] == 0) //每月的每日
      && keys[2] == YMD[2]){ //特定日
        mark = title || YMD[2];
      }
    });
    mark && td.html('<span class="laydate-day-mark">'+ mark +'</span>');
    
    return that;
  };
  
  //无效日期范围的标记
  Class.prototype.limit = function(elem, date, index, time){
    var that = this
    ,options = that.config, timestrap = {}
    ,dateTime = options[index > 41 ? 'endDate' : 'dateTime']
    ,isOut, thisDateTime = lay.extend({}, dateTime, date || {});
    lay.each({
      now: thisDateTime
      ,min: options.min
      ,max: options.max
    }, function(key, item){
      timestrap[key] = that.newDate(lay.extend({
        year: item.year
        ,month: item.month
        ,date: item.date
      }, function(){
        var hms = {};
        lay.each(time, function(i, keys){
          hms[keys] = item[keys];
        });
        return hms;
      }())).getTime();  //time：是否比较时分秒
    });
    
    isOut = timestrap.now < timestrap.min || timestrap.now > timestrap.max;
    elem && elem[isOut ? 'addClass' : 'removeClass'](DISABLED);
    return isOut;
  };
  
  //日历表
  Class.prototype.calendar = function(value){
    var that = this
    ,options = that.config
    ,dateTime = value || options.dateTime
    ,thisDate = new Date(), startWeek, prevMaxDate, thisMaxDate
    ,lang = that.lang()
    
    ,isAlone = options.type !== 'date' && options.type !== 'datetime'
    ,index = value ? 1 : 0
    ,tds = lay(that.table[index]).find('td')
    ,elemYM = lay(that.elemHeader[index][2]).find('span');
    
    if(dateTime.year < LIMIT_YEAR[0]) dateTime.year = LIMIT_YEAR[0], that.hint('最低只能支持到公元'+ LIMIT_YEAR[0] +'年');
    if(dateTime.year > LIMIT_YEAR[1]) dateTime.year = LIMIT_YEAR[1], that.hint('最高只能支持到公元'+ LIMIT_YEAR[1] +'年');
    
    //记录初始值
    if(!that.firstDate){
      that.firstDate = lay.extend({}, dateTime);
    }
    
    //计算当前月第一天的星期
    thisDate.setFullYear(dateTime.year, dateTime.month, 1);
    startWeek = thisDate.getDay();

    prevMaxDate = laydateOne.getEndDate(dateTime.month, dateTime.year); //计算上个月的最后一天
    thisMaxDate = laydateOne.getEndDate(dateTime.month + 1, dateTime.year); //计算当前月的最后一天
    
    //赋值日
    lay.each(tds, function(index, item){
      var YMD = [dateTime.year, dateTime.month], st = 0;
      item = lay(item);
      item.removeAttr('class');
      if(index < startWeek){
        st = prevMaxDate - startWeek + index;
        item.addClass('laydate-day-prev');
        YMD = that.getAsYM(dateTime.year, dateTime.month, 'sub');
      } else if(index >= startWeek && index < thisMaxDate + startWeek){
        st = index - startWeek;
        if(!options.range){
          st + 1 === dateTime.date && item.addClass(THIS);
        }
      } else {
        st = index - thisMaxDate - startWeek;
        item.addClass('laydate-day-next');
        YMD = that.getAsYM(dateTime.year, dateTime.month);
      }
      YMD[1]++;
      YMD[2] = st + 1;
      item.attr('lay-ymd', YMD.join('-')).html(YMD[2]);
      that.mark(item, YMD).limit(item, {
        year: YMD[0]
        ,month: YMD[1] - 1
        ,date: YMD[2]
      }, index);
    });  
    
    //同步头部年月
    lay(elemYM[0]).attr('lay-ym', dateTime.year + '-' + (dateTime.month + 1));
    lay(elemYM[1]).attr('lay-ym', dateTime.year + '-' + (dateTime.month + 1));
    
    if(options.lang === 'cn'){
      lay(elemYM[0]).attr('lay-type', 'year').html(dateTime.year + '年')
      lay(elemYM[1]).attr('lay-type', 'month').html((dateTime.month + 1) + '月');
    } else {
      lay(elemYM[0]).attr('lay-type', 'month').html(lang.month[dateTime.month]);
      lay(elemYM[1]).attr('lay-type', 'year').html(dateTime.year);
    }

    //初始默认选择器
    if(isAlone){
      if(options.range){
        value ? that.endDate = (that.endDate || {
          year: dateTime.year + (options.type === 'year' ? 1 : 0)
          ,month: dateTime.month + (options.type === 'month' ? 0 : -1)
        }) : (that.startDate = that.startDate || {
          year: dateTime.year
          ,month: dateTime.month
        });
        if(value){
          that.listYM = [
            [that.startDate.year, that.startDate.month + 1]
            ,[that.endDate.year, that.endDate.month + 1]
          ];  
          that.list(options.type, 0).list(options.type, 1);
          //同步按钮可点状态
          options.type === 'time' ? that.setBtnStatus('时间'
            ,lay.extend({}, that.systemDate(), that.startTime)
            ,lay.extend({}, that.systemDate(), that.endTime)
          ) : that.setBtnStatus(true);
        }        
      }
      if(!options.range){
        that.listYM = [[dateTime.year, dateTime.month + 1]];
        that.list(options.type, 0);
      }
    }
    
    //赋值双日历
    if(options.range && !value){
      var EYM = that.getAsYM(dateTime.year, dateTime.month)
      that.calendar(lay.extend({}, dateTime, {
        year: EYM[0]
        ,month: EYM[1]
      }));
    }
    
    //通过检测当前有效日期，来设定确定按钮是否可点
    if(!options.range) that.limit(lay(that.footer).find(ELEM_CONFIRM), null, 0, ['hours', 'minutes', 'seconds']);
    
    //标记选择范围
    if(options.range && value && !isAlone) that.stampRange();
    return that;
  };

  //生成年月时分秒列表
  Class.prototype.list = function(type, index){
    var that = this
    ,options = that.config
    ,dateTime = options.dateTime
    ,lang = that.lang()
    ,isAlone = options.range && options.type !== 'date' && options.type !== 'datetime' //独立范围选择器
    
    ,ul = lay.elem('ul', {
      'class': ELEM_LIST + ' ' + ({
        year: 'laydate-year-list'
        ,month: 'laydate-month-list'
        ,time: 'laydate-time-list'
      })[type]
    })
    ,elemHeader = that.elemHeader[index]
    ,elemYM = lay(elemHeader[2]).find('span')
    ,elemCont = that.elemCont[index || 0]
    ,haveList = lay(elemCont).find('.'+ ELEM_LIST)[0]
    ,isCN = options.lang === 'cn'
    ,text = isCN ? '年' : ''
   
    ,listYM = that.listYM[index] || {}
    ,hms = ['hours', 'minutes', 'seconds']
    ,startEnd = ['startTime', 'endTime'][index];

    if(listYM[0] < 1) listYM[0] = 1;
    
    if(type === 'year'){ //年列表
      var yearNum, startY = yearNum = listYM[0] - 7;
      if(startY < 1) startY = yearNum = 1;
      lay.each(new Array(15), function(i){
        var li = lay.elem('li', {
          'lay-ym': yearNum
        }), ymd = {year: yearNum};
        yearNum == listYM[0] && lay(li).addClass(THIS);
        li.innerHTML = yearNum + text;
        ul.appendChild(li);
        if(yearNum < that.firstDate.year){
          ymd.month = options.min.month;
          ymd.date = options.min.date;
        } else if(yearNum >= that.firstDate.year){
          ymd.month = options.max.month;
          ymd.date = options.max.date;
        }
        that.limit(lay(li), ymd, index);
        yearNum++;
      });
      lay(elemYM[isCN ? 0 : 1]).attr('lay-ym', (yearNum - 8) + '-' + listYM[1])
      .html((startY + text) + ' - ' + (yearNum - 1 + text));
    } else if(type === 'month'){ //月列表
      lay.each(new Array(12), function(i){
        var li = lay.elem('li', {
          'lay-ym': i
        }), ymd = {year: listYM[0], month: i};
        i + 1 == listYM[1] && lay(li).addClass(THIS);
        li.innerHTML = lang.month[i] + (isCN ? '月' : '');
        ul.appendChild(li);
        if(listYM[0] < that.firstDate.year){
          ymd.date = options.min.date;
        } else if(listYM[0] >= that.firstDate.year){
          ymd.date = options.max.date;
        }
        that.limit(lay(li), ymd, index);
      });
      lay(elemYM[isCN ? 0 : 1]).attr('lay-ym', listYM[0] + '-' + listYM[1])
      .html(listYM[0] + text);
    } else if(type === 'time'){ //时间列表
      //检测时分秒状态是否在有效日期时间范围内
      var setTimeStatus = function(){
        lay(ul).find('ol').each(function(i, ol){
          lay(ol).find('li').each(function(ii, li){
            that.limit(lay(li), [{
              hours: ii
            }, {
              hours: that[startEnd].hours
              ,minutes: ii
            }, {
              hours: that[startEnd].hours
              ,minutes: that[startEnd].minutes
              ,seconds: ii
            }][i], index, [['hours'], ['hours', 'minutes'], ['hours', 'minutes', 'seconds']][i]);
          });
        });
        if(!options.range) that.limit(lay(that.footer).find(ELEM_CONFIRM), that[startEnd], 0, ['hours', 'minutes', 'seconds']);
      };
      if(options.range){
        if(!that[startEnd]) that[startEnd] = {
          hours: 0
          ,minutes: 0
          ,seconds: 0
        };
      } else {
        that[startEnd] = dateTime;
      }
      lay.each([24, 60, 60], function(i, item){
        var li = lay.elem('li'), childUL = ['<p>'+ lang.time[i] +'</p><ol>'];
        lay.each(new Array(item), function(ii){
          childUL.push('<li'+ (that[startEnd][hms[i]] === ii ? ' class="'+ THIS +'"' : '') +'>'+ lay.digit(ii, 2) +'</li>');
        });
        li.innerHTML = childUL.join('') + '</ol>';
        ul.appendChild(li);
      });
      setTimeStatus();
    }
    
    //插入容器
    if(haveList) elemCont.removeChild(haveList);
    elemCont.appendChild(ul);
    
    //年月
    if(type === 'year' || type === 'month'){      
      //显示切换箭头
      lay(that.elemMain[index]).addClass('laydate-ym-show');
      
      //选中
      lay(ul).find('li').on('click', function(){
        var ym = lay(this).attr('lay-ym') | 0;
        if(lay(this).hasClass(DISABLED)) return;
        
        if(index === 0){
          dateTime[type] = ym;
          if(isAlone) that.startDate[type] = ym;
          that.limit(lay(that.footer).find(ELEM_CONFIRM), null, 0);
        } else { //范围选择
          if(isAlone){ //非date/datetime类型
            that.endDate[type] = ym;
          } else { //date/datetime类型
            var YM = type === 'year' 
              ? that.getAsYM(ym, listYM[1] - 1, 'sub') 
            : that.getAsYM(listYM[0], ym, 'sub');
            lay.extend(dateTime, {
              year: YM[0]
              ,month: YM[1]
            });
          }
        }
        
        if(options.type === 'year' || options.type === 'month'){
          lay(ul).find('.'+ THIS).removeClass(THIS);
          lay(this).addClass(THIS);
          
          //如果为年月选择器，点击了年列表，则切换到月选择器
          if(options.type === 'month' && type === 'year'){
            that.listYM[index][0] = ym;
            isAlone && (that[['startDate', 'endDate'][index]].year = ym);
            that.list('month', index);
          }
        } else {
          that.checkDate('limit').calendar();
          that.closeList();
        }

        that.setBtnStatus(); //同步按钮可点状态
        options.range || that.done(null, 'change');
        lay(that.footer).find(ELEM_TIME_BTN).removeClass(DISABLED);
      });
    } else {
      var span = lay.elem('span', {
        'class': ELEM_TIME_TEXT
      }), scroll = function(){ //滚动条定位
        lay(ul).find('ol').each(function(i){
          var ol = this
          ,li = lay(ol).find('li')
          ol.scrollTop = 30*(that[startEnd][hms[i]] - 2);
          if(ol.scrollTop <= 0){
            li.each(function(ii, item){
              if(!lay(this).hasClass(DISABLED)){
                ol.scrollTop = 30*(ii - 2);
                return true;
              }
            });
          }
        });
      }, haveSpan = lay(elemHeader[2]).find('.'+ ELEM_TIME_TEXT);
      scroll()
      span.innerHTML = options.range ? [lang.startTime,lang.endTime][index] : lang.timeTips
      lay(that.elemMain[index]).addClass('laydate-time-show');
      if(haveSpan[0]) haveSpan.remove();
      elemHeader[2].appendChild(span);

      lay(ul).find('ol').each(function(i){
        var ol = this;
        //选择时分秒
        lay(ol).find('li').on('click', function(){
          var value = this.innerHTML | 0;
          if(lay(this).hasClass(DISABLED)) return;
          if(options.range){
            that[startEnd][hms[i]]  = value;
          } else {
            dateTime[hms[i]] = value;
          }
          lay(ol).find('.'+ THIS).removeClass(THIS);
          lay(this).addClass(THIS);
          
          //同步按钮可点状态
          that.setBtnStatus(
            null
            ,lay.extend({}, that.systemDate(), that.startTime)
            ,lay.extend({}, that.systemDate(), that.endTime)
          );
          setTimeStatus();
          scroll();
          (that.endDate || options.type === 'time') && that.done(null, 'change');
        });
      });
    }
    
    return that;
  };
  
  //记录列表切换后的年月
  Class.prototype.listYM = [];
  
  //关闭列表
  Class.prototype.closeList = function(){
    var that = this
    ,options = that.config;
    
    lay.each(that.elemCont, function(index, item){
      lay(this).find('.'+ ELEM_LIST).remove();
      lay(that.elemMain[index]).removeClass('laydate-ym-show laydate-time-show');
    });
    lay(that.elem).find('.'+ ELEM_TIME_TEXT).remove();
  };
  
  //检测结束日期是否超出开始日期
  Class.prototype.setBtnStatus = function(tips, start, end){
    var that = this
    ,options = that.config
    ,isOut, elemBtn = lay(that.footer).find(ELEM_CONFIRM)
    ,isAlone = options.range && options.type !== 'date' && options.type !== 'datetime';
    if(isAlone){
      start = start || that.startDate;
      end = end || that.endDate;
      isOut = that.newDate(start).getTime() > that.newDate(end).getTime();
      
      //如果不在有效日期内，直接禁用按钮，否则比较开始和结束日期
      (that.limit(null, start) || that.limit(null, end)) 
        ? elemBtn.addClass(DISABLED)
      : elemBtn[isOut ? 'addClass' : 'removeClass'](DISABLED);
      
      //是否异常提示
      if(tips && isOut) that.hint(
        typeof tips === 'string' ? TIPS_OUT.replace(/日期/g, tips) : TIPS_OUT
      );
    }
  };
  
  //转义为规定格式的日期字符
  Class.prototype.parse = function(state, date){
    var that = this
    ,options = that.config
    ,dateTime = date || (state 
      ? lay.extend({}, that.endDate, that.endTime)
    : (options.range ? lay.extend({}, that.startDate, that.startTime) : options.dateTime))
    ,format = that.format.concat();

    //转义为规定格式
    lay.each(format, function(i, item){
      if(/yyyy|y/.test(item)){ //年
        format[i] = lay.digit(dateTime.year, item.length);
      } else if(/MM|M/.test(item)){ //月
        format[i] = lay.digit(dateTime.month + 1, item.length);
      } else if(/dd|d/.test(item)){ //日
        format[i] = lay.digit(dateTime.date, item.length);
      } else if(/HH|H/.test(item)){ //时
        format[i] = lay.digit(dateTime.hours, item.length);
      } else if(/mm|m/.test(item)){ //分
        format[i] = lay.digit(dateTime.minutes, item.length);
      } else if(/ss|s/.test(item)){ //秒
        format[i] = lay.digit(dateTime.seconds, item.length);
      }
    });
    
    //返回日期范围字符
    if(options.range && !state){
      return format.join('') + ' '+ options.range +' ' + that.parse(1);
    }
    
    return format.join('');
  };
  
  //创建指定日期时间对象
  Class.prototype.newDate = function(dateTime){
    return new Date(
      dateTime.year || 1
      ,dateTime.month || 0
      ,dateTime.date || 1
      ,dateTime.hours || 0
      ,dateTime.minutes || 0
      ,dateTime.seconds || 0
    );
  };
  
  //赋值
  Class.prototype.setValue = function(value){
    var that = this
    ,options = that.config
    ,elem = that.bindElem || options.elem[0]
    ,valType = that.isInput(elem) ? 'val' : 'html'
    
    options.position === 'static' || lay(elem)[valType](value || '');
    return this;
  };
  
  //标记范围内的日期
  Class.prototype.stampRange = function(){
    var that = this
    ,options = that.config
    ,startTime, endTime
    ,tds = lay(that.elem).find('td');
    
    if(options.range && !that.endDate) lay(that.footer).find(ELEM_CONFIRM).addClass(DISABLED);
    if(!that.endDate) return;

    startTime = that.newDate({
      year: that.startDate.year
      ,month: that.startDate.month
      ,date: that.startDate.date
    }).getTime();
    
    endTime = that.newDate({
      year: that.endDate.year
      ,month: that.endDate.month
      ,date: that.endDate.date
    }).getTime();
    
    if(startTime > endTime) return that.hint(TIPS_OUT);
    
    lay.each(tds, function(i, item){
      var ymd = lay(item).attr('lay-ymd').split('-')
      ,thisTime = that.newDate({
        year: ymd[0]
        ,month: ymd[1] - 1
        ,date: ymd[2]
      }).getTime();
      lay(item).removeClass(ELEM_SELECTED + ' ' + THIS);
      if(thisTime === startTime || thisTime === endTime){
        lay(item).addClass(
          lay(item).hasClass(ELEM_PREV) || lay(item).hasClass(ELEM_NEXT)
            ? ELEM_SELECTED
          : THIS
        );
      }
      if(thisTime > startTime && thisTime < endTime){
        lay(item).addClass(ELEM_SELECTED);
      }
    });
  };
  
  //执行done/change回调
  Class.prototype.done = function(param, type){
    var that = this
    ,options = that.config
    ,start = lay.extend({}, that.startDate ? lay.extend(that.startDate, that.startTime) : options.dateTime)
    ,end = lay.extend({}, lay.extend(that.endDate, that.endTime))
    
    lay.each([start, end], function(i, item){
      if(!('month' in item)) return;
      lay.extend(item, {
        month: item.month + 1
      });
    });
    
    param = param || [that.parse(), start, end];
    typeof options[type || 'done'] === 'function' && options[type || 'done'].apply(options, param);
    
    return that;
  };
  
  //选择日期
  Class.prototype.choose = function(td){
    var that = this
    ,options = that.config
    ,dateTime = options.dateTime

    ,tds = lay(that.elem).find('td')
    ,YMD = td.attr('lay-ymd').split('-')
    
    ,setDateTime = function(one){
      var thisDate = new Date();
      
      //同步dateTime
      one && lay.extend(dateTime, YMD);
      
      //记录开始日期
      if(options.range){
        that.startDate ? lay.extend(that.startDate, YMD) : (
          that.startDate = lay.extend({}, YMD, that.startTime)
        );
        that.startYMD = YMD;
      }
    };
    
    YMD = {
      year: YMD[0] | 0
      ,month: (YMD[1] | 0) - 1
      ,date: YMD[2] | 0
    };
    
    if(td.hasClass(DISABLED)) return;

    //范围选择
    if(options.range){
      
      lay.each(['startTime', 'endTime'], function(i, item){
        that[item] = that[item] || {
          hours: 0
          ,minutes: 0
          ,seconds: 0
        };
      });
      
      if(that.endState){ //重新选择
        setDateTime();
        delete that.endState;
        delete that.endDate;
        that.startState = true;
        tds.removeClass(THIS + ' ' + ELEM_SELECTED);
        td.addClass(THIS);
      } else if(that.startState){ //选中截止
        td.addClass(THIS);
        
        that.endDate ? lay.extend(that.endDate, YMD) : (
          that.endDate = lay.extend({}, YMD, that.endTime)
        );
        
        //判断是否顺时或逆时选择
        if(that.newDate(YMD).getTime() < that.newDate(that.startYMD).getTime()){
          var startDate = lay.extend({}, that.endDate, {
            hours: that.startDate.hours
            ,minutes: that.startDate.minutes
            ,seconds: that.startDate.seconds
          });
          lay.extend(that.endDate, that.startDate, {
            hours: that.endDate.hours
            ,minutes: that.endDate.minutes
            ,seconds: that.endDate.seconds
          });
          that.startDate = startDate;
        }
        
        options.showBottom || that.done();
        that.stampRange(); //标记范围内的日期
        that.endState = true;
        that.done(null, 'change');
      } else { //选中开始
        td.addClass(THIS);
        setDateTime(); 
        that.startState = true;
      }
      lay(that.footer).find(ELEM_CONFIRM)[that.endDate ? 'removeClass' : 'addClass'](DISABLED);
    } else if(options.position === 'static'){ //直接嵌套的选中
      setDateTime(true);
      that.calendar().done().done(null, 'change');
    } else if(options.type === 'date'){
      setDateTime(true);
      that.setValue(that.parse()).remove().done();
    } else if(options.type === 'datetime'){
      setDateTime(true);
      that.calendar().done(null, 'change');
    }
  };
  
  //底部按钮
  Class.prototype.tool = function(btn, type){
    var that = this
    ,options = that.config
    ,dateTime = options.dateTime
    ,isStatic = options.position === 'static'
    ,active = {
      //选择时间
      datetime: function(){
        if(lay(btn).hasClass(DISABLED)) return;
        that.list('time', 0);
        options.range && that.list('time', 1);
        lay(btn).attr('lay-type', 'date').html(that.lang().dateTips);
      }
      
      //选择日期
      ,date: function(){
        that.closeList();
        lay(btn).attr('lay-type', 'datetime').html(that.lang().timeTips);
      }
      
      //清空、重置
      ,clear: function(){
        that.setValue('').remove();
        isStatic && (
          lay.extend(dateTime, that.firstDate)
          ,that.calendar()
        )
        options.range && (
          delete that.startState
          ,delete that.endState
          ,delete that.endDate
          ,delete that.startTime
          ,delete that.endTime
        );
        that.done(['', {}, {}]);
      }
      
      //现在
      ,now: function(){
        var thisDate = new Date();
        lay.extend(dateTime, that.systemDate(), {
          hours: thisDate.getHours()
          ,minutes: thisDate.getMinutes()
          ,seconds: thisDate.getSeconds()
        });
        that.setValue(that.parse()).remove();
        isStatic && that.calendar();
        that.done();
      }
      
      //确定
      ,confirm: function(){
        if(options.range){
          if(!that.endDate) return that.hint('请先选择日期范围');
          if(lay(btn).hasClass(DISABLED)) return that.hint(
            options.type === 'time' ? TIPS_OUT.replace(/日期/g, '时间') : TIPS_OUT
          );
        } else {
          if(lay(btn).hasClass(DISABLED)) return that.hint('不在有效日期或时间范围内');
        }
        that.done();
        that.setValue(that.parse()).remove()
      }
    };
    active[type] && active[type]();
  };
  
  //统一切换处理
  Class.prototype.change = function(index){
    var that = this
    ,options = that.config
    ,dateTime = options.dateTime
    ,isAlone = options.range && (options.type === 'year' || options.type === 'month')
    
    ,elemCont = that.elemCont[index || 0]
    ,listYM = that.listYM[index]
    ,addSubYeay = function(type){
      var startEnd = ['startDate', 'endDate'][index]
      ,isYear = lay(elemCont).find('.laydate-year-list')[0]
      ,isMonth = lay(elemCont).find('.laydate-month-list')[0];
      
      //切换年列表
      if(isYear){
        listYM[0] = type ? listYM[0] - 15 : listYM[0] + 15;
        that.list('year', index);
      }
      
      if(isMonth){ //切换月面板中的年
        type ? listYM[0]-- : listYM[0]++;
        that.list('month', index);
      }
      
      if(isYear || isMonth){
        lay.extend(dateTime, {
          year: listYM[0]
        });
        if(isAlone) that[startEnd].year = listYM[0];
        options.range || that.done(null, 'change');
        that.setBtnStatus();      
        options.range || that.limit(lay(that.footer).find(ELEM_CONFIRM), {
          year: listYM[0]
        });
      }
      return isYear || isMonth;
    };
    
    return {
      prevYear: function(){
        if(addSubYeay('sub')) return;
        dateTime.year--;
        that.checkDate('limit').calendar();
        options.range || that.done(null, 'change');
      }
      ,prevMonth: function(){
        var YM = that.getAsYM(dateTime.year, dateTime.month, 'sub');
        lay.extend(dateTime, {
          year: YM[0]
          ,month: YM[1]
        });
        that.checkDate('limit').calendar();
        options.range || that.done(null, 'change');
      }
      ,nextMonth: function(){
        var YM = that.getAsYM(dateTime.year, dateTime.month);
        lay.extend(dateTime, {
          year: YM[0]
          ,month: YM[1]
        });
        that.checkDate('limit').calendar();
        options.range || that.done(null, 'change');
      }
      ,nextYear: function(){
        if(addSubYeay()) return;
        dateTime.year++
        that.checkDate('limit').calendar();
        options.range || that.done(null, 'change');
      }
    };
  };
  
  //日期切换事件
  Class.prototype.changeEvent = function(){
    var that = this
    ,options = that.config;

    //日期选择事件
    lay(that.elem).on('click', function(e){
      lay.stope(e);
    });
    
    //年月切换
    lay.each(that.elemHeader, function(i, header){
      //上一年
      lay(header[0]).on('click', function(e){
        that.change(i).prevYear();
      });
      
      //上一月
      lay(header[1]).on('click', function(e){
        that.change(i).prevMonth();
      });
      
      //选择年月
      lay(header[2]).find('span').on('click', function(e){
        var othis = lay(this)
        ,layYM = othis.attr('lay-ym')
        ,layType = othis.attr('lay-type');
        
        if(!layYM) return;
        
        layYM = layYM.split('-');

        that.listYM[i] = [layYM[0] | 0, layYM[1] | 0];
        that.list(layType, i);
        lay(that.footer).find(ELEM_TIME_BTN).addClass(DISABLED);
      });

      //下一月
      lay(header[3]).on('click', function(e){
        that.change(i).nextMonth();
      });
      
      //下一年
      lay(header[4]).on('click', function(e){
        that.change(i).nextYear();
      });
    });
    
    //点击日期
    lay.each(that.table, function(i, table){
      var tds = lay(table).find('td');
      tds.on('click', function(){
        that.choose(lay(this));
      });
    });
    
    //点击底部按钮
    lay(that.footer).find('span').on('click', function(){
      var type = lay(this).attr('lay-type');
      that.tool(this, type);
    });
  };
  
  //是否输入框
  Class.prototype.isInput = function(elem){
    return /input|textarea/.test(elem.tagName.toLocaleLowerCase());
  };

  //绑定的元素事件处理
  Class.prototype.events = function(){
    var that = this
    ,options = that.config

    //绑定呼出控件事件
    ,showEvent = function(elem, bind){
      elem.on(options.trigger, function(){
        bind && (that.bindElem = this);
        that.render();
      });
    };
    
    if(!options.elem[0] || options.elem[0].eventHandler) return;
    
    showEvent(options.elem, 'bind');
    showEvent(options.eventElem);
    
    //绑定关闭控件事件
    lay(document).on('click', function(e){
      if(e.target === options.elem[0] 
      || e.target === options.eventElem[0]
      || e.target === lay(options.closeStop)[0]){
        return;
      }
      that.remove();
    }).on('keydown', function(e){
      if(e.keyCode === 13){
        if(lay('#'+ that.elemID)[0] && that.elemID === Class.thisElem){
          e.preventDefault();
          lay(that.footer).find(ELEM_CONFIRM)[0].click();
        }
      }
    });
    
    //自适应定位
    lay(window).on('resize', function(){
      if(!that.elem || !lay(ELEM)[0]){
        return false;
      }
      that.position();
    });
    
    options.elem[0].eventHandler = true;
  };

  
  //核心接口
  laydateOne.render = function(options){
    var inst = new Class(options);
    return thisDate.call(inst);
  };
  
  //得到某月的最后一天
  laydateOne.getEndDate = function(month, year){
    var thisDate = new Date();
    //设置日期为下个月的第一天
    thisDate.setFullYear(
      year || thisDate.getFullYear()
      ,month || (thisDate.getMonth() + 1)
    ,1);
    //减去一天，得到当前月最后一天
    return new Date(thisDate.getTime() - 1000*60*60*24).getDate();
  };
  
  //暴露lay
  window.lay = window.lay || lay;
  
  //加载方式
  isLayui ? (
    laydateOne.ready()
    ,layui.define(function(exports){ //layui加载
      laydateOne.path = layui.cache.dir;
      exports(MOD_NAME, laydateOne);
    })
  ) : (
    (typeof define === 'function' && define.amd) ? define(function(){ //requirejs加载
      return laydateOne;
    }) : function(){ //普通script标签加载
      laydateOne.ready();
      window.laydateOne = laydateOne
    }()
  );

}();
            }() +'</div>'
          +'</div>'
        +'</div>'
        
        + DatesOne.viewtb
        
        +'<div class="laydate_bottom">'
          +'<ul id="laydate_hms" style="display:none;">'
            +'<li class="laydate_sj">时间</li>'
            +'<li><input readonly>:</li>'
            +'<li><input readonly>:</li>'
            +'<li><input readonly></li>'
          +'</ul>'
          +'<div class="laydate_time" id="laydate_time"></div>'
          +'<div class="laydate_btn">'
            +'<a id="laydate_clear" style="display:none">清空</a>'
            +'<a id="laydate_today" style="display:none">今天</a>'
            +'<a id="laydate_ok" style="display:none">确认</a>'
          +'</div>'
          +(config.isv ? '<a href="http://sentsin.com/layui/laydate/" class="laydate_v" target="_blank">laydate-v'+ laydateOne.v +'</a>' : '')
        +'</div>';
        doc.body.appendChild(div); 
        DatesOne.box = S('#'+as[0]);        
        DatesOne.events();
        div = null;
    } else {
        DatesOne.shde(DatesOne.box);
    }
    DatesOne.follow(DatesOne.box);
    options.zIndex ? DatesOne.box.style.zIndex = options.zIndex : DatesOne.removeCssAttr(DatesOne.box, 'z-index');
    DatesOne.stopMosup('click', DatesOne.box);
    
    DatesOne.initDate();
    DatesOne.iswrite();
    DatesOne.check();
};

//隐藏内部弹出元素
DatesOne.reshow = function(){
    DatesOne.each(DatesOne.query('#'+ as[0] +' .laydate_show'), function(i, elem){
        DatesOne.removeClass(elem, 'laydate_show');
    });
    return this;
};

//关闭控件
DatesOne.close = function(){
    DatesOne.reshow();
    DatesOne.shde(DatesOne.query('#'+ as[0]), 1);
    DatesOne.elem = null;
};

//转换日期格式
DatesOne.parse = function(ymd, hms, format){
    ymd = ymd.concat(hms);
    format = format || (DatesOne.options ? DatesOne.options.format : config.format);
    return format.replace(/YYYY|MM|DD|hh|mm|ss/g, function(str, index){
        ymd.index = ++ymd.index|0;
        return DatesOne.digit(ymd[ymd.index]);
    });     
};

//返回最终日期
DatesOne.creation = function(ymd, hide){
    var S = DatesOne.query, hms = DatesOne.hmsin;
    var getDates = DatesOne.parse(ymd, [hms[0].value, hms[1].value, hms[2].value]);
    DatesOne.elem[as.elemv] = getDates;
    if(!hide){
        DatesOne.close();
        typeof DatesOne.options.choose === 'function' && DatesOne.options.choose(getDates); 
    }
};

//事件
DatesOne.events = function(){
    var S = DatesOne.query, log = {
        box: '#'+as[0]
    };
    
    DatesOne.addClass(doc.body, 'laydate_body');
    
    as.tds = S('#laydate_table td');
    as.mms = S('#laydate_ms span');
    as.year = S('#laydate_y');
    as.month = S('#laydate_m');

    //显示更多年月
    DatesOne.each(S(log.box + ' .laydate_ym'), function(i, elem){
        DatesOne.on(elem, 'click', function(ev){
            DatesOne.stopmp(ev).reshow();
            DatesOne.addClass(this[tags]('div')[0], 'laydate_show');
            if(!i){
                log.YY = parseInt(as.year.value);
                DatesOne.viewYears(log.YY);
            }
        });
    });
    
    DatesOne.on(S(log.box), 'click', function(){
        DatesOne.reshow();
    });
    
    //切换年
    log.tabYear = function(type){  
        if(type === 0){
            DatesOne.ymd[0]--;
        } else if(type === 1) {
            DatesOne.ymd[0]++;
        } else if(type === 2) {
            log.YY -= 14;
        } else {
            log.YY += 14;
        }
        if(type < 2){
            DatesOne.viewDate(DatesOne.ymd[0], DatesOne.ymd[1], DatesOne.ymd[2]);
            DatesOne.reshow();
        } else {
            DatesOne.viewYears(log.YY);
        }
    };
    DatesOne.each(S('#laydate_YY .laydate_tab'), function(i, elem){
        DatesOne.on(elem, 'click', function(ev){
            DatesOne.stopmp(ev);
            log.tabYear(i);
        });
    });
    
    
    //切换月
    log.tabMonth = function(type){
        if(type){
            DatesOne.ymd[1]++;
            if(DatesOne.ymd[1] === 12){
                DatesOne.ymd[0]++;
                DatesOne.ymd[1] = 0;
            }            
        } else {
            DatesOne.ymd[1]--;
            if(DatesOne.ymd[1] === -1){
                DatesOne.ymd[0]--;
                DatesOne.ymd[1] = 11;
            }
        }
        DatesOne.viewDate(DatesOne.ymd[0], DatesOne.ymd[1], DatesOne.ymd[2]);
    };
    DatesOne.each(S('#laydate_MM .laydate_tab'), function(i, elem){
        DatesOne.on(elem, 'click', function(ev){
            DatesOne.stopmp(ev).reshow();
            log.tabMonth(i);
        });
    });
    
    //选择月
    DatesOne.each(S('#laydate_ms span'), function(i, elem){
        DatesOne.on(elem, 'click', function(ev){
            DatesOne.stopmp(ev).reshow();
            if(!DatesOne.hasClass(this, as[1])){
                DatesOne.viewDate(DatesOne.ymd[0], this.getAttribute('m')|0, DatesOne.ymd[2]);
            }
        });
    });
    
    //选择日
    DatesOne.each(S('#laydate_table td'), function(i, elem){
    	/*加入了判断只能选择周日*/
        DatesOne.on(elem, 'click', function(ev){
        	if(!DatesOne.hasClass(this, as[1]) && i%7 == 0){
                if(!DatesOne.hasClass(this, as[2])){
                     DatesOne.stopmp(ev);
                    DatesOne.creation([this.getAttribute('y')|0, this.getAttribute('m')|0, this.getAttribute('d')|0]);
                }
            }
        });
    });
    
    //清空
    /*as.oclear = S('#laydate_clear');
    DatesOne.on(as.oclear, 'click', function(){
        DatesOne.elem[as.elemv] = '';
        DatesOne.close();
    });*/
    
    //今天
    /*as.otoday = S('#laydate_today');
    DatesOne.on(as.otoday, 'click', function(){
        var now = new Date();
        DatesOne.creation([now.getFullYear(), now.getMonth() + 1, now.getDate()]);
    });*/
    
    //确认
    /*as.ok = S('#laydate_ok');
    DatesOne.on(as.ok, 'click', function(){
        if(DatesOne.valid){
            DatesOne.creation([DatesOne.ymd[0], DatesOne.ymd[1]+1, DatesOne.ymd[2]]);
        }
    });*/
    
    //选择时分秒
    log.times = S('#laydate_time');
    DatesOne.hmsin = log.hmsin = S('#laydate_hms input');
    log.hmss = ['小时', '分钟', '秒数'];
    log.hmsarr = [];
    
    //生成时分秒或警告信息
    DatesOne.msg = function(i, title){
        var str = '<div class="laydte_hsmtex">'+ (title || '提示') +'<span>×</span></div>';
        if(typeof i === 'string'){
            str += '<p>'+ i +'</p>';
            DatesOne.shde(S('#'+as[0]));
            DatesOne.removeClass(log.times, 'laydate_time1').addClass(log.times, 'laydate_msg');
        } else {
            if(!log.hmsarr[i]){
                str += '<div id="laydate_hmsno" class="laydate_hmsno">';
                DatesOne.each(new Array(i === 0 ? 24 : 60), function(i){
                    str += '<span>'+ i +'</span>';
                });
                str += '</div>'
                log.hmsarr[i] = str;
            } else {
                str = log.hmsarr[i];
            }
            DatesOne.removeClass(log.times, 'laydate_msg');
            Dates[i=== 0 ? 'removeClass' : 'addClass'](log.times, 'laydate_time1');
        }
        DatesOne.addClass(log.times, 'laydate_show');
        log.times.innerHTML = str;
    };
    
    log.hmson = function(input, index){
        var span = S('#laydate_hmsno span'), set = DatesOne.valid ? null : 1;
        DatesOne.each(span, function(i, elem){
            if(set){
                DatesOne.addClass(elem, as[1]);
            } else if(DatesOne.timeVoid(i, index)){
                DatesOne.addClass(elem, as[1]);
            } else {
                DatesOne.on(elem, 'click', function(ev){
                    if(!DatesOne.hasClass(this, as[1])){
                        input.value = DatesOne.digit(this.innerHTML|0);
                    }
                });
            } 
        });
        DatesOne.addClass(span[input.value|0], 'laydate_click');
    };
    
    //展开选择
    DatesOne.each(log.hmsin, function(i, elem){
        DatesOne.on(elem, 'click', function(ev){
        	DatesOne.stopmp(ev).reshow();
            DatesOne.msg(i, log.hmss[i]);
            log.hmson(this, i);
        });
    });
    
    DatesOne.on(doc, 'mouseup', function(){
        var box = S('#'+as[0]);
        if(box && box.style.display !== 'none'){
            DatesOne.check() || DatesOne.close();
        }
    }).on(doc, 'keydown', function(event){
        event = event || win.event;
        var codes = event.keyCode;

        //如果在日期显示的时候按回车
        if(codes === 13 && DatesOne.elem){
            DatesOne.creation([DatesOne.ymd[0], DatesOne.ymd[1]+1, DatesOne.ymd[2]]);
        }
    });
};

DatesOne.init = (function(){
  /*  DatesOne.use('need');
    DatesOne.use(as[4] + config.defSkin, as[3]);*/
    DatesOne.skinLink = DatesOne.query('#'+as[3]);
}());

//重置定位
laydateOne.reset = function(){
    (DatesOne.box && DatesOne.elem) && DatesOne.follow(DatesOne.box);
};

//返回指定日期
laydateOne.now = function(timestamp, format){
    var De = new Date((timestamp|0) ? function(tamp){
        return tamp < 86400000 ? (+new Date + tamp*86400000) : tamp;
    }(parseInt(timestamp)) : +new Date);
    return DatesOne.parse(
        [De.getFullYear(), De.getMonth()+1, De.getDate()],
        [De.getHours(), De.getMinutes(), De.getSeconds()],
        format
    );
};

//皮肤选择
laydateOne.skin = function(lib){
    DatesOne.skinLink.href = DatesOne.getPath + as[4] + lib + as[5];
};

}(window);