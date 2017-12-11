Function.prototype.addMethod = function(name, fn) {
    this.prototype[name] = fn;
    return this;
}
var Methods = function() {}
Methods.addMethod('checkEmail', function(email) {
    var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    this['email' + email] = reg.test(email) ? true : false;
    return this;
}).addMethod('getQueryString', function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r =decodeURIComponent(window.location.href).match(reg);   
    if (r == null) {  
        console.log('缺少参数' + name); 
        return false;  
    } 
    var val = unescape(r[2]);     
    if (r != null) return val;  
    return null;
}).addMethod('setRem', function() {
    setRem();
    window.addEventListener("orientationchange", setRem);
    window.addEventListener("resize", setRem);

    function setRem() {
        var html = document.querySelector("html");
        var width = html.getBoundingClientRect().width;
        html.style.fontSize = width / 3.75 + "px";
    }
    return this;
}).addMethod('isWeiXin', function() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}).addMethod("openOrDownApp", function() {
    bind(document, 'touchend', function() {
        if (!this.move) {
            if (utils.isWeiXin()) {
                window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.wordoor.andr.popon";
                return false;
            }
            var timeout, t = 1700,
                hasApp = true;
            setTimeout(function() {
                if (!hasApp) {
                    appDownload();
                }
            }, t + 200);
            testApp();

            function testApp() {
                var t1 = Date.now();
                document.location.href = 'popon://chooseTopicAction';
                timeout = setTimeout(function() {
                    try_to_open_app(t1);
                }, t);
            }

            function try_to_open_app(t1) {
                var t2 = Date.now();
                if (!t1 || t2 - t1 < t + 200) {
                    hasApp = false;
                }
            }

            function appDownload() {
                window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.wordoor.andr.popon";
            }
        }
        this.move = false;
    });
})
Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

function bind(obj, name, fn) {
    obj.addEventListener(name, function() {
        fn && fn.bind(this)();
    });
}
bind(document, 'touchmove', function() {
    if (!this.move) {
        this.move = true;
    }
});