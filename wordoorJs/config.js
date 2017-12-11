var urlPost = document.location.origin;  
var urlPostContent = urlPost + '/wordoor_content_api/v1';
var urlPostUaas = urlPost + '/wordoor_uaas_api/v1';
var urlPostUals = urlPost + '/wordoor_uals_api/v1';
var H5InviteUrl  = urlPost + '/joinGroupH5';    
var orgId;     
var Lang;  
 
var userInformation = window.localStorage.getItem('userInformation');
if(userInformation){
    userInformation = JSON.parse(userInformation);
     orgId= userInformation.orgId;
}else{
    window.location.href = './login.html';
} 
if(window.localStorage.getItem('lang')){
    Lang = window.localStorage.getItem('lang'); 
}else{
    Lang = userInformation.language;
}  
$.ajaxSetup({  
         beforeSend: function (XMLHttpRequest) {
             XMLHttpRequest.setRequestHeader("A-Token-Header",userInformation.token);
        },
            global:true   
});  

var H5UrlGiveUrl =  urlPostContent+'/tool/encodeUrl';
var courseUrl = urlPostContent+ '/search/material/normal_query_for_content';
var normal_query_course_url = urlPostContent+ '/search/material/normal_query_for_content';
var courseDetailsUrl =  urlPostContent+'/material/detail';
var courseVerifyUrl = urlPostContent+'/material/audit';  
var courseSaveUrl = urlPostContent+'/material/save';
var courseDeleteUrl = urlPostContent+'/material/remove';
var courseInSeriesAll = urlPostContent+'/series/material_joined';
/*系列相关*/
var seriesListUrl = urlPostContent+'/search/series/normal_query_for_content';
var addSeriesSaveUrl = urlPostContent+'/series/save';
var seriesAllCourseUrl = urlPostContent+'/series/pages_series_resource';
var seriesDetailsUrl =  urlPostContent+'/series/detail';
var seriesVerifyUrl = urlPostContent+'/series/audit';
var seriesDeleteUrl = urlPostContent+'/series/remove'; 
var courseToSeries = urlPostContent+'/series/add2series';
var removeCourseInSeries = urlPostContent+'/series/removed_resource';
var resequencingseriesUrl =  urlPostContent + '/series/resequencing4series';

/*新建系列或课程的选项列表*/
var native_languagesUrl = urlPostUaas+'/tag/native_languages';
var sec_languagesUrl = urlPostUaas+'/tag/sec_languages';
var categoriesUrl = urlPostContent+'/tag/categories';
var difficultiesUrl = urlPostContent+'/tag/difficulties';
/* 请求的url*/
var langOrgUrl = urlPostUaas+'/organization/orgLanguases';
/*用户相关*/
var securityUrl = urlPostUaas+'/organization/orgAdminUsers';
var securityRemoveUrl = urlPostUaas+'/organization/removeAdmin';
var securitySearchUrl = urlPostUaas+'/user/query_pages';
var securityAddAdminUrl = urlPostUaas+'/organization/addAdmin';
var groupStudentSearchAddUrl = urlPostUaas+'/search/user/normal_query';
 
/*群组相关*/
var groupListUrl = urlPostUaas+'/organization/relGroup';
var groupAddOrEditUrl = urlPostUaas+'/group/save';
var groupRemoveUrl = urlPostUaas+'/group/remove';
var groupMembersUrl = urlPostUaas+'/group/relMember';
var groupAddMembersUrl = urlPostUaas+'/group/addRel';
var groupRemoveRelationUrl = urlPostUaas+'/group/removeRel';
var groupCourseUrl = urlPostUaas+ '/group/relMaterial';
var applyListTutorUrl =  urlPostUaas+ '/organization/applyList';
var tutorApplyConfirmUrl = urlPostUaas+ '/organization/updateApply';
var allTutorsUrl = urlPostUaas+ '/organization/relMember';
var groupTutorUrl = urlPost+ '/wordoor_api/v1/group/relMember';
var groupAddStudentManyUrl = urlPostUaas+ '/group/addBatchRels';
var sendEmailManyUrl = urlPostUaas+ '/group/sendEmailsForUsers';
var lianjieH5Url = urlPostUaas+ '/group/groupInviteUpdate';
var groupStudentInviteDetailUrl = urlPostUaas+ '/group/groupInviteDetail';

