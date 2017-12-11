var urlPost = 'http://192.168.1.48';  
var inviteUrl = urlPost + '/statics/wordoorFront/joinGroupH5';    
var urlPostUaas = urlPost + '/wordoor_uaas_api/v1';
var groupInviteQueryUrl = urlPostUaas + '/group/groupInviteQuery'; 
var groupInviteUserlUrl = urlPostUaas + '/group/groupInviteUser'; 
var checkUserUrl = urlPostUaas + '/group/checkUser';
(function (doc, win) {
       var docEl = doc.documentElement,
           resizeEvt = 'onorientationchange' in window ? 'onorientationchange' : 'resize',
           recalc = function () {
               var clientWidth = docEl.clientWidth;  
               if (!clientWidth) return;
               if(clientWidth>=750){  
                   docEl.style.fontSize = '100px';
               }else{
                   docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
               }
           }; 
 
       if (!doc.addEventListener) return;
       win.addEventListener(resizeEvt, recalc, false);
       doc.addEventListener('DOMContentLoaded', recalc, false);
   })(document, window);


function getQueryString(name) {  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r =decodeURIComponent(window.location.search.substr(1)).match(reg);    
    if (r == null) {  
        console.log('缺少参数' + name);   
        return false;  
    } 
    var val = unescape(r[2]);    
    if (r != null) return val;     
    return null;
}

function judgeMobile() {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;

        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        return isAndroid ? 1 : 2;
    }

  function groupInviteUser(groupId,acc,answer,identity,lang){
      $.ajax({
        url:groupInviteUserlUrl,  
        type:'post',
        data:{
          groupId:groupId,
          acc:acc,
          answer:answer,
          identity:identity
        },
        success:function(data){
          if(data.code == 200 && data.result.flag){
            var userName = 
            document.location.href = inviteUrl + '/index3.html?iden='+identity+'&id=' + groupId + '&user='+data.result.userName + '&L=' + lang; 
          }else if(data.code == 994){
            alert(data.codemsg);
          }else{
            alert('添加失败!');
          }
        }
      })
    }