var verifyTutorUrl = urlPost+ '/wordoor_api/v1/organization/applyList';
  
/*计划模板相关*/   
var planTemplateListUrl =  urlPostUals+'/plan/planTemList';
var planTemplateAddOrEditUrl =  urlPostUals+'/plan/creOrUpPlanTem';
var planTemplateDetailUrl =  urlPostUals+'/plan/planTemDetail';
var planTemplateRemoveUrl =  urlPostUals+'/plan/planTemRemove';

/*训练计划相关*/    
var planListUrl =  urlPostUals+'/plan/planList';  
var planAddOrEditUrl =  urlPostUals+'/plan/creOrUpPlan';
var planDetailUrl =  urlPostUals+'/plan/planDetail';
var planRemoveUrl =  urlPostUals+'/plan/planRemove';
var planScheduleUrl = urlPostUals+ '/plan/planSchedule'; 
var updatePlanScheduleUrl =  urlPostUals+ '/plan/updatePlanSchedule'; 

/*数据看板*/   
var totalDataScreenUrl = urlPostUaas+'/group/totalDataScreen';
var groupDataScreenUrl = urlPostUaas+'/group/groupDataScreen';
var groupMemberDataScreenUrl = urlPostUaas+'/group/groupMemberDataScreen';
var groupMemberOrderDataListUrl = urlPostUaas+'/group/groupMemberOrderDataList';
var groupContentSeriesDataListUrl = urlPostUaas+'/group/groupContentSeriesDataList';
var groupContentMaterialDataListUrl = urlPostUaas+'/group/groupContentMaterialDataList';
var groupTaskDataUrl = urlPostUaas+'/group/groupTaskData';
var groupMemberTaskDataUrl =  urlPostUaas+'/group/groupMemberTaskData';
var organizationMemberUrl = urlPostUaas+'/group/organizationMemberDataScreen';
var organizationOrderDataUrl = urlPostUaas+'/group/organizationOrderData';
var orderLineChart = urlPostUaas+'/group/orderLineChart';
var orgCourseDataUrl =  urlPostUaas+'/group/organizationMaterialPages'; 
var orgCourseReviewUrl =  urlPostUaas+'/organization/orgSeriesAmount';   
 
/*上传图片的url*/   
var uploadImgUrl = urlPostContent+'/upload/upToken';
var imgCutUrl = urlPostContent+'/trim/image';
/*第三方url*/
var H5_URL = 'http://popon.beyondin.com/';
var ADD_SCENE = 'http://popon.beyondin.com/scene/createBlankScene?';
var EDIT_SCENE = 'http://popon.beyondin.com/scene/showEditScene?';

/*课程详情展示 */
function reviewCourseShow(item){
            var difficultyVal = item.difficulty.display;
            if(item.category){
                var categoryVal = item.category.display;
            }else{
                var categoryVal = '';
            }
            var titleEdit = item.title;
           var descEdit = item.desc;
            var durationVal = item.forNativeLanguage.display;
            var coverEdit = item.cover;
            var forPeopleLanguageIdsEditDis = '';
            if(item.forSecNativeLanguages){
                $.each(item.forSecNativeLanguages,function(index,item){
                    forPeopleLanguageIdsEditDis += item.display +' ';
                });
                forPeopleLanguageIdsEditDis = forPeopleLanguageIdsEditDis.replace(/(^\s+)|(\s+$)/g,'');
            }
            $('.courseinp .language input').val(forPeopleLanguageIdsEditDis);
            var html = '<div class="course-along"><div class="title"><span>'+Language.course_details+'</span><img class="alongDelete" src="./images/close.png" /></div><div class="courseinp"><div class="time"><span>'+Language.first_Language+'</span> <input type="text" readonly value="'+durationVal+'"></div><div class="language"><span>'+Language.second_language+'</span> <input type="text" value="'+forPeopleLanguageIdsEditDis+'" readonly';
          html += '></div><div class="classify"><span>'+Language.course_classification+'</span> <input type="text" readonly value="'+categoryVal+'">';
            html += '</div><div class="difficult"><span>'+Language.difficulty+'</span> <input type="text" readonly value="'+difficultyVal+'">';
            html += '</div><div class="navtitle"><span>'+ Language.coyurse_title+'</span> <input type="text" value="'+titleEdit+'" readonly></div><div class="des"><span>'+Language.course_description+'</span><textarea readonly>'+descEdit+'</textarea></div><div class="imgChoose"><span class="imgtext">'+Language.Cover+'</span><div class="imgUpDate" style="background-image:url('+coverEdit+');background-size:100% 100%;"></div></div>';
            html += '<div class="clear"></div></div></div>';  
            $(html).appendTo($('body'));
            /*如果是英文时就让标题的行高减小以适应长度*/  
            if(Lang == 'English'){  
                $('.courseinp .language span,.courseinp .time span,.courseinp .difficult span,.courseinp .classify span').css({lineHeight:'20px'});
            }else{
                $('.courseinp .language span').css({lineHeight:'20px'});
            }
             /* 点击右上角的关闭按钮*/
            $('.alongDelete').on('click',function(){
                $('.course-along').remove();
                $('.worDoorShade').remove();
            });  
           
};
/*系列详情只读*/  

function lookSeriseDetails(mid,lang){
    $.ajax({
            url:seriesDetailsUrl,
            type:'post',
            data:{
                seriesId:mid,
                lang:lang
            },
            success:function(dataList) {
                var difficultyEdit = dataList.result.difficulty ? dataList.result.difficulty.display : '';
                var categoryVal = dataList.result.category ? dataList.result.category.display : '';
                var titleEdit = dataList.result.title;
               var descEdit = dataList.result.desc;
               var durationVal = dataList.result.forNativeLanguage ? dataList.result.forNativeLanguage.display : '';
                var coverEdit = dataList.result.cover;
                var forPeopleLanguageIdsEditDis = '';
                if(dataList.result.forSecNativeLanguages){
                    $.each(dataList.result.forSecNativeLanguages,function(index,item){
                        forPeopleLanguageIdsEditDis += item.display +' ';
                    });
                    forPeopleLanguageIdsEditDis = forPeopleLanguageIdsEditDis.replace(/(^\s+)|(\s+$)/g,'');
                }  
                var html = '<div class="shade"><div class="course-along"><div class="title"><span>'+Language.series_details+'</span><img class="alongDelete" src="./images/close.png" /></div><div class="courseinp"><div class="time"><span>'+Language.first_Language+'</span> <input type="text" readonly isok="0" value="'+durationVal+'"></div><div class="language"><span>'+Language.second_language+'</span> <input type="text" value="'+forPeopleLanguageIdsEditDis+'" readonly isok="0"';
                html += '></div><div class="classify"><span>'+Language.course_classification+'</span> <input type="text" readonly isok="0" value="'+categoryVal+'">';
                html += '</div><div class="difficult"><span>'+Language.difficulty+'</span> <input type="text" readonly isok="0" value="'+difficultyEdit+'">';
                html += '</div><div class="navtitle"><span>'+ Language.series_title+'</span> <input type="text" value="'+titleEdit+'" readonly="readonly"></div><div class="des"><span>'+Language.series_description+'</span><textarea readonly="readonly">'+descEdit+'</textarea></div><div class="imgChoose"><span class="imgtext">'+Language.series_Cover+'</span><div class="imgUpDate" style="background-image:url('+coverEdit+');background-size:100% 100%;"></div></div>';  
                html += '<div class="clear"></div></div></div>';
                $(html).appendTo($('body'));  
                $('.alongDelete').on('click',function(){
                    $('.shade').remove();
                })
                /*如果是英文时就让标题的行高减小以适应长度*/
                if(Lang == 'English'){
                    $('.courseinp .language span,.courseinp .time span,.courseinp .difficult span,.courseinp .classify span').css({lineHeight:'20px'});
                }else{
                    $('.courseinp .language span').css({lineHeight:'20px'});
                }
            }
        })
};
/*系列审核 */
function editSerise(mid,lang,url,dataPost,fn){
    $.ajax({
            url:seriesDetailsUrl,    
            type:'post',  
            data:{  
                seriesId:mid,
                lang:lang
            },
            success:function(dataList) {
                var difficultyEdit = dataList.result.difficulty ? dataList.result.difficulty.display : '';
                var categoryVal = dataList.result.category ? dataList.result.category.display : '';
                var titleEdit = dataList.result.title;
               var descEdit = dataList.result.desc;
               var durationVal = dataList.result.forNativeLanguage ? dataList.result.forNativeLanguage.display : '';
                var coverEdit = dataList.result.cover;
                var forPeopleLanguageIdsEditDis = '';
                if(dataList.result.forSecNativeLanguages){
                    $.each(dataList.result.forSecNativeLanguages,function(index,item){
                        forPeopleLanguageIdsEditDis += item.display +' ';
                    });
                    forPeopleLanguageIdsEditDis = forPeopleLanguageIdsEditDis.replace(/(^\s+)|(\s+$)/g,'');
                }        
                var html = '<div class="shade"><div class="course-along"><div class="title"><span>'+Language.series_details+'</span><img class="alongDelete" src="./images/close.png" /></div><div class="courseinp"><div class="time"><span>'+Language.first_Language+'</span> <input type="text" readonly isok="0" value="'+durationVal+'"></div><div class="language"><span>'+Language.second_language+'</span> <input type="text" value="'+forPeopleLanguageIdsEditDis+'" readonly isok="0"';
                html += '></div><div class="classify"><span>'+Language.course_classification+'</span> <input type="text" readonly isok="0" value="'+categoryVal+'">';
                html += '</div><div class="difficult"><span>'+Language.difficulty+'</span> <input type="text" readonly isok="0" value="'+difficultyEdit+'">';
                html += '</div><div class="navtitle"><span>'+ Language.series_title+'</span> <input type="text" value="'+titleEdit+'" readonly="readonly"></div><div class="des"><span>'+Language.series_description+'</span><textarea readonly="readonly">'+descEdit+'</textarea></div><div class="imgChoose"><span class="imgtext">'+Language.series_Cover+'</span><div class="imgUpDate" style="background-image:url('+coverEdit+');background-size:100% 100%;"></div></div>';  
                html += '<div class="clear"></div></div><div class="btnGroupByNew clear">' +
                '<div class="dialogDelete-buts"><span class="pop_btns pop-btnsDeep pop_btns-small pop_circle pop_delete approved">'+Language.approved+'</span><span class="pop_btns pop-btnsShallow pop_btns-small pop_circle pop_cancel rejected">'+Language.rejected+'</span>           </div>' +
                '           </div></div></div>';
            $(html).appendTo($('body'));
            $('.alongDelete').on('click',function(){
                $('.shade').remove();
            })  
            /*如果是英文时就让标题的行高减小以适应长度*/
            if(Lang == 'English'){
                $('.courseinp .language span,.courseinp .time span,.courseinp .difficult span,.courseinp .classify span').css({lineHeight:'20px'});
            }else{
                $('.courseinp .language span').css({lineHeight:'20px'});
            }  
            $('.course-along .approved').off().on('click',function(){
                deleteDialog(function(res){
                    $.ajax({
                        url:seriesVerifyUrl,
                        data:{
                            auditStatus:2,
                            auditor:userInformation.userId,
                            seriesId:dataList.result.id,
                            scope:res
                        },
                        type:'post',
                        success:function(data){
                            if(data.code == 200){
                                fn&&fn(url,dataPost);
                            }
                        }
                    })
                },approveSeries);
             });
            $('.course-along .rejected').off().on('click',function(){
                deleteDialog(function(res){
                    $.ajax({
                        url:seriesVerifyUrl,
                        data:{
                            auditStatus:-1,
                            auditor:userInformation.userId,
                            seriesId:dataList.result.id,
                            auditDesc:res
                        },
                        type:'post',
                        success:function(data){
                            if(data.code == 200){
                                fn&&fn(url,dataPost);
                            }
                        }
                    })
                },rejectSeries);
             });
            }
        })
};

/*课程的难度和审核状态的判断*/
function courseCOnfirm(item){
    if(item.auditStatus && item.auditStatus.id == 2){
        item.auditStatusShow = Language.course_status_published;
    }else if(item.auditStatus && item.auditStatus.id == 1){
        item.auditStatusShow = Language.course_status_review;
    }else if(item.auditStatus && item.auditStatus.id == 0){
        item.auditStatusShow = Language.course_status_draft;
    }else if(item.auditStatus && item.auditStatus.id == -1){
        item.auditStatusShow = Language.course_status_failed;
    }
    if(item.status == 0){
        item.statusShow = Language.Not_started;
    }else if(item.status == 1){
        item.statusShow = Language.In_progress;
    }else{
        item.statusShow = Language.Completed;
    }
    if(item.strength && item.strength == 1){
        item.strengthShow = Language.one_Courses_Per_Month;
    }else if(item.strength && item.strength == 2){
        item.strengthShow = Language.two_Courses_Per_Month;
    }else if(item.strength && item.strength == 3){
        item.strengthShow = Language.three_Courses_Per_Month;
    }else if(item.strength && item.strength == 4){
        item.strengthShow = Language.four_Courses_Per_Month;
    }else if(item.strength && item.strength == 5){
        item.strengthShow = Language.five_Courses_Per_Month;
    }else if(item.strength && item.strength == 6){
        item.strengthShow = Language.six_Courses_Per_Month;
    }else if(item.strength && item.strength == 7){
        item.strengthShow = Language.seven_Courses_Per_Month;
    }else if(item.strength && item.strength == 8){
        item.strengthShow = Language.eight_Courses_Per_Month;
    }else if(item.strength && item.strength == 9){
        item.strengthShow = Language.nine_Courses_Per_Month;
    }else if(item.strength && item.strength == 10){
        item.strengthShow = Language.ten_Courses_Per_Month;
    }

    if(item.language && item.language == 'Chinese'){
        item.languageShow = '中文';
    }else if(item.language && item.language == 'English'){
        item.languageShow = 'English';
    }else if(item.language && item.language == 'Japanese'){ 
        item.languageShow = '日本語';
    }else if(item.language && item.language == 'Korean'){
        item.languageShow = '한국어'; 
    }else if(item.language && item.language == 'Spanish'){
        item.languageShow = 'Español'; 
    }  

    if(item.lang && item.lang == 'Chinese'){
        item.langImg = "./images/Popzu/zh-CN.jpg";
    }else if(item.lang && item.lang == 'English'){
        item.langImg = "./images/Popzu/en.jpg";
    }else if(item.lang && item.lang == 'Japanese'){  
        item.langImg = "./images/Popzu/flag-japan@2x.png";
    }else if(item.lang && item.lang == 'Korean'){
        item.langImg = "./images/Popzu/flag-korean@2x.png";
    }else if(item.lang && item.lang == 'Spanish'){
        item.langImg = "./images/Popzu/flag-spanish@2x.png";
    }
}
function courseCOnfirmSeries(item){
    if(item.auditStatus && item.auditStatus.id == 2){
        item.auditStatusShow = Language.Published;
    }else if(item.auditStatus && item.auditStatus.id == 1){
        item.auditStatusShow = Language.course_status_review;
    }else if(item.auditStatus && item.auditStatus.id == 0){
        item.auditStatusShow = Language.course_status_draft;
    }else if(item.auditStatus && item.auditStatus.id == -1){
        item.auditStatusShow = Language.course_status_failed;
    }
     
}
/*公用删除*/
function shade() {
    $('<div class="worDoorShade"></div>').css({
            'position': 'absolute', 'left': 0, 'z-index': 13000, 
            top: 0, width: '100%', 'height': function () {
                return $(document).height();
            }, 'background-color': 'rgba(0,0,0,0.5)'
    }).appendTo($('body'))  
    
}  
function shadeCropWrap() {
    $('<div class="worDoorCropWrap"></div>').css({
            'position': 'absolute', 'left': 0, 'z-index': 14000,
            top: 0, width: '100%', 'height': function () {
                return $(document).height();
            }, 'background-color': 'rgba(0,0,0,0.2)'
    }).appendTo($('body'))
     
}
function deleteDialogPlan(fn1,fn2,content,del) {  
    shade();
      var html = ['<div class="dialog deleteDialogCommon" style="z-index:10000;"><div class="dialog-wrap">',
        '   <div class=\'dialogDelete-title\'>' + del + '</div><div class="spit"></div>',
        '   <img src= \'\' />',
        '   <div class="dialogDelete-content">          ',
        '       <p>' + content + '</p>',
        '   </div>      ', 
        '   <div class="dialogDelete-buts">         ',
        '       <span class="pop_btns pop-btnsDeep pop_btns-small pop_circle pop_delete">' + Language.Confirm + '</span>            ',
        '       <span class="pop_btns pop-btnsShallow pop_btns-small pop_circle pop_cancel">' + Language.cancel + '</span>      ',
        '   </div>  ',
        '</div></div>'].join("");
    $(html).appendTo($('body')).css({
        position: 'fixed', top: function () {
            return $(window).height() / 2 + $('body').scrollTop()
        }, left: '50%', top: '50%', transform: 'translate(-50%,-50%)','z-index': 15000 
    })
    $('.deleteDialogCommon').find('.pop_delete').on('click', function () {
        $('.deleteDialogCommon').remove();
         $('.worDoorShade').remove();
        fn1 && fn1.apply();
    });
    $('.deleteDialogCommon').find('.pop_cancel').on('click', function () {
        $('.deleteDialogCommon').remove();
         $('.worDoorShade').remove();
        fn2 && fn2.apply();
    });
}
function deleteDialog(fn1,fn2) {
    shade();
    var html = [fn2(),
        '   </div>      ',
        '   <div class="dialogDelete-buts">         ',
        '       <span class="pop_btns pop-btnsDeep pop_btns-small pop_circle pop_delete">' + Language.Confirm + '</span>            ',
        '       <span class="pop_btns pop-btnsShallow pop_btns-small pop_circle pop_cancel">' + Language.cancel + '</span>      ',
        '   </div>  ',
        '</div></div>'].join("");
    $(html).appendTo($('body')).css({
        position: 'fixed', top: function () {
            return $(window).height() / 2 + $('body').scrollTop()
        }, left: '50%', top: '50%', transform: 'translate(-50%,-50%)','z-index': 15000 
    })
    $('.deleteDialogCommon').find('.pop_delete').on('click', function () {
        var content = $('.form-control').val();
        $('.deleteDialogCommon').remove();
         $('.worDoorShade').remove();
         $('.shade').remove();
        fn1 && fn1(content);
    });
    $('.deleteDialogCommon').find('.pop_cancel').on('click', function () {
        $('.deleteDialogCommon').remove();
         $('.worDoorShade').remove();
    });
}

function approveSeries(){
    var html = '<div class="dialog deleteDialogCommon" style="z-index:10000;"><div class="dialog-wrap">'+
        '   <div class=\'dialogDelete-title\'>' + Language.Select_visibility_settings + '</div><div class="spit"></div>'+
        '   <div class="dialogDelete-content"><div class="language lang"><div class="authChoose">'+Language.Permission_Selection+'</div>'+
        '<select class="form-control"><option value=1>'+Language.visible_to_public+'</option> <option value=3>'+Language.visible_to_institutions+'</option></select>'+
        '<div style="clear:both;"></div></div>';   
        return html;
}

function rejectSeries(){
    var html = '<div class="dialog deleteDialogCommon" style="z-index:10000;"><div class="dialog-wrap">'+
        '   <div class=\'dialogDelete-title\'>' + '请选择拒绝原因:' + '</div><div class="spit"></div>'+
        '   <div class="dialogDelete-content"><div class="language lang"><div class="authChoose">原因</div>'+
        '<input type="text" class="form-control" value="资料不全" />'+
        '<div style="clear:both;"></div></div>';
        return html;  
}
/*可输入的字数的显示的一个方法*/
function setShowLength(obj, maxlength, id) {
    var rem = maxlength - obj.value.length;
    var wid = id; 
    if (rem < 0) { 
        rem = 0;
    }
    document.getElementById(wid).innerHTML = Language.also_you_can_enter + '&nbsp;' +rem + '&nbsp;' + Language.word;
} 
/*定制alert()方法*/
  function alert(e){ 
         $("body").append('<div class="msg_wordoor" style="width:366px;height:150px;position: fixed;z-index:999999;top: 5%;left:50%;margin-left:-133px;background:#fff;box-shadow:5px 5px 8px #999;font-size:17px;color:#666;border:1px solid #f8f8f8;text-align: center;display:inline-block;padding-bottom:20px;border-radius:2px;"><div class="msg_top" style="background:#f8f8f8;padding:5px 15px 5px 20px;text-align:left;">'+Language.information+'<span class="msg_close" style=" font-size:22px;float:right;cursor:pointer;">×</span></div><div class="msg_cont" style="padding:15px 20px 20px; text-align:left;">'+e+'</div><div class="msg_close" style="display:inline-block;color:#fff;padding:1px 15px;background:#09c0ce;border-radius:2px;float:right;margin:15px 15px 0 0;cursor:pointer;">'+Language.Confirm+'</div></div>');
        $(".msg_close").click(function (){ 
            $(".msg_wordoor").remove();  
        });       
    }   