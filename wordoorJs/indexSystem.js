
var myapp = angular.module('popon',["ui.router"]);

/*公共头部*/
myapp.controller('header',['$scope',"$state",'$rootScope',function($scope,$state,$rootScope){
	$scope.avatar = userInformation.avatar;
	$scope.userName = userInformation.userName;
	$scope.nav = [
		{'value':Language.Data_Panel},  
		{'value':Language.security},      
		{'value':Language.Popzu}, 
		{'value':Language.verify}  
	]
	$scope.language = Language.language;
	$scope.languageList = [
			{id:'Chinese',display:'中文'},
		{id:'English',display:'English'},
		{id:'Japanese',display:'日本語'},
		{id:'Korean',display:'한국어'},
		{id:'Spanish',display:'Español'},
		{id:'German',display:'Deutsch'},
		{id:'French',display:'Français'},
		{id:'Russian',display:'русский'},
		{id:'Vietnamese',display:'Tiếng Việt'}
	];
	$scope.outSide = Language.tuichu;
	$scope.choosed = 0
	$rootScope.$on('worDoor',function(event,data){ 
		data.worDoorTitleNumber ? $scope.choosed = data.worDoorTitleNumber : $scope.choosed = 0;
	})    
	 $scope.chooseLanguage = function(langugage){ 
		window.localStorage['lang'] = langugage;
		$scope.langShow = false;
		window.location.reload();  
	}   
	  
	$scope.tuichu = function(){
		window.location.href = './login.html';
	}
	$scope.navchoose = function(index){
		switch(index){
			case 0 : $state.go('dataLook.dataOverview');
			break;
			case 1 : $state.go('security');
			break;
			case 2 : $state.go('group');
			break;
			/*case 3 : $state.go('planTemplate');
			break;*/
			case 3 : $state.go('verify',{first:0});  
			break;  
			defaults:; 
			break; 
		}  
		$scope.choosed = index;
	}
}]).factory('sessionInjector', function(){
    return {
        request: function (config){
        	config.headers['A-Token-Header'] = userInformation.token;
          return config;
        }
    };
}).config(['$stateProvider', '$urlRouterProvider','$httpProvider','$sceDelegateProvider',function($stateProvider,$urlRouterProvider,$httpProvider,$sceDelegateProvider){
		$httpProvider.interceptors.push('sessionInjector');

		 $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://popon.beyondin.com/**']); 

		$urlRouterProvider.otherwise("/dataLook");
		$stateProvider.state('dataLook',{
			url:"/dataLook",
			templateUrl:"./modules/dataLook/dataReview.html",
			controller:"dataLook"
		}).state('dataLook.dataOverview',{
			url:"/dataOverview",
			templateUrl:"./modules/dataLook/dataOverview.html",
			controller:"dataOverview"
		}).state('dataLook.dataClass',{
			url:"/dataClass",
			params:{groupId:null},
			templateUrl:"./modules/dataLook/dataClass.html",
			controller:"dataClass"
		}).state('dataLook.dataClass.classStudentData',{
			url:"/classStudentData",
			templateUrl:"./modules/dataLook/dataClass/classStudentData.html",
			controller:"classStudentData"
		}).state('dataLook.dataClass.classTutorData',{
			url:"/classTutorData",
			templateUrl:"./modules/dataLook/dataClass/classTutorData.html",
			controller:"classTutorData"
		}).state('dataLook.dataClass.classContentData',{
			url:"/classContentData",
			templateUrl:"./modules/dataLook/dataClass/classContentData.html",
			controller:"classContentData"
		}).state('dataLook.dataClass.classTaskData',{
			url:"/classTaskData",
			templateUrl:"./modules/dataLook/dataClass/classTaskData.html",
			controller:"classTaskData"
		}).state('dataLook.dataAgency',{
			url:"/dataAgency",
			templateUrl:"./modules/dataLook/dataAgency.html",
			controller:"dataAgency"
		}).state('dataLook.dataAgency.studentData',{
			url:"/studentData",
			templateUrl:"./modules/dataLook/dataAgency/studentData.html",
			controller:"studentData"
		}).state('dataLook.dataAgency.tutorData',{
			url:"/tutorData",
			templateUrl:"./modules/dataLook/dataAgency/tutorData.html",
			controller:"tutorData" 
		}).state('dataLook.dataAgency.orderData',{
			url:"/orderData",
			templateUrl:"./modules/dataLook/dataAgency/orderData.html",
			controller:"orderData"
		}).state('dataLook.dataAgency.seriesData',{
			url:"/seriesData",
			templateUrl:"./modules/dataLook/dataAgency/seriesData.html",
			controller:"seriesData"
		}).state('dataLook.dataAgency.courseData',{
			url:"/courseData",
			templateUrl:"./modules/dataLook/dataAgency/courseData.html",
			controller:"courseData"
		}).state("security",{ 
			url:"/security",
			templateUrl:"./modules/security.html",
			controller:"security"
		}).state("group",{
			url:"/group",
			templateUrl:"./modules/group/group.html",
			controller:"group"
		}).state('groupDetail',{
			params:{name:null,groupId:null,language:null},
			url:"/groupDetail",
			templateUrl:"./modules/group/groupDetail.html",
			controller:"groupDetail"
		}).state('groupDetail.groupStudent',{
			url:"/groupDetail",
			templateUrl:"./modules/group/groupStudent.html",
			controller:"groupStudent"
		}).state('groupDetail.groupTutor',{
			url:"/groupDetail",
			templateUrl:"./modules/group/groupTutor.html",
			controller:"groupTutor"
		}).state('groupDetail.groupCourse',{
			url:"/groupDetail",
			templateUrl:"./modules/group/groupCourse.html",
			controller:"groupCourse"
		}).state("verify",{
			url:"/verify",
			params:{first:null}, 
			templateUrl:"./modules/verify/verify.html",
			controller:"verify"
		}).state("verify.displayCourse",{
			url:"/verify/displayCourse",
			templateUrl:"./modules/verify/displayCourse.html",
			controller:"displayCourse"
		}).state("verify.verifyCourse",{
			url:"/verify/verifyCourse",
			templateUrl:"./modules/verify/verifyCourse.html",
			controller:"verifyCourse"
		}).state("verify.allTutors",{
			url:"/verify/allTutors",
			templateUrl:"./modules/verify/allTutors.html",
			controller:"allTutors"
		}).state("verify.verifyTutor",{
			url:"/verify/verifyTutor",
			templateUrl:"./modules/verify/verifyTutor.html",
			controller:"verifyTutor"
		}).state('verify.allSeries',{
			url:'/verify/allSeries',
			templateUrl:'./modules/verify/allSeries.html',
			controller:"allSeries"
		}).state('verify.verifySeries',{
			url:'/verify/verifySeries',
			templateUrl:'./modules/verify/verifySeries.html',
			controller:"verifySeries"
		}).state('verify.verifyCourseInSeries',{
			url:'/verify/verifyCourseInSeries',
			params:{seriesId:null},
			templateUrl:'./modules/verify/seriesCourse.html',
			controller:"verifyCourseInSeries"
		}).state('courseReview',{
			url:'/courseReview',
			params:{details:null,first:null,seriesId:null}, 
			templateUrl:'./modules/verify/courseReview.html',
			controller:"courseReview"
		}).state('courseReviewVerify',{
			url:'/courseReviewVerify', 
			params:{details:null},  
			templateUrl:'./modules/verify/verifyCourseDetails.html',
			controller:"courseReviewVerify"
		}).state("planTemplate",{
			url:'/planTemplate',
			params:{new:null}, 
			templateUrl:"./modules/planTemplate/planTemplate.html",
			controller:"planTemplate"
		})
}]).factory('worDoorHttp',['$http',function($http){
		var worDoor = {};
		worDoor.postHttp = function(url,dataPost,fn){
			var myData = {};
			$http({
				url:url,
				params:dataPost,
				method:'post', 
				headers: {'Accept-Language':Lang}  
			}).then(function(data){
				for(var key in  data.data.result){
					if(key == 'items'){
						myData.items = data.data.result.items;
						myData.count = data.data.result.totalItemsCount;
					}
				}
				myData.code = data.data.code;
				myData.result = data.data.result;
				myData.codemsg = data.data.codemsg; 
				fn(myData)
			})
		}
		return worDoor;
}]).factory('worDoorCourseHttp',['$http','$q',function($http,$q){
		var worDoor = {};
		var getDataFun = function(item){
			var dataAlong = '';
			return new Promise(function(resolve){
				$http({
					url:courseInSeriesAll,
					params:{
						materialId:item.detail ? item.detail.id :item.id
					},
					method:'post'
				}).then(function(data){
					item.seriesInformation = data.data.result.slice(0,3);
					dataAlong = item;
					resolve(dataAlong);
				});
			})
		}
		worDoor.postHttp = function(url,dataPost,fn){
			var myData = {};
			$http({
				url:url,
				params:dataPost,
				method:'post'
			}).then(function(data){
				var courseOnlyOrInSeries = [];
				myData.code = data.data.code;
				for(var key in  data.data.result){
					if(key == 'items'){
						myData.items = data.data.result.items;
						for(var i = 0;i<myData.items.length;i++){
							courseOnlyOrInSeries.push(getDataFun(myData.items[i]));
						}
						myData.count = data.data.result.totalItemsCount;
						break;
					}else if(key == 'resources'){
						myData.result = data.data.result;
						for(var i = 0;i<myData.result.resources.length;i++){
							courseOnlyOrInSeries.push(getDataFun(myData.result.resources[i]));
						}
						break;
					}
				}
				$q.all(courseOnlyOrInSeries).then(function(result){
					for(var key in  data.data.result){
						if(key == 'item'){
							myData.items = result;
							break;
						}else if(key == 'resources'){
							myData.result.resources = result;
						}
					} 
					fn(myData);
				})
			})
		}
		return worDoor;
}]).controller('dataLook',['$scope','$state','worDoorHttp',function($scope,$state,worDoorHttp){
	$scope.Data_Overview = Language.Data_Overview;  
	$scope.Class_Data = Language.Class_Data;
	$scope.Institution_Data = Language.Institution_Data;
	$scope.Check_According_to_The_Week = Language.Check_According_to_The_Week;
	$scope.Completion_Rate_for_This_Week = Language.Completion_Rate_for_This_Week;
    $scope.isClick = true; 
	$state.go('dataLook.dataOverview');
	$scope.orgDataList = [ 
		{val:'studentData',display:Language.Student_Data},
		{val:'tutorData',display:Language.Tutor_Data},
		{val:'orderData',display:Language.Oder_Data}, 
		{val:'seriesData',display:Language.series_contents_data},   
		{val:'courseData',display:Language.lesson_content_data}   
	]
	$scope.dataReview = function($event){  
		 $scope.isClick = true;
		 $scope.classClickOrg = false;
		 $scope.classClick = 22222;         
		$state.go('dataLook.dataOverview');   
	}
	$scope.everyData = function(val,index){
		$scope.isClick = false;
		$scope.classClickOrg = index;
		$scope.classClick = 22222;   
		$state.go('dataLook.dataAgency.' + val);
	} 
	 
	worDoorHttp.postHttp(totalDataScreenUrl,{orgId:orgId},function(data){
		if(data.code == 200){
			$scope.stuNums = data.result.stuNums;
			$scope.tutorNums = data.result.tutorNums;
			$scope.materialNums = data.result.materialNums;
			$scope.orderReqNums = data.result.orderReqNums;
			$scope.orderTotalDuration = Math.ceil(data.result.orderTotalDuration/60);  
			$scope.groupList = 	data.result.dataScreenRes;
		}  
	})  
	$scope.toBanjiDetails = function($event,groupId,index){  
		$scope.isClick = false;
		$scope.classClickOrg = false;
		$scope.classClick = index;         
		$state.go('dataLook.dataClass',{groupId:groupId});
	} 
}]).controller('dataOverview',['$scope','worDoorHttp',function($scope,worDoorHttp){
		$scope.Numbers_of_Tutors = Language.Numbers_of_Tutors;
		$scope.Numbers_of_Students = Language.Numbers_of_Students;
		$scope.Total_Numbers_of_Courses = Language.Total_Numbers_of_Courses;
		$scope.Order_Times = Language.Order_Times; 
		$scope.Order_Time = Language.Order_Time;
		$scope.orgId = userInformation.orgId; 
}]).directive('detailLook',['worDoorHttp',function(worDoorHttp){
	return{
			restrict: 'AE',  
			scope:{  
				look:'@',  
				type:'@'  
			},  
			templateUrl:'./modules/dataLook/groupDetailsLook.html',
			link: function(scope,elems,attrs){
				scope.lookDirecWeekMonth = false;
				scope.Check_According_to_The_Week = Language.Check_According_to_The_Week;
				scope.Monthly_View = Language.Monthly_View
				scope.Numbers_of_Tutors = Language.Numbers_of_Tutors;
				scope.Numbers_of_Students = Language.Numbers_of_Students;
				scope.Total_Numbers_of_Courses = Language.Total_Numbers_of_Courses;
				scope.Order_Times = Language.Order_Times;
				scope.Order_Time = Language.Order_Time;
				scope.params = {  
					groupId:scope.look,
					type:scope.type
				}
				scope.enter = function(index){
					scope.groupIndex = index;
				}     
				scope.out = function(index){   
					scope.groupIndex = index;  
				}       
				scope.chooseThis = function(index){  
					scope.params.type = index;
					oneGroupDetail(groupDataScreenUrl,scope.params);
					scope.lookDirecWeekMonth = false;
				}  
				oneGroupDetail(groupDataScreenUrl,scope.params);

				function oneGroupDetail(url,dataParams){
					worDoorHttp.postHttp(url,dataParams,function(data){
						if(data.code == 200){
							scope.lookDirec = data.result;
							scope.perent = scope.lookDirec.totalTaskNums != 0 ? parseInt(scope.lookDirec.comTaskNums/scope.lookDirec.totalTaskNums*100) : 0
							if(data.result.type==0){ 
								scope.weekLook = Language.Check_According_to_The_Week;
								scope.weekLookPer = Language.Completion_Rate_for_This_Week;
							}else{ 
								scope.weekLook = Language.Monthly_View;    
								scope.weekLookPer = Language.Monthly_Task_Completion_Rate;  
							}
							echart(('echart'+scope.look),data.result.comTaskNums,data.result.totalTaskNums);
						}
					})
				} 
				   
			}  
	}
}]).directive('detailLookZhe',['worDoorHttp','$timeout',function(worDoorHttp,$timeout){
	return{
			restrict: 'AE',  
			scope:{   
				type:'@',
				wordoor:'@'    
			},   
			templateUrl:'./modules/dataLook/dataAllZhe.html',
			link: function(scope,elems,attrs){
				scope.lookDirecWeekMonth = false;
				scope.titleContent = Language.class_order_trend;
				scope.Check_According_to_The_Week = Language.Check_According_to_The_Week;
				scope.Monthly_View = Language.Monthly_View
				scope.params = scope.type == 'All' ? {orgId:scope.wordoor,type:0} : {groupId:scope.wordoor,type:0};
				 scope.weekLook =  Language.Check_According_to_The_Week;  
				scope.enter = function(index){
					scope.groupIndex = index; 
				}     
				scope.out = function(index){   
					scope.groupIndex = index;  
				}       
				scope.chooseThis = function(index){ 
					scope.weekLook = index==0 ? Language.Check_According_to_The_Week : 	Language.Monthly_View;	
					scope.params.type = index;
					 orderLineChartFunc(orderLineChart,scope.params); 
					scope.lookDirecWeekMonth = false; 
				}  
				 orderLineChartFunc(orderLineChart,scope.params); 

				function orderLineChartFunc(url,dataParams){ 
					worDoorHttp.postHttp(url,dataParams,function(data){
						if(data.code == 200){
							echartZhe('echartZhe'+ scope.type,data.result.orderReqNums,data.result.times);  
						}
					})
				}  
				   
			}  
	}
}]).controller('dataClass',['$scope','$stateParams','$state',function($scope,$stateParams,$state){
	$scope.groupId = $stateParams.groupId;
	$scope.dataClassShow = [Language.Task,Language.students,Language.tutor,Language.Content,Language.Enter_Username_Email_Phone];
	$scope.dataStudentsShow = [Language.Name,Language.Native_Language,Language.Target_Language,Language.Learning,Language.Interest,Language.Order_Details,Language.View,Language.Times,Language.Minutes];
	$scope.dataTutorShow = [Language.Second_Language,Language.Service,Language.Service_Rating,Language.Order_Details]; 
	$scope.dataContentShow = [Language.Name_of_Series,Language.Creator,Language.Last_Updated,Language.Times_Used,Language.Tutors_Students_Times_Used,Language.series_details,Language.Lesson_Title,Language.Lesson_Rating,Language.Student_Rating_Tutor_Rating]; 
	$scope.no_data = Language.no_data;
	$scope.dataTaskShow = [Language.Monthly_Task_Completion_Rate,Language.Total_Tasks,Language.Elapsed_Days,Language.People_Completed,Language.People_Uncompleted,Language.Name,Language.Completed_Task,Language.Pending_for_Completion,Language.Uncompleted,Language.Weekly_Learning_Time,Language.Total_Learning_Time];    
	$state.go('dataLook.dataClass.classTaskData');   
	$scope.classClickGroup = 1;  
	$scope.classStudent = function(index){ 
		$scope.classClickGroup = index; 
		$state.go('dataLook.dataClass.classStudentData'); 
	}
	$scope.classTutor = function(index){ 
		$scope.classClickGroup = index; 
		$state.go('dataLook.dataClass.classTutorData');
	}  
	$scope.classContent = function(index){ 
		$scope.classClickGroup = index;
		$state.go('dataLook.dataClass.classContentData');
	}  
	$scope.classTask = function(index){
		$scope.classClickGroup = index;
		$state.go('dataLook.dataClass.classTaskData');
	} 
}]).controller('classStudentData',['$scope','worDoorHttp',function($scope,worDoorHttp){
		$scope.studentLookShow = false;
		 $scope.searchStudentClick = function(){
		 	$scope.studentDataParams.condition = $scope.searchStudent;
		 	$scope.studentDataParams.pn = 1;
		 	studentScreen($scope.studentDataParams);
		 }     
		  
		$scope.studentDetailsLook = function(userId){
			$scope.studentLookShow = true;
			$scope.userIdDirective = userId;
		} 
		$scope.closeShadow = function(){
			$scope.studentLookShow = false;
		}    
		$scope.studentDataParams =  {
			groupId:$scope.groupId,
			identity:'Student', 
			pn:1,
			ps:6
		} 
		studentScreen($scope.studentDataParams);
		function studentScreen(dataParams){
			worDoorHttp.postHttp(groupMemberDataScreenUrl,dataParams,function(data){
				$scope.studentsListGroup = data.items;
				$scope.studentsListCount = data.count;
				$scope.studentOnData = data.count == 0 ? 0 : 1;
				$scope.studentsListGroup.forEach(function(item,index){
					if(item.sex == 'Female'){
						$scope.studentsListGroup[index].sexImg = './images/female.png';
					}else{
						$scope.studentsListGroup[index].sexImg = './images/male.png';
					}
					$scope.studentsListGroup[index].orderTotalDuration = parseInt(item.orderTotalDuration/60);
				})
				if($scope.studentsListCount>6){
					$scope.studentsListGroupPaging = true;
					$(".tcdPageCode").createPage({
		            	 	pageCount: Math.ceil($scope.studentsListCount / 6) || 1,
		                    current:$scope.studentDataParams.pn,
		                    backFn: function (p) {
		                        $scope.studentDataParams.pn = p;
		                        worDoorHttp.postHttp(groupMemberDataScreenUrl,$scope.studentDataParams,function(data){
									$scope.studentsListGroup = data.items;
									$scope.studentsListGroup.forEach(function(item,index){
										if(item.sex == 'Female'){
											$scope.studentsListGroup[index].sexImg = './images/female.png';
										}else{
											$scope.studentsListGroup[index].sexImg = './images/male.png';
										}
										$scope.studentsListGroup[index].orderTotalDuration = parseInt(item.orderTotalDuration/60);
									})
								})
		                    }
		                })
				}else{
					$scope.studentsListGroupPaging = false;
				}
			})
		}		
}]).controller('classTutorData',['$scope','worDoorHttp',function($scope,worDoorHttp){
	$scope.tutorLookShow = false;
	$scope.searchTutorClick = function(){
		$scope.tutorDataParams.condition = $scope.searchTutor;
		$scope.tutorDataParams.pn = 1;  
		tutorScreen($scope.tutorDataParams);
	}
	$scope.tutorDetailsLook = function(userId){
		$scope.tutorLookShow = true;
		$scope.userIdDirective = userId;  
	}  
	$scope.closeShadow = function(){
		$scope.tutorLookShow = false;
	}
	$scope.tutorDataParams = {
			groupId:$scope.groupId,
			identity:'Tutor',
			pn:1, 
			ps:6    
		}  
	tutorScreen($scope.tutorDataParams);  
	function tutorScreen(dataParams){
		worDoorHttp.postHttp(groupMemberDataScreenUrl,dataParams,function(data){
			$scope.tutorsListGroup = data.items;
			$scope.tutorsListCount = data.count;
			$scope.tutorOnData = data.count == 0 ? 0 : 1;
			$scope.tutorsListGroup.forEach(function(item,index){
				if(item.sex == 'Female'){
					$scope.tutorsListGroup[index].sexImg = './images/female.png';
				}else{  
					$scope.tutorsListGroup[index].sexImg = './images/male.png';
				}
				$scope.tutorsListGroup[index].orderTotalDuration = parseInt(item.orderTotalDuration/60);
			})
			if($scope.tutorsListCount>6){
					$scope.tutorsListGroupPaging = true;
					$(".tcdPageCode").createPage({
		            	 	pageCount: Math.ceil($scope.tutorsListCount / 6) || 1,
		                    current:$scope.tutorDataParams.pn,
		                    backFn: function (p) {
		                        $scope.tutorDataParams.pn = p;
		                        worDoorHttp.postHttp(groupMemberDataScreenUrl,$scope.tutorDataParams,function(data){
									$scope.tutorsListGroup = data.items;
									$scope.tutorsListGroup.forEach(function(item,index){
										if(item.sex == 'Female'){
											$scope.tutorsListGroup[index].sexImg = './images/female.png';
										}else{
											$scope.tutorsListGroup[index].sexImg = './images/male.png';
										}
										$scope.tutorsListGroup[index].orderTotalDuration = parseInt(item.orderTotalDuration/60);
									})
								})  
		                    }
		                })
				}else{
					$scope.tutorsListGroupPaging = false;
				}
		})
	}
}]).directive('stuAndTutDetails',['worDoorHttp',function(worDoorHttp){
	return {
		restrict: 'AE',
			scope:{
				userid:'@',  
				identity:'@', 
				groupid:'@'
			},           
			templateUrl:'./modules/dataLook/studentAndTutorDetails.html',
			link: function(scope,elems,attrs){ 
				scope.studentOrderDetailsParams = {
				 	identity:scope.identity,
					user:scope.userid,
					pn:1,   
					ps:3  
				}  
				if(scope.groupid){
					scope.studentOrderDetailsParams.groupId = scope.groupid;
				}else{   
					scope.studentOrderDetailsParams.orgId = orgId;   
				}
				scope.orderDataShow = [Language.Time,Language.This_Week,Language.Last_Week,Language.This_Month,Language.Last_Month,Language.Lesson,Language.Answered_by_Tutor,Language.Lesson_Duration,Language.Student_Rating,Language.Tutor_Rating,Language.Starting_Time,Language.no_data,Language.Minutes];
				scope.orderDataShow[6] = scope.identity == 'Student' ? Language.Answered_by_Tutor : Language.Requested_by_Student;
				scope.chooseDateRange = function(){
					laydate.render({elem: '#dateRangeChoose',range: true,calendar: true,format: 'yyyy/MM/dd',done:function(value, date, endDate){
						var start = value.split(' - ')[0]; 
						var end = value.split(' - ')[1];
						scope.studentOrderDetailsParams.startTime = start; 
						scope.studentOrderDetailsParams.endTime = end;
						scope.studentOrderDetailsParams.pn = 1;
						studentOrderDetails(scope.studentOrderDetailsParams);
					}}); 
				}
				scope.chooseThisWeek = function(){
					var thisWeekShow = showThisWeek().start + ' - ' + showThisWeek().end;
					$('#dateRangeChoose').html(thisWeekShow);
					var start = showThisWeek().start.replace(/\//g,'-');
					var end = showThisWeek().end.replace(/\//g,'-');
					scope.studentOrderDetailsParams.startTime = start;
					scope.studentOrderDetailsParams.endTime = end;
					scope.studentOrderDetailsParams.pn = 1;
					studentOrderDetails(scope.studentOrderDetailsParams); 
				}  
				scope.chooseLastWeek = function(){
					var thisWeekShow = showLastWeek().start + ' - ' + showLastWeek().end;
					$('#dateRangeChoose').html(thisWeekShow);
					var start = showLastWeek().start.replace(/\//g,'-');
					var end = showLastWeek().end.replace(/\//g,'-');
					scope.studentOrderDetailsParams.startTime = start;
					scope.studentOrderDetailsParams.endTime = end;
					scope.studentOrderDetailsParams.pn = 1; 
					studentOrderDetails(scope.studentOrderDetailsParams); 
				}
				scope.chooseThisMonth = function(){
					var thisWeekShow = showThisMonth().start + ' - ' + showThisMonth().end;
					$('#dateRangeChoose').html(thisWeekShow);
					var start = showThisMonth().start.replace(/\//g,'-');
					var end = showThisMonth().end.replace(/\//g,'-');
					scope.studentOrderDetailsParams.startTime = start;
					scope.studentOrderDetailsParams.endTime = end;
					scope.studentOrderDetailsParams.pn = 1;
					studentOrderDetails(scope.studentOrderDetailsParams); 
				}
				scope.chooseLastMonth = function(){
					var thisWeekShow = showLastMonth().start + ' - ' + showLastMonth().end;
					$('#dateRangeChoose').html(thisWeekShow);
					var start = showLastMonth().start.replace(/\//g,'-');
					var end = showLastMonth().end.replace(/\//g,'-');
					scope.studentOrderDetailsParams.startTime = start;
					scope.studentOrderDetailsParams.endTime = end;
					scope.studentOrderDetailsParams.pn = 1;
					studentOrderDetails(scope.studentOrderDetailsParams);  
				}      
				studentOrderDetails(scope.studentOrderDetailsParams); 
				function studentOrderDetails(dataParams){
					worDoorHttp.postHttp(groupMemberOrderDataListUrl,dataParams,function(data){
						scope.groupMemberStuOrderDataList = data.items;
						scope.studentsListDetailsCount = data.count;
						scope.studentOnDataDetails = data.count == 0 ? 0 : 1;
						scope.groupMemberStuOrderDataList.forEach(function(item,index){
							scope.groupMemberStuOrderDataList[index].duration = parseInt(item.duration/60);
						})
						if(scope.studentsListDetailsCount>3){
							scope.studentsListDetailsPaging = true;
							$(".tcdPageCodeDetail").createPage({     
				            	 	pageCount: Math.ceil(scope.studentsListDetailsCount / 3) || 1,
				                    current:scope.studentOrderDetailsParams.pn,
				                    backFn: function (p) {
				                        scope.studentOrderDetailsParams.pn = p;
				                        worDoorHttp.postHttp(groupMemberOrderDataListUrl,scope.studentOrderDetailsParams,function(data){
											scope.groupMemberStuOrderDataList = data.items;
											scope.groupMemberStuOrderDataList.forEach(function(item,index){
												scope.groupMemberStuOrderDataList[index].duration = parseInt(item.duration/60);
											})
										}) 
				                    }  
				                })
						}else{
							scope.studentsListDetailsPaging = false;
						}
					}) 
				}
						
			}
	}
}]).controller('classContentData',['$scope','worDoorHttp',function($scope,worDoorHttp){
		$scope.contentLookShow = false;
		$scope.seriesDetailsLook = function(seriesId){
			$scope.contentLookShow = true;
			$scope.groupContentSeriesDetailsParams.seriesId = seriesId;
			groupContentSeriesDataDetails($scope.groupContentSeriesDetailsParams)
		}
		$scope.closeShadow = function(){
			$scope.contentLookShow = false;
		}
		$scope.searchContentClick = function(){
			$scope.groupContentSeriesParams.condition = $scope.searchContent;
			groupContentSeriesDataList($scope.groupContentSeriesParams);
		}
		$scope.groupContentSeriesParams = {
			groupId:$scope.groupId, 
			pn:1,     
			ps:6    
		}  
		$scope.groupContentSeriesDetailsParams = {
			pn:1,      
			ps:4    
		}   
		groupContentSeriesDataList($scope.groupContentSeriesParams);
		function groupContentSeriesDataDetails(dataParams){
			worDoorHttp.postHttp(groupContentMaterialDataListUrl,dataParams,function(data){
				$scope.groupContentSeriesDetailsData = data.items;
				$scope.groupContentSeriesDetailsCount = data.count;
				$scope.contentOnDataDetails = data.count == 0 ? 0 : 1;
				if($scope.groupContentSeriesDetailsCount>4){
					$scope.contentListDetailsPaging = true;
					$(".tcdPageCodeDetail").createPage({
		            	 	pageCount: Math.ceil($scope.groupContentSeriesDetailsCount / 4) || 1,
		                    current:$scope.groupContentSeriesDetailsParams.pn,
		                    backFn: function (p) {
		                        $scope.groupContentSeriesDetailsParams.pn = p;
		                        worDoorHttp.postHttp(groupContentMaterialDataListUrl,$scope.groupContentSeriesDetailsParams,function(data){
									$scope.groupContentSeriesDetailsData = data.items;
								})    
		                    }
		                })  
				}else{
					$scope.contentListDetailsPaging = false;
				}
			})
		}
		function groupContentSeriesDataList(dataParams){
			worDoorHttp.postHttp(groupContentSeriesDataListUrl,dataParams,function(data){
				$scope.groupContentSeriesData = data.items;
				$scope.groupContentCount = data.count;
				$scope.contentOnData = data.count == 0 ? 0 : 1;
				if($scope.groupContentCount>6){
					$scope.contentListGroupPaging = true;
					$(".tcdPageCode").createPage({
		            	 	pageCount: Math.ceil($scope.groupContentCount / 6) || 1,
		                    current:$scope.groupContentSeriesParams.pn,
		                    backFn: function (p) {
		                        $scope.groupContentSeriesParams.pn = p;
		                        worDoorHttp.postHttp(groupContentSeriesDataListUrl,$scope.groupContentSeriesParams,function(data){
									$scope.groupContentSeriesData = data.items;
								})  
		                    }  
		                })  
				}else{
					$scope.contentListGroupPaging = false;
				} 
			})    
		} 	 
}]).controller('classTaskData',['$scope','worDoorHttp',function($scope,worDoorHttp){

	$scope.groupMemberTaskSearch = function(){
		$scope.groupMemberTaskData.pn = 1;
		$scope.groupMemberTaskData.condition = $scope.groupMemberTaskContent;
		groupMemberTaskFunc($scope.groupMemberTaskData);

	}  
	worDoorHttp.postHttp(groupTaskDataUrl,{groupId:$scope.groupId},function(data){
		$scope.totalTaskNums = data.result.totalTaskNums;
		$scope.dayNums = data.result.dayNums; 
		$scope.comUserNums = data.result.comUserNums;
		$scope.unComUserNums = data.result.unComUserNums; 
		$scope.weekComNums = data.result.weekComNums;
		$scope.totalWeekNums = data.result.totalWeekNums;
		$scope.monthComNums = data.result.monthComNums;
		$scope.totalMonthNums = data.result.totalMonthNums;
		echart('echartWeeks',$scope.weekComNums,$scope.totalWeekNums);
		echart('echartMonths',$scope.monthComNums,$scope.totalMonthNums); 
	})  
	$scope.groupMemberTaskData = {
		groupId:$scope.groupId,
		pn:1, 
		ps:4  
	}   
	groupMemberTaskFunc($scope.groupMemberTaskData);
	function groupMemberTaskFunc(dataParams){  
		worDoorHttp.postHttp(groupMemberTaskDataUrl,dataParams,function(data){
			 $scope.groupMemberTaskList = data.items;
			 $scope.groupMemberTaskCount = data.count;
			 $scope.groupMemberTaskShow = data.count == 0 ? 0 : 1;
			 $scope.groupMemberTaskList.forEach(function(item,index){
				if(item.sex == 'Female'){ 
					$scope.groupMemberTaskList[index].sexImg = './images/female.png';
				}else{ 
					$scope.groupMemberTaskList[index].sexImg = './images/male.png';
				}
			})
			 if($scope.groupMemberTaskCount>4){  
					$scope.groupMemberTaskPaging = true;
					$(".tcdPageCode").createPage({ 
		            	 	pageCount: Math.ceil($scope.groupMemberTaskCount / 4) || 1,
		                    current:$scope.groupMemberTaskData.pn,       
		                    backFn: function (p) {
		                        $scope.groupMemberTaskData.pn = p;
		                        worDoorHttp.postHttp(groupMemberTaskDataUrl,$scope.groupMemberTaskData,function(data){
									$scope.groupMemberTaskList = data.items;
									$scope.groupMemberTaskList.forEach(function(item,index){
										if(item.sex == 'Female'){
											$scope.groupMemberTaskList[index].sexImg = './images/female.png';
										}else{
											$scope.groupMemberTaskList[index].sexImg = './images/male.png';
										}  
									})
								})      
		                    }  
		                })
				}else{ 
					$scope.groupMemberTaskPaging = false;
				}
		})     
	}	  
}]).controller('dataAgency',['$scope','$state','worDoorHttp',function($scope,$state,worDoorHttp){
	worDoorHttp.postHttp(groupListUrl,{id:orgId,pn:1,ps:100},function(data){  
			$scope.orgGroupList = data.items; 
		})
	$scope.no_data = Language.no_data;
	$scope.dataFilterShow = [Language.Gender,Language.All,Language.Native_Language,Language.Target_Language,Language.Group_Belonging_To,Language.Name,Language.Learning,Language.Registration_Time,Language.Interest,Language.Order_Details,Language.Times,Language.Minutes,Language.View,Language.Enter_Username_Email_Phone,Language.Second_Language,Language.Service_Rating,Language.language,Language.difficulty,Language.type]; 
	$scope.dataContentShow = [Language.Name_of_Series,Language.Creator,Language.Last_Updated,Language.Times_Used,Language.Tutors_Students_Times_Used,Language.series_details,Language.Lesson_Title,Language.Lesson_Rating,Language.Student_Rating_Tutor_Rating]; 
	$scope.orderDataShow = [Language.Requested_Language,Language.students,Language.Lesson,Language.Answered_by_Tutor,Language.Lesson_Duration,Language.Student_Rating,Language.Tutor_Rating];
	$scope.sexDatas = [{  
		value:'Male',  
		display:Language.Male
	},{  
		value:'Female',
		display:Language.Female    
	}];
	worDoorHttp.postHttp(categoriesUrl,{lang:Lang},function(data){  
			$scope.categoriesList = data.result;
		})   
	worDoorHttp.postHttp(difficultiesUrl,{lang:Lang},function(data){  
			$scope.difficultiesList = data.result;   
		})
	worDoorHttp.postHttp(native_languagesUrl,{lang:Lang},function(data){  
		$scope.languageList = data.result;   
	}) 
	worDoorHttp.postHttp(orgCourseReviewUrl,{orgId:orgId},function(data){
		if(data.code == 200){
			$scope.courseReviewList = data.result; 
		}
	})    
}]).controller('studentData',['$scope','worDoorHttp',function($scope,worDoorHttp){

		$scope.chooseSexStu = function(){
			$scope.orgStudentData.sex = $scope.sexGet;
			$scope.orgStudentData.pn = 1;
			orgStudentFunc($scope.orgStudentData);
		}   
		$scope.chooseNativeLanguageStu = function(){
			$scope.orgStudentData.nativeLanguage = $scope.nativeLanguageGet;
			$scope.orgStudentData.pn = 1;
			orgStudentFunc($scope.orgStudentData);
		} 
		$scope.chooseLearningLanguageStu = function(){
			$scope.orgStudentData.learningLanguage = $scope.learningLanguageGet;
			$scope.orgStudentData.pn = 1;
			orgStudentFunc($scope.orgStudentData);
		}
		$scope.chooseGroupStu = function(){
			$scope.orgStudentData.groupId = $scope.groupGet;
			$scope.orgStudentData.pn = 1;
			orgStudentFunc($scope.orgStudentData);
		}
		$scope.searchStudent = function(){
			$scope.orgStudentData.condition = $scope.searchContentStu;
			$scope.orgStudentData.pn = 1; 
			orgStudentFunc($scope.orgStudentData);
		}
		$scope.orgStudentData = {
			orgId:orgId,
			pn:1,
			ps:6,
			identity:'Student'
		} 
		
		$scope.closeShadow = function(){
			$scope.studentLookShow = false;
		}  
		$scope.studentDetailsLook = function(userId){
			$scope.studentLookShow = true;
			$scope.userIdDirective = userId;
		}  
		orgStudentFunc($scope.orgStudentData);

		function orgStudentFunc(dataPost){
			worDoorHttp.postHttp(organizationMemberUrl,dataPost,function(data){
				$scope.orgStudentListData = data.items;
				$scope.orgStudentListCount = data.count;
				 $scope.orgStudentListDataShow = data.count == 0 ? 0 : 1;
				 $scope.orgStudentListData.forEach(function(item,index){
					if(item.sex == 'Female'){
						$scope.orgStudentListData[index].sexImg = './images/female.png';
					}else{
						$scope.orgStudentListData[index].sexImg = './images/male.png';
					}  
					$scope.orgStudentListData[index].orderTotalDuration = parseInt(item.orderTotalDuration/60); 
				})
				 if($scope.orgStudentListCount>6){  
					$scope.orgStudentListPaging = true;
					$(".tcdPageCode").createPage({ 
		            	 	pageCount: Math.ceil($scope.orgStudentListCount / 6) || 1,
		                    current:$scope.orgStudentData.pn,          
		                    backFn: function (p) {
		                        $scope.orgStudentData.pn = p; 
		                        worDoorHttp.postHttp(organizationMemberUrl,$scope.orgStudentData,function(data){
									$scope.orgStudentListData = data.items;
									$scope.orgStudentListData.forEach(function(item,index){
										if(item.sex == 'Female'){
											$scope.orgStudentListData[index].sexImg = './images/female.png';
										}else{
											$scope.orgStudentListData[index].sexImg = './images/male.png';
										} 
										$scope.orgStudentListData[index].orderTotalDuration = parseInt(item.orderTotalDuration/60);  
									})
								})    
		                    }  
		                })
				}else{ 
					$scope.orgStudentListPaging = false;
				}
			})
		}
}]).controller('tutorData',['$scope','worDoorHttp',function($scope,worDoorHttp){ 
		$scope.chooseSexTut = function(){ 
			$scope.orgTutorData.sex = $scope.sexGet;
			$scope.orgTutorData.pn = 1;
			orgTutorFunc($scope.orgTutorData);
		}    
		$scope.chooseNativeLanguageTut = function(){
			$scope.orgTutorData.nativeLanguage = $scope.nativeLanguageGet;
			$scope.orgTutorData.pn = 1;
			orgTutorFunc($scope.orgTutorData);
		} 
		$scope.chooseLearningLanguageTut = function(){
			$scope.orgTutorData.secLanguage = $scope.learningLanguageGet;
			$scope.orgTutorData.pn = 1;   
			orgTutorFunc($scope.orgTutorData);
		}
		$scope.chooseGroupTut = function(){
			$scope.orgTutorData.groupId = $scope.groupGet;
			$scope.orgTutorData.pn = 1;
			orgTutorFunc($scope.orgTutorData);
		}
		$scope.searchTutor = function(){
			$scope.orgTutorData.condition = $scope.searchContentTut;
			$scope.orgTutorData.pn = 1; 
			orgTutorFunc($scope.orgTutorData);
		}

		$scope.tutorDetailsLook = function(userId){ 
			$scope.tutorLookShow = true;  
			$scope.userIdDirective = userId;    
		}   
		$scope.closeShadow = function(){
			$scope.tutorLookShow = false;
		}
		$scope.orgTutorData = {
			orgId:orgId,
			pn:1,
			ps:6,
			identity:'Tutor'
		}  

		orgTutorFunc($scope.orgTutorData);
		  
		function orgTutorFunc(dataPost){
			worDoorHttp.postHttp(organizationMemberUrl,dataPost,function(data){
				$scope.orgTutorListData = data.items;
				$scope.orgTutorListCount = data.count;
				 $scope.orgTutorListDataShow = data.count == 0 ? 0 : 1;
				 $scope.orgTutorListData.forEach(function(item,index){
					if(item.sex == 'Female'){
						$scope.orgTutorListData[index].sexImg = './images/female.png';
					}else{
						$scope.orgTutorListData[index].sexImg = './images/male.png';
					}  
					$scope.orgTutorListData[index].orderTotalDuration = parseInt(item.orderTotalDuration/60);   
				}) 
				 if($scope.orgTutorListCount>6){  
					$scope.orgTutorListPaging = true;
					$(".tcdPageCode").createPage({ 
		            	 	pageCount: Math.ceil($scope.orgTutorListCount / 6) || 1,
		                    current:$scope.orgTutorData.pn,          
		                    backFn: function (p) {
		                        $scope.orgTutorData.pn = p;
		                        worDoorHttp.postHttp(organizationMemberUrl,$scope.orgTutorData,function(data){
									$scope.orgTutorListData = data.items;
									$scope.orgTutorListData.forEach(function(item,index){
										if(item.sex == 'Female'){
											$scope.orgTutorListData[index].sexImg = './images/female.png';
										}else{
											$scope.orgTutorListData[index].sexImg = './images/male.png';
										} 
										$scope.orgTutorListData[index].orderTotalDuration = parseInt(item.orderTotalDuration/60);  
									})
								})    
		                    }  
		                }) 
				}else{  
					$scope.orgTutorListPaging = false;
				}
			})
		}  
}]).controller('orderData',['$scope','worDoorHttp',function($scope,worDoorHttp){
		$scope.searchContentClick = function(){
			$scope.orderOrgData.pn = 1; 
			$scope.orderOrgData.condition = $scope.searchContent;
			orgOrderListFunc($scope.orderOrgData);
		}   
		$scope.chooseNativeLanguage = function(){
			$scope.orderOrgData.pn = 1; 
			$scope.orderOrgData.nativeLanguage = $scope.nativeLanguageGet;
			orgOrderListFunc($scope.orderOrgData);
		}   
		$scope.orderNativeLanguage = function(){
			$scope.orderOrgData.pn = 1; 
			$scope.orderOrgData.serviceLanguage = $scope.orderLanguageGet;
			orgOrderListFunc($scope.orderOrgData);  
		}  
		$scope.chooseGroup = function(){  
			$scope.orderOrgData.pn = 1; 
			$scope.orderOrgData.groupId = $scope.groupGet;
			orgOrderListFunc($scope.orderOrgData);
		} 
		$scope.orderOrgData = { 
			orgId:orgId,
			pn:1,
			ps:4
		}
		orgOrderListFunc($scope.orderOrgData);
		function orgOrderListFunc(dataParams){
			worDoorHttp.postHttp(organizationOrderDataUrl,dataParams,function(data){
				$scope.orgOrderListData = data.items;
				$scope.orgOrderListCount = data.count; 
				$scope.contentOnData = data.count == 0 ? 0 : 1;
				 $scope.orgOrderListData.forEach(function(item,index){
					if(item.sex == 'Female'){
						$scope.orgOrderListData[index].sexImg = './images/female.png';
					}else{
						$scope.orgOrderListData[index].sexImg = './images/male.png';
					} 
					$scope.orgOrderListData[index].orderduration = parseInt(item.orderduration/60);     
				})     
				if($scope.orgOrderListCount>4){   
					$scope.orgOrderListPaging = true;
					$(".tcdPageCode").createPage({
		            	 	pageCount: Math.ceil($scope.orgOrderListCount / 4) || 1,
		                    current:$scope.orderOrgData.pn,  
		                    backFn: function (p) { 
		                        $scope.orderOrgData.pn = p;
		                        worDoorHttp.postHttp(organizationOrderDataUrl,$scope.orderOrgData,function(data){
									$scope.orgOrderListData = data.items;
									 $scope.orgOrderListData.forEach(function(item,index){
										if(item.sex == 'Female'){
											$scope.orgOrderListData[index].sexImg = './images/female.png';
										}else{
											$scope.orgOrderListData[index].sexImg = './images/male.png';
										}  
										$scope.orgOrderListData[index].orderduration = parseInt(item.orderduration/60);     
									}) 
								})  
		                    }  
		                })
				}else{  
					$scope.orgOrderListPaging = false;
				} 
			})     
		} 
}]).controller('seriesData',['$scope',"worDoorHttp",function($scope,worDoorHttp){
		$scope.SeriesParams = {
			orgId:orgId,  
			pn:1,       
			ps:4     
		} 
		$scope.SeriesDetailsParams = {
			pn:1,      
			ps:4    
		} 
		$scope.contentLookShow = false;
		$scope.seriesDetailsLook = function(seriesId){
			$scope.contentLookShow = true;
			$scope.SeriesDetailsParams.seriesId = seriesId;
			groupContentSeriesDataDetails($scope.SeriesDetailsParams)
		}      
		$scope.closeShadow = function(){ 
			$scope.contentLookShow = false;
		}  
		$scope.searchContentClick = function(){
			$scope.SeriesParams.pn = 1;  
			$scope.SeriesParams.condition = $scope.searchContent;
			SeriesDataList($scope.SeriesParams);
		}
		$scope.chooseLanguage = function(){ 
			$scope.SeriesParams.pn = 1; 
			$scope.SeriesParams.serviceLanguage = $scope.languageGet;
			SeriesDataList($scope.SeriesParams);
		}
		$scope.chooseCategories = function(){
			$scope.SeriesParams.pn = 1; 
			$scope.SeriesParams.category = $scope.categoriesData;
			SeriesDataList($scope.SeriesParams);
		} 
		$scope.chooseDifficulties = function(){
			$scope.SeriesParams.pn = 1; 
			$scope.SeriesParams.difficulty = $scope.difficultiesData;
			SeriesDataList($scope.SeriesParams);
		} 
		$scope.chooseGroup = function(){
			$scope.SeriesParams.pn = 1; 
			$scope.SeriesParams.groupId = $scope.groupGet;
			SeriesDataList($scope.SeriesParams);
		}
		SeriesDataList($scope.SeriesParams); 
		function SeriesDataList(dataParams){
			worDoorHttp.postHttp(groupContentSeriesDataListUrl,dataParams,function(data){
				$scope.SeriesData = data.items;
				$scope.Count = data.count;
				$scope.contentOnData = data.count == 0 ? 0 : 1;
				if($scope.Count>4){
					$scope.contentListPaging = true; 
					$(".tcdPageCode").createPage({
		            	 	pageCount: Math.ceil($scope.Count / 4) || 1,
		                    current:$scope.SeriesParams.pn,
		                    backFn: function (p) {
		                        $scope.SeriesParams.pn = p;
		                        worDoorHttp.postHttp(groupContentSeriesDataListUrl,$scope.SeriesParams,function(data){
									$scope.SeriesData = data.items;
								})  
		                    }  
		                })
				}else{
					$scope.contentListPaging = false;
				}  
			})       
		}
		function groupContentSeriesDataDetails(dataParams){
			worDoorHttp.postHttp(groupContentMaterialDataListUrl,dataParams,function(data){
				$scope.groupContentSeriesDetailsData = data.items;
				$scope.groupContentSeriesDetailsCount = data.count;
				$scope.contentOnDataDetails = data.count == 0 ? 0 : 1;
				if($scope.groupContentSeriesDetailsCount>4){ 
					$scope.contentListDetailsPaging = true;
					$(".tcdPageCodeDetail").createPage({
		            	 	pageCount: Math.ceil($scope.groupContentSeriesDetailsCount / 4) || 1,
		                    current:$scope.SeriesDetailsParams.pn,
		                    backFn: function (p) {
		                        $scope.SeriesDetailsParams.pn = p;
		                        worDoorHttp.postHttp(groupContentMaterialDataListUrl,$scope.SeriesDetailsParams,function(data){
									$scope.groupContentSeriesDetailsData = data.items;
								})     
		                    }  
		                })
				}else{
					$scope.contentListDetailsPaging = false;
				} 
			})  
		} 
}]).controller('courseData',['$scope','worDoorHttp',function($scope,worDoorHttp){  
		$scope.CourseParams = {
			source:orgId,   
			pn:1,        
			ps:4      
		} 
		
		$scope.searchContentClick = function(){
			$scope.CourseParams.pn = 1;  
			$scope.CourseParams.condition = $scope.searchContent;
			CourseDataList($scope.CourseParams);
		}  
		$scope.chooseLanguage = function(){
			$scope.CourseParams.pn = 1; 
			$scope.CourseParams.serviceLanguage = $scope.languageGet;
			CourseDataList($scope.CourseParams);
		}
		$scope.chooseCategories = function(){
			$scope.CourseParams.pn = 1; 
			$scope.CourseParams.category = $scope.categoriesData;
			CourseDataList($scope.CourseParams);
		} 
		$scope.chooseDifficulties = function(){
			$scope.CourseParams.pn = 1; 
			$scope.CourseParams.difficulty = $scope.difficultiesData;
			CourseDataList($scope.CourseParams);
		} 
		$scope.chooseGroup = function(){ 
			$scope.CourseParams.pn = 1; 
			$scope.CourseParams.groupId = $scope.groupGet;
			CourseDataList($scope.CourseParams);
		} 
		CourseDataList($scope.CourseParams); 
		function CourseDataList(dataParams){ 
			worDoorHttp.postHttp(orgCourseDataUrl,dataParams,function(data){
				 data.items.forEach(function(item,index){
				 	data.items[index].updatedAt = format(item.updatedAt);
				 })  
				$scope.CourseData = data.items;  
				$scope.Count = data.count;  
				$scope.contentOnData = data.count == 0 ? 0 : 1;
				if($scope.Count>4){
					$scope.contentListPaging = true; 
					$(".tcdPageCode").createPage({
		            	 	pageCount: Math.ceil($scope.Count / 4) || 1,
		                    current:$scope.CourseParams.pn,
		                    backFn: function (p) {
		                        $scope.CourseParams.pn = p;
		                        worDoorHttp.postHttp(orgCourseDataUrl,$scope.CourseParams,function(data){
		                        	 data.items.forEach(function(item,index){
									 	data.items[index].updatedAt = format(item.updatedAt); 
									 })    
									$scope.CourseData = data.items;
								})  
		                    }   
		                })
				}else{
					$scope.contentListPaging = false;
				} 
			})     
		} 
}]).controller("security",["$scope","worDoorHttp",function($scope,worDoorHttp){
		worDoorHttp.postHttp(langOrgUrl,{id:orgId,lang:Lang},function(data){
				if(data.code == 200){
					$scope.languageListChoose = data.result;
					$scope.memberLangShow = $scope.languageListChoose[0].name;
				}
		})
		$scope.addMember = false;
		$scope.editMember = false;
		$scope.memberId = false;
		$scope.memberLang = false;
		$scope.securityPaging = false;
		$scope.memberIdShow = Language.Edit_Content;
		$scope.memberIdShow1 = Language.administrator;
		$scope.memberIdShow2 = Language.Edit_Content;
		$scope.memberIdShow3 = Language.Auditor;
		$scope.memberId1 = '1';
		$scope.memberId2 = '2';
		$scope.memberId3 = '3';
		$scope.newUserShow = false;
		$scope.memberIdPost  = 2;
		$scope.params = {
				id:orgId,
				lang:Lang,
				pn:1,
				ps:7
		}
		/*翻译变量*/
		$scope.userName = Language.user_name;
		$scope.language = Language.language;
		$scope.userIdfidente = Language.user_identity;
		$scope.courseCount = Language.number_of_courses;
		$scope.inviteMembers = Language.invite;
		$scope.Search = Language.Search;
		$scope.Close = Language.cancel;
		$scope.Confirm = Language.Confirm;
		$scope.Edit_members = Language.Edit_members;
		$scope.Enter_mobile_email = Language.Enter_mobile_email;
		$scope.mobile_email = Language.mobile_email;
		$scope.avater = Language.avater;
		$scope.Edit = Language.edit;
		$scope.Remove = Language.remove;
		$scope.Sorry_no_relevant = Language.Sorry_no_relevant;
		$scope.editMembers = function(index){
			$scope.userMessage = $scope.memberList[index];
			if($scope.userMessage.roleId == '1'){  
				$scope.memberIdShow = $scope.memberIdShow1;
			}else if($scope.userMessage.roleId == '2'){
				$scope.memberIdShow = $scope.memberIdShow2;
			}else{
				$scope.memberIdShow = $scope.memberIdShow3;
			}
			$scope.memberLangShow = $scope.userMessage.orgLanguage.name;
			
			$scope.memberLangPost = $scope.userMessage.orgLanguage.value;
			$scope.memberIdPost = $scope.userMessage.roleId;
			$scope.editMember = true;
		}
		$scope.editMemberClose = function(){
			$scope.editMember = false;
		}
		$scope.editMemberSave = function(){
			$scope.editMembersPost = {
				id:$scope.userMessage.id,
				roleId:$scope.memberIdPost,
				user:$scope.userMessage.userId,
				orgId:orgId,
				lang:$scope.memberLangPost
			}
			worDoorHttp.postHttp(securityAddAdminUrl,$scope.editMembersPost,function(data){
				if(data.code == 200){
					securityList(securityUrl,$scope.params);
				}
			})
			$scope.editMember = false;
		}
		$scope.removeMembers = function(id){
			deleteDialogPlan(function(){
				worDoorHttp.postHttp(securityRemoveUrl,{id:id},function(data){
					if(data.code == 200){
						securityList(securityUrl,$scope.params);
					}
				})
			},function(){
				
			},Language.you_want_to_remove_this,Language.remove); 
		}
		/*添加成员的相关方法*/
		$scope.invite = function(){
			$scope.addMember = true;
			$scope.memberLangPost = $scope.languageListChoose[0].value;
			$scope.memberLangShow = $scope.languageListChoose[0].name;
			$scope.memberIdPost = $scope.memberId2;
			$scope.memberIdShow = Language.Edit_Content;
		}
		$scope.closeShodow = function($event){
			$scope.addMember = false;
			$scope.newUserShow = false;
			$scope.searchName = '';
			securityList(securityUrl,$scope.params);
		}
		$scope.showLiId = function($event){
			$scope.memberId = !$scope.memberId;
			$scope.memberLang = false;
			$event.stopPropagation();
		}
		$scope.showLiLang = function($event){
			$scope.memberLang = !$scope.memberLang;
			$scope.memberId = false;
			$event.stopPropagation();
		}
		$scope.closeListAll = function(){ 
			$scope.memberId = false;
			$scope.memberLang = false;
		}
		$scope.chooseId = function(index){
			if(index == '1'){
				$scope.memberIdShow = $scope.memberIdShow1;
			}else if(index == '2'){
				$scope.memberIdShow = $scope.memberIdShow2;
			}else{
				$scope.memberIdShow = $scope.memberIdShow3;
			}
			$scope.memberIdPost = index;
			$scope.memberId = false;
		}
		$scope.chooseLang = function(userLang,name){
			$scope.memberLangPost = userLang;
			$scope.memberLangShow = name;
			$scope.memberLang = false;
		}
		
		/*添加时的搜索模块*/
		$scope.search = function(){
			$scope.newUserShow = true;
			$scope.userListNew = [];
			worDoorHttp.postHttp(securitySearchUrl,{q:$scope.searchName,userId:userInformation.userId,pn:1,ps:100},function(data){
					if(data.count == 0){
						$scope.userNoData = true;
					}else{
						$scope.userNoData = false;
						data.items.forEach(function(item,index){
							item.addBtn = Language.add;
						})
						$scope.userListNew = data.items;
					}
					
			})
		}
		$scope.searchAdd = function(id,index){
			worDoorHttp.postHttp(securityAddAdminUrl,{id:-1,orgId:orgId,roleId:$scope.memberIdPost,user:id,lang:$scope.memberLangPost},function(data){
				if(data.code == 200){
					$scope.userListNew[index].addBtn = Language.added;
				}else if(data.code == 991){
					alert(Language.Have_already_been_added);
				}else if(data.code== 997){
					alert('用户不存在！');
				}
					
			})
		}
		securityList(securityUrl,$scope.params);
		
		function securityList(url,postData){
			worDoorHttp.postHttp(url,postData,function(data){
				$scope.memberList = data.items;
				$scope.allMembers = Language.total_members+data.count;
				if (data.count > 7) {
					$scope.securityPaging = true;
		            $(".tcdPageCode").createPage({
		                    pageCount: Math.ceil(data.count / 7) || 1,
		                    current:$scope.params.pn,
		                    backFn: function (p) {
		                        $scope.params.pn = p;
		                        worDoorHttp.postHttp(securityUrl,$scope.params,function(data){
									$scope.memberList = data.items;
								})
		                    }
		                })
		        } else {
		             $scope.securityPaging = false;
		        }
			});
		}	
}]).controller("group",["$scope",'$state','worDoorHttp',function($scope,$state,worDoorHttp){
		worDoorHttp.postHttp(langOrgUrl,{id:orgId,lang:Lang},function(data){
				if(data.code == 200){
					$scope.languageListChoose = data.result;
					$scope.groupLangShow = $scope.languageListChoose[0].name;
				}
		})
		$scope.addGroupShow = false;
		$scope.editGroupShow = false;
		$scope.groupUl = false; 
		$scope.groupLang = false;
		$scope.groupTypeShow = Language.tutor;
		$scope.groupType = '1';
		//$scope.length = Language.also_you_can_enter+' '+30+Language.word;
		$scope.charaters_at_most_30 = Language.charaters_at_most_30; 
 
		/*群组相关翻译*/   
		$scope.search = Language.Search; 
		$scope.add_Popzu = Language.add_popzu; 
		$scope.Student = Language.students;
		$scope.Tutor = Language.tutor;
		$scope.Edit = Language.edit;
		$scope.Remove = Language.remove;
		$scope.popzu_name = Language.popzu_name;
		$scope.description = Language.group_description;
		$scope.Popzu_type = Language.popzu_type;
		$scope.language = Language.language;
		$scope.Confirm = Language.Confirm;
		$scope.Cancel = Language.cancel;
		$scope.edit_popzu = Language.edit_popzu;
		$scope.noDataShowGroupContent = Language.noDataShowGroupContent;

		/*添加群组参数*/
		$scope.groupAddPost = {
			type:1,
			orgId:orgId,
			id:-1
		}
		/*编辑群组参数*/
		$scope.groupEditPost = {
				type:1,
				orgId:orgId
		}
		/*群组列表参数*/
		$scope.groupListParams = {
				id:orgId, 
				pn:1,
				ps:6
		}
		$scope.groupAddPost.type = 1;  
		$scope.editMembers = function(index,$event){
			$scope.EditGroupShow = $scope.groupList[index]
			$scope.groupName = $scope.EditGroupShow.name;
			$scope.desc = $scope.EditGroupShow.description;
			//$scope.length = Language.also_you_can_enter+' '+(30-$scope.groupName.length)+Language.word;
			$scope.groupLangShow = $scope.EditGroupShow.lang;        
			  
			$scope.groupEditPost = {   
				type:$scope.EditGroupShow.type,
				name:$scope.EditGroupShow.name,
				description:$scope.EditGroupShow.description,
				lang:$scope.EditGroupShow.lang,
				orgId:orgId,
				id:$scope.EditGroupShow.id
			}
			$scope.editGroupShow = true;    
			$event.stopPropagation();  
		}
		$scope.removeMembers = function($event,id){
			$scope.isEnter = false;  
			deleteDialogPlan(function(){
				worDoorHttp.postHttp(groupRemoveUrl,{groupId:id},function(data){
					if(data.code == 200){
						getDataGroup(groupListUrl,$scope.groupListParams);
					}
				})  
			},function(){
				
			},Language.you_want_to_remove_this,Language.remove);
			$event.stopPropagation();
		}
		/*添加群组*/
		$scope.addGroup = function(){
			/*清空显示*/
			$scope.desc = ''; 
			$scope.groupName = '';
			$scope.groupLangShow = $scope.languageListChoose[0].name;
			$scope.groupAddPost.lang = $scope.languageListChoose[0].value;
			$scope.length = Language.also_you_can_enter+30+Language.word;
			$scope.addGroupShow = true;
		}
		$scope.closeShodowAdd = function(){  
			$scope.addGroupShow = false;
		}
		/*$scope.changeLength = function(){
			$scope.length = Language.also_you_can_enter+(30-$scope.groupName.length)+Language.word;
		}*/
		$scope.showgroupUl = function(){
			$scope.groupUl = !$scope.groupUl; 
		}
		$scope.chooseGroup = function(type){
			if(type == '1'){
				$scope.groupTypeShow = Language.tutor;
			}
			$scope.groupAddPost.type = type;
			$scope.groupEditPost.type = type;
			$scope.groupUl = false;
		}
		$scope.showLiLang = function(){
			$scope.groupLang = !$scope.groupLang;
		}
		$scope.chooseLang = function(groupLang,name){
			$scope.groupLangShow = name;
			$scope.groupAddPost.lang = groupLang;
			$scope.groupEditPost.lang = groupLang;
			$scope.groupLang = false;
		}
		/*添加群组的确定和取消*/
		$scope.addGroupSave = function(){
			$scope.groupAddPost.description = $scope.desc;
			$scope.groupAddPost.name = $scope.groupName;
			worDoorHttp.postHttp(groupAddOrEditUrl,$scope.groupAddPost,function(data){
				if(data.code == 200){
					getDataGroup(groupListUrl,$scope.groupListParams);
				}
			})
			$scope.addGroupShow = false;
		}
		
		/*编辑群组的确定和取消*/
		$scope.editGroupSave = function(){
			$scope.groupEditPost.description = $scope.desc;
			$scope.groupEditPost.name = $scope.groupName;  
			worDoorHttp.postHttp(groupAddOrEditUrl,$scope.groupEditPost,function(data){
				if(data.code == 200){
					getDataGroup(groupListUrl,$scope.groupListParams);
				}
			})
			$scope.editGroupShow = false;
		}  
		
		$scope.closeShodowEdit = function(){
			$scope.editGroupShow = false; 
		}
		 
		getDataGroup(groupListUrl,$scope.groupListParams);
		
		function getDataGroup(url,postData){
			worDoorHttp.postHttp(url,postData,function(data){
			$scope.groupList = data.items;
			$scope.allGroups = Language.common_groups + data.count;
			
			if(data.count == 0){
				$scope.noDataShowGroup = true;
			}else{
				$scope.noDataShowGroup = false;
			}
			if (data.count > 6) {
			$scope.groupListPaging = true;
			$('.groupUl').css({height:'610px'}); 
            $(".tcdPageCode").createPage({ 
            	 	pageCount: Math.ceil(data.count / 6) || 1,
                    current:$scope.groupListParams.pn,
                    backFn: function (p) {
                        $scope.groupListParams.pn = p;
                        worDoorHttp.postHttp(groupListUrl,$scope.groupListParams,function(data){
							$scope.groupList = data.items;
							 
						})
                    }
                })
	        } else {
	             $scope.groupListPaging = false;
	        }
		})
	}  
	$scope.groupDetail = function(index){
		$state.go('groupDetail',{name:$scope.groupList[index].name,groupId:$scope.groupList[index].id,language:$scope.groupList[index].lang})
	}     
	/*群组详情页面*/
}]).controller("groupDetail",["$scope",'$state','$stateParams','$compile',function($scope,$state,$stateParams,$compile){
	$scope.name = $stateParams.name;
	$scope.groupId = $stateParams.groupId;
	$scope.groupLanguage = $stateParams.language;
	$scope.students = Language.students;
	$scope.tutor = Language.tutor; 
	$scope.training_plan = Language.training_plan;
	$scope.Add_tutor = Language.Add_tutor; 
	$scope.Add_student = Language.Add_student; 
	$scope.add_courses = Language.add_courses;
	$scope.my_Courses = Language.my_Courses;
	$scope.public_courses = Language.public_courses;
	$scope.Enter_name = Language.Enter_name;
	$scope.Enter_content = Language.Enter_content;
	$scope.mobile_email = Language.mobile_email;
	$scope.avater = Language.avater;
	$scope.search = Language.Search;
	$scope.Cancel = Language.cancel;
	$scope.userName = Language.user_name;
	$scope.delete = Language.delete;
	$scope.minutes = Language.minutes;
	$scope.format_phone = Language.format_phone;
	$scope.Sorry_no_relevant = Language.Sorry_no_relevant;
	$scope.Enter_mobile_email = Language.Enter_mobile_email;
	/*批量添加学生和教练*/
	$scope.Add_Members_in_Bulk = Language.Add_Members_in_Bulk;
	$scope.Please_enter_the_Pop_On = Language.Please_enter_the_Pop_On;
	$scope.Email_or_Phone_Number = Language.Email_or_Phone_Number;
	$scope.Copy_Paste_Accounts = Language.Copy_Paste_Accounts;
	$scope.Insert_a_row = Language.Insert_a_row;
	$scope.Add_a_user = Language.Add_a_user;
	$scope.Enter_an_account = Language.Enter_an_account;
	$scope.Paste_emails_or_phone = Language.Paste_emails_or_phone;
	$scope.users_successfully_added = Language.users_successfully_added;
	$scope.users_failed_to_add = Language.users_failed_to_add;
	$scope.Send_invitation_via_email = Language.Send_invitation_via_email;
	$scope.Please_enter_user_s_email = Language.Please_enter_user_s_email;
	$scope.Paste_emails_here = Language.Paste_emails_here;
	$scope.Send_invitation_via_a_link = Language.Send_invitation_via_a_link;
	$scope.Copy_and_send_invitation_link = Language.Copy_and_send_invitation_link;
	$scope.Switch_off_invitation_link = Language.Switch_off_invitation_link;
	$scope.Switch_open_invitation_link = Language.Switch_open_invitation_link;
	$scope.Set_security_questions_and_answers = Language.Set_security_questions_and_answers;
	$scope.Question = Language.Question;
	$scope.Answer = Language.Answer;
	$scope.email = Language.email;  
	$scope.save = Language.save;
	$scope.Finish_Adding = Language.Finish_Adding;
	$scope.Close = Language.Close;
	$scope.send_email = Language.send_email;
	$scope.isChooseTitleEnter = 1; 
	$state.go('groupDetail.groupTutor');
	$scope.groupStudent = function(index){
		$scope.isChooseTitleEnter = index; 
		$state.go('groupDetail.groupStudent');
	}
	$scope.groupTutor = function(index){  
		$scope.isChooseTitleEnter = index;
		$state.go('groupDetail.groupTutor');
	}
	$scope.groupCourse = function(index){
		$scope.isChooseTitleEnter = index;
		$state.go('groupDetail.groupCourse');
	}   
	$scope.onlyOneEmail = true;
	$scope.onlyOneUser = true;
	$scope.addType = 1;
	$scope.errorShow = false;
	$scope.urlIsOpen = true;
	$scope.isvalidate = false;
	$scope.isvalidatePost = 0;
	$scope.question = '';
	$scope.answer = '';
	$scope.status = 1;
	$scope.oneOrManyNumersCopy = Language.Copy_Paste_Accounts;
	$scope.noStudentShow = Language.noStudentShow;
	$scope.closeShodowAdd = function(){
		$scope.studentShow = false;
	}
	$scope.changeTypeEmail = function($event){
		if($scope.onlyOneEmail){
			$($event.target).html(Language.Enter_an_account);
		}else{
			$($event.target).html(Language.Copy_Paste_Accounts);
		}
		$scope.onlyOneEmail = !$scope.onlyOneEmail;
	}
	$scope.changeTypeUser = function($event){
		if($scope.onlyOneUser){ 
			$($event.target).html(Language.Enter_an_account);
		}else{
			$($event.target).html(Language.Copy_Paste_Accounts);
		}
		$scope.onlyOneUser = !$scope.onlyOneUser;
	}
	$scope.addOneLine = function(content){
		var html = '<li><input type="text" placeholder="'+content+'" class="inputValue" /><span ng-click="removeLine($event)" style="cursor: pointer;margin-left:10px;">'+Language.remove+'</span></li>';
		var template = angular.element(html);
		var mobileDialogElement = $compile(template)($scope);
		angular.element('.emailInp').append(mobileDialogElement);
	}
	$scope.removeLine = function($event){
		$($event.target).parent().remove();
	}
}]).controller("groupStudent",["$scope",'worDoorHttp','$compile',function($scope,worDoorHttp,$compile){
		$scope.studentShow = false;
		$scope.newStudentShow = false;
		$scope.groupStudentPaging = false;
		$scope.noDatastudentList = false;
		$scope.H5InviteStudentUrl = H5InviteUrl +'/index.html?iden=Student&id=' + $scope.groupId + '&L=' + Lang;
		$scope.groupStudentParams = { 
			id:$scope.groupId,  
			pn:1,
			ps:10,
			identity:'Student'
		}     
		$scope.isInviterStu = 1;
		$scope.changeTypeOne = function($event,index){
			$scope.addType = index;
			if(index == 3){
				$scope.questionShow = false;
				groupStudentInviteDetail();
			}
			$scope.isInviterStu = index;  
		}
		$scope.saveDataUser = function(){
			var postData = '';
			if($scope.onlyOneUser){
				$('.inputValue').each(function(index,item){
					postData+=$(item).val() + ',';
				})
			}else{
				postData = $('.contentChange textarea').val();
				postData = postData.replace(/\n/g,',');
			}
			worDoorHttp.postHttp(groupAddStudentManyUrl,{groupId:$scope.groupId,userInfos:postData,identity:'Student'},function(data){
				if(data.code == 200){
					$scope.errorShow = true;
					$scope.errorShowInf = data.result.batchUserInfos;
					$scope.successNum = data.result.sucNum;
					$scope.failNum = data.result.failNum;
				}
			})
			
		}
		$scope.closeError = function(){
			$scope.errorShow = false;
		} 
		$scope.saveDataEmail = function(){
			var postData = '';
			if($scope.onlyOneUser){
				$('.inputValue').each(function(index,item){ 
					postData+=$(item).val() + ',';
				})
			}else{
				postData = $('.contentChange textarea').val();
				postData = postData.replace(/\n/g,',');
			}
			worDoorHttp.postHttp(sendEmailManyUrl,{userInfos:postData,identity:'Student',groupId:$scope.groupId,url:$scope.H5InviteStudentUrl},function(data){
				if(data.code == 200){
					alert(Language.E_mail_has_been_sent);  
				} 
			})
		} 
		$scope.closeUrl = function($event){
			$scope.urlIsOpen = !$scope.urlIsOpen;
			if($scope.urlIsOpen){
				$($event.target).html(Language.Switch_off_invitation_link);
				$scope.status = 1;
			}else{
				$($event.target).html(Language.Switch_open_invitation_link);
				$scope.status = 0;
			}
			worDoorHttp.postHttp(lianjieH5Url,{identity:'Student',id:$scope.groupId,answer:$scope.answer,isvalidate:$scope.isvalidatePost,question:$scope.question,status:$scope.status},function(data){
					if(data.code == 200){
						
					}
				})
		}
		$scope.isChooseQuestion = function(){
			$scope.isvalidate = !$scope.isvalidate;
			if($scope.isvalidate){
				$scope.isvalidatePost = 1;

			}else{  
				$scope.isvalidatePost = 0;
				worDoorHttp.postHttp(lianjieH5Url,{identity:'Student',id:$scope.groupId,answer:'',isvalidate:$scope.isvalidatePost,question:'',status:$scope.status},function(data){
					if(data.code == 200){
						$('.question').val('');
						$('.answer').val('');
					}
				})
			}
		}
		$scope.questionSave = function(){
			$scope.question = $('.question').val();
			$scope.answer = $('.answer').val();
			if(!$scope.question || !$scope.answer){
				alert('问题和答案不能为空');
				return false
			}
			worDoorHttp.postHttp(lianjieH5Url,{identity:'Student',id:$scope.groupId,answer:$scope.answer,isvalidate:$scope.isvalidatePost,question:$scope.question,status:$scope.status},function(data){
				if(data.code == 200){
					alert('保存成功！');
				}
			})
		}
		
		/*移除学生*/
		$scope.removeGroupStudent = function(id){
			deleteDialogPlan(function(){
				worDoorHttp.postHttp(groupRemoveRelationUrl,{groupId:$scope.groupId,relationId:id,identity:'Student'},function(data){
					if(data.code == 200){
						groupStudentList(groupMembersUrl,$scope.groupStudentParams);
					}
				})
			},function(){
				
			},Language.you_want_to_remove_this,Language.remove);
			 
		}
		$scope.addGroupStudent = function(){
			$scope.studentShow = true;
		}
		$scope.closeShodowAdd = function(){ 
			$scope.studentShow = false;
			$scope.newStudentShow = false;
			groupStudentList(groupMembersUrl,$scope.groupStudentParams);
		}
		
		groupStudentList(groupMembersUrl,$scope.groupStudentParams);
		function groupStudentInviteDetail(){
			worDoorHttp.postHttp(groupStudentInviteDetailUrl,{groupId:$scope.groupId,identity:'Student'},function(data){
				if(data.code == 200){
					$scope.status = data.result.status;
					if($scope.status == 1){
						$('.urlInvite').html(Language.Switch_off_invitation_link);
						$scope.urlIsOpen = true;
					}else{
						$('.urlInvite').html(Language.Switch_open_invitation_link);
						$scope.urlIsOpen = false;
					}
					$scope.isvalidatePost = data.result.isvalidate;
					if($scope.isvalidatePost == 1){
						$scope.isvalidate = true;
						$('.isChoose input').prop('checked',true);
						$('.question').val( data.result.question);
						$('.answer').val( data.result.answer);
					}else{
						$scope.isvalidate = false;
						$('.isChoose input').prop('checked',false);
					}
				}
			})
		}
		/*群组下学生列表*/
		function groupStudentList(url,dataPost){
			worDoorHttp.postHttp(url,dataPost,function(data){
				$scope.studentList = data.result.groupMemberRes;
				$scope.studentListCount = data.result.totalItems;
				if($scope.studentListCount == 0){
					$scope.noDatastudentList = true;
				}else{
					$scope.noDatastudentList = false;
				}
				if ($scope.studentListCount > 10) {
				$scope.groupStudentPaging = true;
				$('.allTutor').css({height:'520px'}); 
	            $(".tcdPageCode").createPage({
	                    pageCount: Math.ceil($scope.studentListCount / 10) || 1,
	                    current:$scope.groupStudentParams.pn,
	                    backFn: function (p) {
	                    	 $scope.groupStudentParams.pn = p;
	                        worDoorHttp.postHttp(groupMembersUrl,$scope.groupStudentParams,function(data){
								$scope.studentList =  data.result.groupMemberRes;
							})
	                    }
	                })
		        } else {
		             $scope.groupStudentPaging = false;
		        }
			});
		}
}]).controller("groupTutor",["$scope",'worDoorHttp','$http','$compile',function($scope,worDoorHttp,$http,$compile){
		/*删除的显示*/
		$scope.tutorShow = false;
		$scope.groupTutorPaging = false;
		$scope.noDataTutorList = false;
		$scope.noTutorShow = Language.noTutorShow;
		$scope.H5InviteTutorUrl = H5InviteUrl +'/index.html?iden=Tutor&id=' + $scope.groupId + "&L="+Lang;
		$scope.groupTutorParams = {
			id:$scope.groupId,
			pn:1,
			ps:10,
			identity:'Tutor'
		}
		$scope.isInviterTutor = 1; 
		$scope.changeTypeOne = function($event,index){
			$scope.addType = index;
			if(index == 3){
				$scope.questionShow = false;
				groupStudentInviteDetail();
			}
			$scope.isInviterTutor = index; 
		} 
		$scope.saveDataUser = function(){
			var postData = '';
			if($scope.onlyOneUser){
				$('.inputValue').each(function(index,item){
					postData+=$(item).val() + ',';
				})
			}else{
				postData = $('.contentChange textarea').val();
				postData = postData.replace(/\n/g,',');
			}
			worDoorHttp.postHttp(groupAddStudentManyUrl,{identity:'Tutor',groupId:$scope.groupId,userInfos:postData},function(data){
				if(data.code == 200){
					$scope.errorShow = true;
					$scope.errorShowInf = data.result.batchUserInfos;
					$scope.successNum = data.result.sucNum;
					$scope.failNum = data.result.failNum;
				}
			})
			
		}
		$scope.closeError = function(){
			$scope.errorShow = false;
		}
		$scope.saveDataEmail = function(){
			var postData = '';
			if($scope.onlyOneUser){
				$('.inputValue').each(function(index,item){
					postData+=$(item).val() + ',';
				})
			}else{
				postData = $('.contentChange textarea').val();
				postData = postData.replace(/\n/g,',');
			}
			worDoorHttp.postHttp(sendEmailManyUrl,{identity:'Tutor',userInfos:postData,groupId:$scope.groupId,url:$scope.H5InviteTutorUrl},function(data){
				if(data.code == 200){  
					alert('邮件已经发送！');
				}
			})
		}
		$scope.closeUrl = function($event){
			$scope.urlIsOpen = !$scope.urlIsOpen;
			if($scope.urlIsOpen){
				$($event.target).html(Language.Switch_off_invitation_link);
				$scope.status = 1;
			}else{
				$($event.target).html(Language.Switch_open_invitation_link);
				$scope.status = 0;
			}
			worDoorHttp.postHttp(lianjieH5Url,{identity:'Tutor',id:$scope.groupId,answer:$scope.answer,isvalidate:$scope.isvalidatePost,question:$scope.question,status:$scope.status},function(data){
					if(data.code == 200){
						
					}
				})
		}
		$scope.isChooseQuestion = function(){
			$scope.isvalidate = !$scope.isvalidate;
			if($scope.isvalidate){
				$scope.isvalidatePost = 1;

			}else{
				$scope.isvalidatePost = 0;
				worDoorHttp.postHttp(lianjieH5Url,{identity:'Tutor',id:$scope.groupId,answer:'',isvalidate:$scope.isvalidatePost,question:'',status:$scope.status},function(data){
					if(data.code == 200){
						$('.question').val('');
						$('.answer').val('');
					}
				})
			}
		}
		$scope.questionSave = function(){
			$scope.question = $('.question').val();
			$scope.answer = $('.answer').val();
			if(!$scope.question || !$scope.answer){
				alert(Language.The_question_answer_cannot);
				return false
			}
			worDoorHttp.postHttp(lianjieH5Url,{identity:'Tutor',id:$scope.groupId,answer:$scope.answer,isvalidate:$scope.isvalidatePost,question:$scope.question,status:$scope.status},function(data){
				if(data.code == 200){
					alert('保存成功！');
				}
			})
		}
		/*移除教练*/
		$scope.removeGroupTutor = function(id){
			deleteDialogPlan(function(){
				worDoorHttp.postHttp(groupRemoveRelationUrl,{groupId:$scope.groupId,relationId:id,identity:'Tutor'},function(data){
					if(data.code == 200){
						groupTutorList(groupMembersUrl,$scope.groupTutorParams);
					}
				})
			},function(){
				
			},Language.you_want_to_remove_this,Language.remove)
			
		} 
		$scope.addGroupTutor = function(){
			$scope.tutorShow = true;
		}
		$scope.closeShodowAdd = function(){
			$scope.tutorShow = false;
			$scope.newTutorShow = false;
			groupTutorList(groupMembersUrl,$scope.groupTutorParams);
		}

		
		function groupStudentInviteDetail(){
			worDoorHttp.postHttp(groupStudentInviteDetailUrl,{identity:'Tutor',groupId:$scope.groupId},function(data){
				if(data.code == 200){
					$scope.status = data.result.status;
					if($scope.status == 1){
						$('.urlInvite').html(Language.Switch_off_invitation_link);
						$scope.urlIsOpen = true;
					}else{
						$('.urlInvite').html(Language.Switch_open_invitation_link);
						$scope.urlIsOpen = false;
					}
					$scope.isvalidatePost = data.result.isvalidate;
					if($scope.isvalidatePost == 1){
						$scope.isvalidate = true;
						$('.isChoose input').prop('checked',true);
						$('.question').val( data.result.question);
						$('.answer').val( data.result.answer);
					}else{
						$scope.isvalidate = false;
						$('.isChoose input').prop('checked',false);
					}
				}
			})
		}
		groupTutorList(groupMembersUrl,$scope.groupTutorParams);
		/*群组下教练列表*/
		function groupTutorList(url,dataPost){
			worDoorHttp.postHttp(url,dataPost,function(data){
				$scope.tutorList = data.result.groupMemberRes;
				$scope.tutorListCount = data.result.totalItems;
				if($scope.tutorListCount == 0){
					$scope.noDataTutorList = true;
				}else{
					$scope.noDataTutorList = false;
				}
				if ($scope.tutorListCount > 10) {
				$scope.groupTutorPaging = true; 
				$('.allTutor').css({height:'520px'}); 
	            $(".tcdPageCode").createPage({ 
	                    pageCount: Math.ceil($scope.tutorListCount / 10) || 1,
	                    current:$scope.groupTutorParams.pn,
	                    backFn: function (p) {
	                        $scope.groupTutorParams.pn = p;
	                        worDoorHttp.postHttp(groupMembersUrl,$scope.groupTutorParams,function(data){
								$scope.tutorList = data.result.groupMemberRes;
							})
	                    }
	                })
		        } else {
		             $scope.groupTutorPaging = false;
		        }
			});
		}	
}]).controller("groupCourse",["$scope",'worDoorHttp','$state','$rootScope','$timeout',function($scope,worDoorHttp,$state,$rootScope,$timeout){
	$scope.groupPlanPaging = false;
	$scope.addPlan = false;  
	$scope.groupLang = false;   
	$scope.noDataShowPlan = false;      
	$scope.noPlanShow = Language.noPlanShow;
	$scope.Add_new_plan = Language.Add_new_plan;
	$scope.title = Language.title; 
	$scope.Edit_Plan = Language.Edit_Plan;
	$scope.Delete_Plan = Language.Delete_Plan; 
	$scope.Previous = Language.previous;
	$scope.Next = Language.next;
	$scope.Select_starting_date = Language.Select_starting_date;
	$scope.Add_training_template = Language.Add_training_template;
	$scope.plan_instro = Language.plan_instro;
	$scope.Done = Language.Done;
	$scope.Days = Language.Days;
	$scope.start_on = Language.start_on; 
	$scope.last_for = Language.last_for;
	$scope.date_confirm = Language.date_confirm;
	$scope.confirm = Language.Confirm; 
	$scope.weekList = [Language.Sunday,Language.Monday,Language.Tuesday,Language.Wednesday,Language.Thursday,Language.Friday,Language.Saturday];
	$scope.course_details = Language.course_details;  
	$scope.course_title = Language.course_title;
	$scope.course_classification = Language.course_classification; 
	$scope.difficulty = Language.difficulty;
	/*计划列表参数 */
	$scope.groupPlanParams = {  
			sourceId:$scope.groupId,
			pn:1,
			ps:6,
			sourceType:0,
			lang:Lang
	}
	$scope.close_tap = function(data){
		$scope.addPlan = data; 
		groupPlanListFunc(planListUrl,$scope.groupPlanParams); 
	}
	$scope.editTemplate = function(item){
		$scope.addPlan = true; 
		$scope.planId = item.id;
		$scope.planTitle = item.title;  
		$scope.planDesc = item.description;  
	}  
	
	/*删除计划*/
	$scope.removeTemplate = function($event,id){
		deleteDialogPlan(function(){
			worDoorHttp.postHttp(planRemoveUrl,{planId:id},function(data){
				if(data.code == 200){
					$timeout(function(){
						groupPlanListFunc(planListUrl,$scope.groupPlanParams);
					},200) 
				}
			})  
		},function(){ 
			
		},Language.you_want_to_remove_this,Language.remove); 
		$event.stopPropagation();
	} 
	groupPlanListFunc(planListUrl,$scope.groupPlanParams);

	/*训练计划*/
	function groupPlanListFunc(url,dataPost){
		worDoorHttp.postHttp(url,dataPost,function(data){
		$scope.groupPlanList = data.items;
		$scope.groupPlanListCount = data.count;
		if(data.count == 0){
			$scope.noDataShowPlan = true;
		}else{
			$scope.noDataShowPlan = false;
		}
		$scope.groupPlanList.forEach(function(item,index){ 
			courseCOnfirm(item);
			var nowData,lastOne={title:'...'}; 
			if(data.items[index].seriesVTOs && data.items[index].seriesVTOs.length>2){
				nowData = data.items[index].seriesVTOs.slice(0,2);
				nowData.push(lastOne); 
				data.items[index].seriesVTOs = nowData; 
			}     
		})
		if ($scope.groupPlanListCount > 6) {
			$('.displayCourse').css({height:'510px'});
			$scope.groupPlanPaging = true;
            $(".tcdPageCode").createPage({
                    pageCount: Math.ceil($scope.groupPlanListCount / 6) || 1,
                    current:$scope.groupPlanParams.pn,
                    backFn: function (p) {
                        $scope.groupPlanParams.pn = p;
                        worDoorHttp.postHttp(planListUrl,$scope.groupPlanParams,function(data){
							$scope.groupPlanList = data.items;
							$scope.groupPlanList.forEach(function(item,index){
								courseCOnfirm(item);
								item.seriesVTOs = item.seriesVTOs.slice(0,3);
							})
						})
                    }
                })
	        } else {
	             $scope.groupPlanPaging = false;
	        }
	})
}
}]).directive('planDateList',['worDoorHttp',function(worDoorHttp){
	return {
		restrict: 'AE', 
		scope:{ 
			   close:'&',
			   planId:'@', 
			   groupId:'@', 
			   planTitle:'@',
			   planDesc:'@',
			   groupLanguage:'@'
		},   
		templateUrl:'./modules/group/planDataList.html',
		controller:'planDateController',
		link:function(scope,elems,attrs){
			  
		}            
	} 
}]).controller('planDateController',['$scope','$timeout','worDoorHttp',function($scope,$timeout,worDoorHttp){
	$scope.along_date = 0;  
	$scope.show = '月'; 
	$scope.weeks = [Language.Sunday,Language.Monday,Language.Tuesday,Language.Wednesday,Language.Thursday,Language.Friday,Language.Saturday];
	$scope.thisYear = new Date().getFullYear();
	$scope.thisMonth = new Date().getMonth()+1; 
	$scope.thisDate = new Date().getDate();    
	$scope.getYear = new Date().getFullYear();   
	$scope.getMonth = new Date().getMonth()+1; 
	$scope.planTitleLength=$scope.planTitle.length; 
	$scope.planDescLength=$scope.planDesc.length;
	/*	储存已点击的课程进行添加*/
	$scope.added_course_list = [];
	/*储存要删除的课程*/
	$scope.deleted_course_list = [];
	//去重---添加课程
	$scope.add_plan_course_list = [];
	//去重---删除课程
	$scope.delete_plan_course_list = [];
	//选中课程的识别
	$scope.choosed_course_list = [];
	//存放临时的月份课程
	$scope.month_course_list = [];
	/*新建或编辑计划参数*/ 
	$scope.addAndEdit = {   
		creator:userInformation.userId,
		id:$scope.planId,
		sourceId:Number($scope.groupId),
		sourceType:0,
	}
	$scope.seriesData = {
		lang:Lang,
		ps:60,   
		pn:1, 
		source:41,  
		requestScope:1, 
		serviceLanguage:$scope.groupLanguage 
	} 
	$scope.seriesCourseData = { 
		ps:50,
		pn:1,    
		lang:Lang
	}
	/*$scope.showTap = false; */
	mGetDate($scope.getYear,twoWeiShuZi($scope.getMonth),$scope.planId);

	$scope.prev_page = function(){
		contains($scope.month_course_list,$scope.getYear,$scope.getMonth,function(){
			$scope.month_course_list.push({year:$scope.getYear,month:$scope.getMonth,course:$scope.dateList});
		})
		$scope.getMonth == 1 ? ($scope.getYear-=1,$scope.getMonth=12) : $scope.getMonth-=1;
		contains($scope.month_course_list,$scope.getYear,$scope.getMonth,function(){
			mGetDate($scope.getYear,twoWeiShuZi($scope.getMonth),$scope.planId); 
		})
	}
	$scope.next_page = function(){
		contains($scope.month_course_list,$scope.getYear,$scope.getMonth,function(){
			$scope.month_course_list.push({year:$scope.getYear,month:$scope.getMonth,course:$scope.dateList});
		})
		$scope.getMonth == 12 ? ($scope.getYear+=1,$scope.getMonth=1) : $scope.getMonth+=1;
		contains($scope.month_course_list,$scope.getYear,$scope.getMonth,function(){
			mGetDate($scope.getYear,twoWeiShuZi($scope.getMonth),$scope.planId); 
		})
	} 
	$scope.chooseDate = function(year,month){
		contains($scope.month_course_list,$scope.getYear,$scope.getMonth,function(){
			$scope.month_course_list.push({year:$scope.getYear,month:$scope.getMonth,course:$scope.dateList});
		})
		$scope.getYear = year;
		$scope.getMonth = month;
		contains($scope.month_course_list,$scope.getYear,$scope.getMonth,function(){
			mGetDate($scope.getYear,twoWeiShuZi($scope.getMonth),$scope.planId); 
		})
	} 
	  
	$scope.now_course_arr = []; 
	$scope.click_number = 0; 
	$scope.choose_index_series = 0;
	$scope.choosed_course_list_second = $scope.choosed_course_list; 
	//打开选择课程弹窗
	$scope.choose_course = function(e,date,index){
		$scope.click_number +=1; 
		$scope.date_course_save = ''; 
		$scope.now_course_arr = []; 
		$scope.choose_one = index; 
		//点击当天已有课程
		$scope.date_have_course = [];
		$scope.along_date = parseInt(date.date);
		$scope.choose_index_series = 0;   
		$scope.choose_index_course = -1;
		if(date.clicked&&date.clicked=='click'){
			$scope.show_course = true;  
			//获取当日的课程 
			$scope.choosed_course_list = $scope.dateList[index].seriesResources;  
			worDoorHttp.postHttp(seriesListUrl,$scope.seriesData,function(data){
				$scope.seriesList = data.items;
				$scope.seriesCourseData.seriesId = $scope.seriesList[0].id;
				getDataCourse($scope.seriesCourseData,$scope.choose_one,function(){
					$scope.courseList = change_course_style($scope.courseList,$scope.choosed_course_list);
				});
			})
			 
		}else{
			$scope.show_course = false; 
			return 
		} 
		$scope.course_style = {      
			"top":e.pageY+'px',   
			"left":e.pageX+'px' 
		};
		e.stopPropagation();
	}   
	$scope.choose_this_series = function(index,id){
		$scope.choose_index_series = index;
		$scope.seriesCourseData.seriesId = id   
		getDataCourse($scope.seriesCourseData,$scope.choose_one,function(){
			$scope.courseList = change_course_style($scope.courseList,$scope.choosed_course_list_second);
		}); 
		 
	}   
	/*选中计划课程*/
	$scope.choose_this_course = function(item){
		var course_add_no_repeat = [$scope.getYear,$scope.getMonth,$scope.along_date,item.id,item.seriesId,item.resourceId];
		var need_data_course = {title:item.detail.title,seriesId:item.seriesId,resourceId:item.resourceId,seriesResId:item.id};
		if(!item.choosedThis){
			$scope.now_course_arr.push(need_data_course); 
			$scope.add_plan_course_list.push(course_add_no_repeat);
		}else{
			$scope.now_course_arr = $scope.now_course_arr.filter(function(value){
				return item.id == value.seriesResId&&item.resourceId == value.resourceId ? false :true;
			})
			$scope.add_plan_course_list = $scope.add_plan_course_list.filter(function(value){
				return item.id == value[3]&&item.resourceId == value[5] ? false :true;
			}) 
			$scope.choosed_course_list.forEach(function(value){ 
				if(item.id == value.seriesResId&&item.resourceId == value.resourceId){
					$scope.delete_plan_course_list.push(course_add_no_repeat);
					$scope.date_have_course.push(need_data_course);
				} 
			})
			$scope.choosed_course_list = $scope.choosed_course_list.filter(function(value){
				return item.id == value.seriesResId&&item.resourceId == value.resourceId ? false :true;
			})
		}
		$scope.choosed_course_list_second = $scope.choosed_course_list.concat($scope.now_course_arr);
		$scope.courseList = change_course_style($scope.courseList,$scope.choosed_course_list_second);
	}
	/*添加多个课程*/ 
	$scope.chooseMangCourse = function(){
		$scope.date_have_course.forEach(function(item){
			changeCourse('delete',item,$scope.along_date); 
		})
		changeCourse('add',$scope.now_course_arr,$scope.along_date);// 所选课程  所选日期 
		$scope.show_course = false;   
	}
	/*删除计划课程*/ 
	$scope.delete_added = function(e,detail,date){
		var course_delete_no_repeat = [$scope.getYear,$scope.getMonth,date,detail.seriesResId,detail.seriesId,detail.resourceId]
		changeCourse('delete',detail,date); 
		$scope.delete_plan_course_list.push(course_delete_no_repeat);
		e.stopPropagation();    
	}
	/*完成计划的编辑*/
	$scope.done_all_course = function(){
		no_repeat_func($scope.add_plan_course_list,$scope.delete_plan_course_list);
		if($scope.planTitle && $scope.planDesc){
			if($scope.planId == ''){
				worDoorHttp.postHttp(planAddOrEditUrl,$scope.addAndEdit,function(data){
					if(data.code == 200){
						$timeout(function() {  
							planCourseEdit(data.result.id)
						}, 10)
					}else{
						alert('创建计划失败');
					}
				})  
			}else{  
				planCourseEdit(Number($scope.planId)); 
			}
		}else{
			alert('友情提示:标题或计划说明为空!');
		}
		   
	}
	//筛选点击日期的日历列表课程
	function contains(arr,year,month,fn) {
		var have_date = false;  
	   for(var i = 0;i<arr.length;i++){
			if(arr[i].year==year&&arr[i].month==month){
				$scope.dateList = arr[i].course;
				have_date = true;
				break;
			}
		}
		!have_date ? fn() : null; 
	} 
	//去重函数 
	function no_repeat_func(arr1,arr2){
		var arr_left = arr1,arr_right = arr2;
		arr_left = arr_left.filter(function(item,index){
			var is_same = true;
			for(var i = 0;i<arr2.length;i++){
				if(item[0] == arr2[i][0]&&item[1] == arr2[i][1]&&item[2] == arr2[i][2]&&item[3] == arr2[i][3]){
					is_same = false;
					break;
				} 
			}
			return is_same;  
		}) 
		arr_right = arr_right.filter(function(item,index){
			var is_same = true;
			for(var i = 0;i<arr1.length;i++){
				if(item[0] == arr1[i][0]&&item[1] == arr1[i][1]&&item[2] == arr1[i][2]&&item[3] == arr1[i][3]){
					is_same = false;
					break;
				}
			}
			return is_same;
		})
	 $scope.added_course_list = arr_left.map(function(item){
			return item[0]+'-'+twoWeiShuZi(item[1])+'-'+twoWeiShuZi(item[2])+':'+item[3]+','+item[4]+','+item[5]+';';
		})
	 $scope.deleted_course_list = arr_right.map(function(item){
			return item[0]+'-'+twoWeiShuZi(item[1])+'-'+twoWeiShuZi(item[2])+':'+item[3]+','+item[4]+','+item[5]+';';
		}) 
	}

	//编辑课程 
	function planCourseEdit(id){
		$scope.addAndEdit.title = $scope.planTitle;
		$scope.addAndEdit.description = $scope.planDesc;
		$scope.addAndEdit.id = id; 
		worDoorHttp.postHttp(planAddOrEditUrl,$scope.addAndEdit,function(data){
			data.code == 200 ? $scope.close({data:false}) : alert('创建计划失败');
		}) 
 
		$scope.added_course_list.forEach(function(item,index){
			worDoorHttp.postHttp(updatePlanScheduleUrl,{planSchedule:item,planId:$scope.addAndEdit.id,mark:'add'},function(data){
				data.code != 200 ? alert('创建日期计划失败') : null;
			}) 
		})
		$scope.deleted_course_list.forEach(function(item,index){
			worDoorHttp.postHttp(updatePlanScheduleUrl,{planSchedule:item,planId:$scope.addAndEdit.id,mark:'remove'},function(data){
				data.code != 200 ? alert('删除课程失败') : null;
			}) 
		})
	}
	/*改变课程的方法*/
	function changeCourse(state,detail,date){
		$scope.dateList.forEach(function(item,index){
			if(item.date == date && (item.state == 'now' || item.state == 'today')){
				state == 'add' ? (
					item.seriesResources = item.seriesResources.concat(detail) 
				) : ( 
					item.seriesResources = item.seriesResources.filter(function(value,key){
						return value.resourceId == detail.resourceId ? false : true; 
					})  
				)   
				$scope.dateList[index] = item; 
			}
			 
		}) 
	}
	/*获取课程列表*/
	function getDataCourse(params,index_date,fn){
		/*获取相应的系列的课程列表*/
		worDoorHttp.postHttp(seriesAllCourseUrl,params,function(data){
			if(data.code == 200){
				$scope.courseList =  data.items;
				fn();
			}
		}) 
	} 
	//改变已选中的课程的状态
	function change_course_style(course,haveCourse){
		var course_changed = course.map(function(item){
			if(haveCourse.length == 0){
				item.choosedThis = false;
				return item
			}else{
				for(var i = 0;i<haveCourse.length;i++){
					if(item.id == haveCourse[i].seriesResId && item.resourceId == haveCourse[i].resourceId){
						item.choosedThis = true;
						break;
					}else{
						item.choosedThis = false; 
					}
				}
				return item
			}  
		})
		return course_changed
	}
	/*获取每月的天数,上一月的天数和一号是周几 */
	function mGetDate(year, month,planId){
		var last_arr = [];
		var now_arr = [];
		var next_arr = [];
		/*当月的天数*/ 
	    var d = new Date(year, month, 0).getDate();
	   /* 上一月的天数*/
	    var l = new Date(year, month-1, 0).getDate();
	    /*当前日期*/
	    var now = new Date().getDate();  
	   /* 当前月一号是周几*/
	    var first = new Date(year, month-1, 1).getDay();
	    /* 当前月的最后一天是周几*/
	    var last =  new Date(year, month-1, d).getDay(); 
	     l-=first; 
	  	for(var i = 0;i<first;i++){
	  		l+=1; 
	  		var last_obj = {date:l,state:'last'};
	  		last_arr.push(last_obj);
	  	} 
	  	var last_date_show = 0;  
	  	for(var j = last+1;j<=6;j++){
	  		last_date_show+=1;
	  		var next_obj = {date:last_date_show,state:'next'};
	  		next_arr.push(next_obj);
	  	}
	  	for(var k = 1;k<=d;k++){
		  		var now_obj = {date:k,seriesResources:[]};
		  		new Date(year+'/'+month+'/'+k) - new Date() < 86400000? now_obj.clicked = 'no_click' : now_obj.clicked = 'click'; 
		  		k == now ? now_obj.state='today' : now_obj.state='now';   
		  		now_arr.push(now_obj);   
		  	}
		$scope.dateList = [];
	  	if(planId != ''){
	  		worDoorHttp.postHttp(planScheduleUrl,{planId:planId,time:year+'-'+month},function(data){
  				if(data.code == 200 && data.result.dailySchedules){
					now_arr.forEach(function(item,index){
	  					data.result.dailySchedules.forEach(function(value,key){ 
	  						var date_days = value.dayTime.split('-')[2];
	  						date_days == item.date ? now_arr[index].seriesResources = item.seriesResources.concat(value.seriesResources) : null;
	  					})
	  				})  
	  				 
	  			}
	  		})
	  	 }

	  	$scope.dateList = last_arr.concat(now_arr,next_arr);
		  console.log($scope.dateList);
	}
}]).directive('yearOrMonth',['worDoorHttp','$timeout',function(worDoorHttp,$timeout){
	return {
		restrict:'AE',   
		scope:{
			myMonth:'@', 
			myYear:'@',
			myChooseDate:'&'    
		}, 
		templateUrl:'./modules/group/yearAndMonth.html',
		link:function(scope,elems,attrs){
			scope.year = '年';
			scope.month = '月';
			scope.showList = false; 
			scope.month_list = [1,2,3,4,5,6,7,8,9,10,11,12];
			scope.year_list = []; 
			for(var i=2000;i<=2200;i++){
				scope.myYear == i ? (scope.top_scroll = (i-2000)*25) :null; 
				scope.year_list.push(i);
			}
			/*滚动到指定位置*/
			scope.show_date = function(){
				scope.showList=!scope.showList; 
				$timeout(function(){
					$('.year').scrollTop(scope.top_scroll);
					$('.month').scrollTop(parseInt(scope.myMonth)*25); 
				},10) 
				
			}
			scope.change_year = function(e,year){
				scope.myYear = parseInt(year);
				e.stopPropagation(); 
			}
			scope.change_month = function(e,month){
				scope.myMonth = parseInt(month); 
				scope.myChooseDate({'year':scope.myYear,'month':scope.myMonth}); 
				scope.showList = false;
				e.stopPropagation();
			}
		}
	}
}]).controller("verify",["$scope",'$state','$stateParams',function($scope,$state,$stateParams){
		/*审核翻译*/
		$scope.search = Language.Search;
		$scope.students = Language.students;
		$scope.tutor = Language.tutor;
		$scope.no_data = Language.no_data;
		$scope.approved = Language.approved; 
		$scope.rejected = Language.rejected;
		switch($stateParams.first){
			case 0 : $state.go('verify.displayCourse'); $scope.isClickVerify = 0;
			break;
			case 1 : $state.go('verify.verifyCourse'); $scope.isClickVerify = 1; 
			break;
			case 4 : $state.go('verify.verifyCourseInSeries'); $scope.isClickVerify = 4; 
			break;
			default:; 
			break;
		}
		 
		$scope.verifyTitleList = [ 
			{val:'displayCourse',display:Language.Published_course},
			{val:'verifyCourse',display:Language.Course_Under_Review},
			{val:'allTutors',display:Language.All_Tutors},
			{val:'verifyTutor',display:Language.Tutor_Under_Review},
			{val:'allSeries',display:Language.Published_Series}, 
			{val:'verifySeries',display:Language.series_Under_Review}   
		]   
		   
		$scope.verifyTitleChoose = function(index,val){
			$state.go('verify.'+val);
			$scope.isClickVerify = index; 
		}  		   
}]).controller("displayCourse",["$scope",'worDoorCourseHttp','$state',function($scope,worDoorCourseHttp,$state){
	$scope.displayCoursePaging = false;
	$scope.displayCourseNoDataShow = false;
	$scope.displayCourseParams = {
			source:orgId,
			ps:6,
			pn:1,
			auditStatus:2,
			lang:Lang
		}
	$scope.searchCourse = function(){
		$scope.displayCourseParams.q = $scope.searchContent;
		DisplayCourse(courseUrl,$scope.displayCourseParams);
	}
	$scope.reviewCorse = function(item){
		$state.go('courseReview',{details:item,first:0});   
	}
	DisplayCourse(courseUrl,$scope.displayCourseParams);
	function DisplayCourse(url,postData){
		worDoorCourseHttp.postHttp(url,postData,function(data){
			$scope.displayCourse = data.items;
			$scope.displayCourseAll = Language.find_x_course + data.count;
			$scope.displayCourse.forEach(function(item,index){
				courseCOnfirm(item);
			})
			if(data.count == 0){
				$scope.displayCourseNoDataShow = true;
			}else{
				$scope.displayCourseNoDataShow = false;
			}
			if (data.count > 6) {
				$scope.displayCoursePaging = true;
				$('.verifyDisplayCourse').css({height:'600px'});  
	            $(".tcdPageCode").createPage({
	                    pageCount: Math.ceil(data.count / 6) || 1,
	                    current: $scope.displayCourseParams.pn,
	                    backFn: function (p) {
	                        $scope.displayCourseParams.pn = p;
	                        worDoorCourseHttp.postHttp(courseUrl,$scope.displayCourseParams,function(data){
								$scope.displayCourse = data.items;
								$scope.displayCourse.forEach(function(item,index){
									courseCOnfirm(item);
								})
							})
	                    }
	                })
	        } else {
	             $scope.displayCoursePaging = false;
	        }
		})
	}
}]).controller("verifyCourse",["$scope",'worDoorCourseHttp','$state',function($scope,worDoorCourseHttp,$state){
	$scope.verifyCoursePaging = false;
	$scope.verifyDisplayCourseNoDataShow = false;
	$scope.verifyCourseParams = {
			source:orgId,
			ps:6,
			pn:1,
			auditStatus:1,
			lang:Lang
		}
	$scope.searchVerifyCourse = function(){
		$scope.verifyCourseParams.q = $scope.searchVerifyCourseContent;
		verifyDisplayCourse(courseUrl,$scope.verifyCourseParams);
	}
	$scope.reviewCorse = function(item){
		$state.go('courseReviewVerify',{details:item});
	}
 
	verifyDisplayCourse(courseUrl,$scope.verifyCourseParams);
	
	function verifyDisplayCourse(url,postData){
		worDoorCourseHttp.postHttp(url,postData,function(data){
			$scope.verifyCourse = data.items; 
			$scope.verifyCourseAll = Language.find_x_course+data.count;
			$scope.verifyCourse.forEach(function(item,index){
				courseCOnfirm(item);
			})
			if(data.count == 0){
				$scope.verifyDisplayCourseNoDataShow = true;
			}else{
				$scope.verifyDisplayCourseNoDataShow = false;
			}
			if (data.count > 6) {
				$('.verifyDisplayCourse').css({height:'600px'});
				$scope.verifyCoursePaging = true;
	            $(".tcdPageCode").createPage({
	                    pageCount: Math.ceil(data.count / 6) || 1,
	                    current:$scope.verifyCourseParams.pn,
	                    backFn: function (p) {
	                        $scope.verifyCourseParams.pn = p;
	                        worDoorCourseHttp.postHttp(courseUrl,$scope.verifyCourseParams,function(data){
								$scope.verifyCourse = data.items;
								$scope.verifyCourse.forEach(function(item,index){
									courseCOnfirm(item);
								})
							})
	                    }
	                })
	        } else {
	             $scope.verifyCoursePaging = false;
	        }
		})
	}
}]).controller("allTutors",["$scope",'worDoorHttp',function($scope,worDoorHttp){
	$scope.AllTutorsNoDataShow = false;
	$scope.allTutorsParams = {
			id:orgId,
			pn:1,
			ps:50,
			identity:'Tutor', 
			lang:Lang
		}
		AllTutors(allTutorsUrl,$scope.allTutorsParams);
		function AllTutors(url,dataPost){
			worDoorHttp.postHttp(url,dataPost,function(data){
				$scope.allTutors = data.result;
				$scope.allTutorsCount = 10;
				/*if(data.count == 0){
					$scope.AllTutorsNoDataShow = true;
				}else{
					$scope.AllTutorsNoDataShow = false;
				}*/
				if ($scope.allTutorsCount >$scope.allTutorsParams.ps) {
					$('.verifyAllTutors').css({height:'504px'});
					$scope.allTutorsPaging = true;
		            $(".tcdPageCode").createPage({
		                    pageCount: Math.ceil($scope.allTutorsCount / $scope.allTutorsParams.ps) || 1,
		                    current:$scope.allTutorsParams.pn,
		                    backFn: function (p) {
		                        $scope.allTutorsParams.pn = p;
		                       worDoorHttp.postHttp(allTutorsUrl,$scope.allTutorsParams,function(data){
									$scope.allTutors = data.result;
								})
		                    }
		                })
		        } else {
		             $scope.allTutorsPaging = false;
		        }
			});
		} 
}]).controller("verifyTutor",["$scope",'worDoorHttp',function($scope,worDoorHttp){
		$scope.verifyTutorsParams = {
			id:orgId,
			pn:1,
			ps:10,
			lang:Lang
		}
		$scope.passTutor = function(id){
				deleteDialogPlan(function(){
					worDoorHttp.postHttp(tutorApplyConfirmUrl,{id:id,operatorId:userInformation.userId,status:1},function(data){
						if(data.code == 200){
							verifyTutorFunc(applyListTutorUrl,$scope.verifyTutorsParams);
						}
					})
				},function(){
					
				},Language.confirm_agree,Language.approved);
		}
		$scope.unPassTutor = function(id){
			deleteDialogPlan(function(){
					worDoorHttp.postHttp(tutorApplyConfirmUrl,{id:id,operatorId:userInformation.userId,status:2},function(data){
						if(data.code == 200){
							verifyTutorFunc(applyListTutorUrl,$scope.verifyTutorsParams);
						}
					})
				},function(){
					
				},Language.confirm_refused,Language.rejected);
		}
		verifyTutorFunc(applyListTutorUrl,$scope.verifyTutorsParams);

		function verifyTutorFunc(url,dataPost){
			worDoorHttp.postHttp(url,dataPost,function(data){
					$scope.verifyTutors = data.items;
					$scope.verifyTutorsCount = data.count;
					if(data.count == 0){
						$scope.noDataShowVerifyTutor = true;
					}else{
						$scope.noDataShowVerifyTutor = false;
					}
						if ($scope.verifyTutorsCount >$scope.verifyTutorsParams.ps) {
							$('.verifyAllVerifyTutors').css({height:'504px'});
							$scope.verifyTutorsPaging = true;
				            $(".tcdPageCode").createPage({
				                    pageCount: Math.ceil($scope.verifyTutorsCount / $scope.verifyTutorsParams.ps) || 1,
				                    current:$scope.verifyTutorsParams.pn,
				                    backFn: function (p) {
				                        $scope.verifyTutorsParams.pn = p;
				                       worDoorHttp.postHttp(applyListTutorUrl,$scope.verifyTutorsParams,function(data){
											$scope.verifyTutors = data.items;
										})
				                    }
				                })
				        } else {
				             $scope.verifyTutorsPaging = false;
				        }
			});
		}
}]).controller("allSeries",['$scope','worDoorHttp','$state',function($scope,worDoorHttp,$state){
	$scope.courseNavPaging = false;
	$scope.allSeriesNoDataShow = false;
	$scope.seriesCourse = function(id){
		$state.go('verify.verifyCourseInSeries',{seriesId:id});
	}
	$scope.seriesListUrlParams = {
			ps:6,
			pn:1,
			lang:Lang,
			auditStatus:2,
			source:orgId 
		}
	$scope.searchAllSeries = function(){
		$scope.seriesListUrlParams.q = $scope.allSeriesSearch;
		getDataSeries(seriesListUrl,$scope.seriesListUrlParams);
	}
	getDataSeries(seriesListUrl,$scope.seriesListUrlParams);
	/*获取系列列表的方法*/
	function getDataSeries(url,postData){
		worDoorHttp.postHttp(url,postData,function(data){
			$scope.seriesList = data.items;
			$scope.seriesAll = Language.find_x_series + data.count;
			$scope.seriesList.forEach(function(item,index){
				courseCOnfirmSeries(item);
			})
			if(data.count == 0){
				$scope.allSeriesNoDataShow = true;
			}else{
				$scope.allSeriesNoDataShow = false;
			}
			if (data.count > 6) {
			$scope.courseNavPaging = true;
			$('.displayCourse').css({height:'500px'});
            $(".tcdPageCode").createPage({
                    pageCount: Math.ceil(data.count / 6) || 1,
                    current:$scope.seriesListUrlParams.pn,
                    backFn: function (p) {
                        $scope.seriesListUrlParams.pn = p;
                        worDoorHttp.postHttp(seriesListUrl,$scope.seriesListUrlParams,function(data){
							$scope.seriesList = data.items;
							$scope.displayCourseAll = Language.find_x_series + data.count;
							$scope.seriesList.forEach(function(item,index){
								courseCOnfirmSeries(item);
							})
						})
                    }
                })
        } else {
             $scope.courseNavPaging = false;
        }
	})
	}
}]).controller("verifySeries",['$scope','worDoorHttp','$state',function($scope,worDoorHttp,$state){
	$scope.verifySeriesPaging = false;
	$scope.verifySeriesNoDataShow = false;
	$scope.seriesCourse = function(id){
		$state.go('verify.verifyCourseInSeries',{seriesId:id});
	}
	$scope.verifySeries = function($event,id){
		editSerise(id,Lang,seriesListUrl,$scope.seriesListUrlParams,getDataverifySeries);
		$event.stopPropagation();
	}
	$scope.seriesListUrlParams = {
			ps:6,
			pn:1,
			auditStatus:1,
			lang:Lang,
			source:orgId
		}
	$scope.searchverifySeries = function(){
		$scope.seriesListUrlParams.q = $scope.verifySeriesSearch;
		getDataSeries(seriesListUrl,$scope.seriesListUrlParams);
	}
	getDataverifySeries(seriesListUrl,$scope.seriesListUrlParams);
	/*获取系列列表的方法*/
	function getDataverifySeries(url,postData){
		worDoorHttp.postHttp(url,postData,function(data){
			$scope.seriesList = data.items;
			$scope.seriesAll = Language.find_x_series + data.count;
			$scope.seriesList.forEach(function(item,index){
				courseCOnfirmSeries(item);
			})
			if(data.count == 0){
				$scope.verifySeriesNoDataShow = true;
			}else{
				$scope.verifySeriesNoDataShow = false;
			}
			if (data.count > 6) {
			$scope.verifySeriesPaging = true;
			$('.displayCourse').css({height:'568px'});
            $(".tcdPageCode").createPage({
                    pageCount: Math.ceil(data.count / 6) || 1,
                    current:$scope.seriesListUrlParams.pn,
                    backFn: function (p) {
                        $scope.seriesListUrlParams.pn = p;
                        worDoorHttp.postHttp(seriesListUrl,$scope.seriesListUrlParams,function(data){
							$scope.seriesList = data.items;
							$scope.displayCourseAll = Language.find_x_series + data.count;
							$scope.seriesList.forEach(function(item,index){
								courseCOnfirmSeries(item);
							})
						})
                    }
                })
        } else {
             $scope.verifySeriesPaging = false;
        }
	})
	}
}]).controller('verifyCourseInSeries',['$scope','$stateParams','worDoorCourseHttp','$state',function($scope,$stateParams,worDoorCourseHttp,$state){
	$scope.statusCourse = false;
	$scope.typeCourse = false;
	$scope.coursePaging = false;
	$scope.seriesId = $stateParams.seriesId;
	$scope.noDataShow = false;
	$scope.groupCoursePaging = false;
	/*翻译相关*/
	$scope.Search = Language.Search;
	$scope.choose_courses = Language.choose_courses;
	$scope.course_status_review = Language.course_status_review;
	$scope.course_status_published = Language.course_status_published;
	$scope.course_status_failed = Language.course_status_failed;
	$scope.All = Language.All;
	$scope.status = Language.status;
	$scope.type = Language.type;
	$scope.SurvivalOral = Language.SurvivalOral;
	$scope.DailyCommunication = Language.DailyCommunication;
	$scope.EntertainmentFocus = Language.EntertainmentFocus;
	$scope.WorkplaceTalent = Language.WorkplaceTalent;
	$scope.SocialIssues = Language.SocialIssues;
	$scope.WhileInRome = Language.WhileInRome;
	$scope.my_Courses = Language.my_Courses;
	$scope.public_courses = Language.public_courses;
	$scope.add = Language.add;
	$scope.course_edit = Language.course_edit;
	$scope.Course_Preview = Language.Course_Preview;
	$scope.verify_normal = Language.verify_normal;
	$scope.delete_course = Language.delete_course;
	$scope.Delete_from_Series = Language.Delete_from_Series;
	$scope.no_data = Language.no_data;
	$scope.displayCourseParams = {
		seriesId:$scope.seriesId,
		pn:1,
		ps:6,
		lang:Lang
	};
	$scope.reviewCourse = function($event,item){
		$state.go('courseReview',{details:item,first:4,seriesId:$scope.seriesId});  
		$event.stopPropagation();  
	} 
	if(Lang == 'English'){ 
		$('.fcategory').css({width:'150px'});
	}
	/*筛选课程*/
	$scope.courseStatusFilter = function(index){
		$scope.statusCourse = false;
		$scope.displayCourseParams.pn = 1;
		$scope.displayCourseParams.auditStatus = index;
		getDataCourseInSeries(seriesAllCourseUrl,$scope.displayCourseParams);
	}
	$scope.courseCategoryFilter = function(category){
		$scope.typeCourse = false;
		$scope.displayCourseParams.pn = 1;
		$scope.displayCourseParams.category = category;
		getDataCourseInSeries(seriesAllCourseUrl,$scope.displayCourseParams);
	}
	/*系列中搜索课程*/
	$scope.searchCourse = function(search){
		$scope.displayCourseParams.pn = 1;
		$scope.displayCourseParams.title = search;
		getDataCourseInSeries(seriesAllCourseUrl,$scope.displayCourseParams);
	}

	 getDataCourseInSeries(seriesAllCourseUrl,$scope.displayCourseParams);
	
	/*获取课程列表的方法*/
	function getDataCourseInSeries(url,postData){
		worDoorCourseHttp.postHttp(url,postData,function(data){
				$scope.courseInSeries = data.items;
			 	$scope.courseInSeries.forEach(function(item,index){
					courseCOnfirm(item.detail);
				})
				if(data.count == 0){
					$scope.noDataShow = true;
				}else{
					$scope.noDataShow = false;
					$scope.courseInSeriesAll = data.items[0].seriesInformation[0].title + '  '+Language.find_x_course + data.count;
				}
				if (data.count > 6) {
					$('.displayMyCourse').css({height:'658px'});
					$scope.seriesCoursePaging = true;
		            $(".tcdPageCode").createPage({
		                    pageCount: Math.ceil(data.count / 6) || 1,
		                    current:$scope.displayCourseParams.pn,
		                    backFn: function (p) {
		                        $scope.displayCourseParams.pn = p;
		                        worDoorCourseHttp.postHttp(seriesAllCourseUrl,$scope.displayCourseParams,function(data){
									$scope.courseInSeries = data.items;
									$scope.courseInSeries.forEach(function(item,index){
										courseCOnfirm(item.detail);
									})
								})
		                    }
		                })
		        } else {
		             $scope.seriesCoursePaging = false;
		        }

		})
	}
}]).controller('courseReview',['$scope','$stateParams','$state','worDoorHttp',function($scope,$stateParams,$state,worDoorHttp){
	$scope.detailsCourse = $stateParams.details;
	$scope.course_details = Language.course_details;  
	$scope.course_title = Language.course_title;
	$scope.course_classification = Language.course_classification; 
	$scope.difficulty = Language.difficulty;
	$scope.Published_course = Language.Published_course; 
	$scope.Previous_Page = Language.Previous_Page;
	$scope.series_course = Language.series_course; 
	$scope.courseDetailsShow = function(){ 
		shade();
		reviewCourseShow($scope.detailsCourse);
	} 
	$scope.goBack = function(){
		$stateParams.first == 0 ? $state.go('verify.displayCourse',{first:$stateParams.first}) : $state.go('verify.verifyCourseInSeries',{first:$stateParams.first,seriesId:$stateParams.seriesId});
	}    
	worDoorHttp.postHttp(courseInSeriesAll,{materialId:$scope.detailsCourse.id},function(data){
		if(data.code == 200){  
			$scope.courseSeriesAll = data.result.length == 0 ? ['无'] : data.result ;
		}   
	})		    
}]).controller('courseReviewVerify',['$scope','$stateParams','$state','worDoorHttp',function($scope,$stateParams,$state,worDoorHttp){
	$scope.detailsCourse = $stateParams.details;
	$scope.course_details = Language.course_details;
	$scope.course_title = Language.course_title; 
	$scope.course_classification = Language.course_classification;
	$scope.difficulty = Language.difficulty;
	$scope.approved = Language.approved; 
	$scope.rejected = Language.rejected;
	$scope.Course_Under_Review = Language.Course_Under_Review;
	$scope.Previous_Page = Language.Previous_Page;
	$scope.series_course = Language.series_course;
	$scope.courseDetailsShow = function(){ 
		shade();   
		reviewCourseShow($scope.detailsCourse);
	}
	$scope.goBack = function(){   
		$state.go('verify.verifyCourse',{first:1});      
	}  
	worDoorHttp.postHttp(courseInSeriesAll,{materialId:$scope.detailsCourse.id},function(data){
		if(data.code == 200){ 
			$scope.courseSeriesAll = data.result.length == 0 ? ['无'] : data.result ;
		}     
	})	
	$scope.verifyPass = function(id){
		deleteDialog(function(res){
			worDoorHttp.postHttp(courseVerifyUrl,{auditStatus:2,deployStatus:1,auditor:userInformation.userId,materialId:id,scope:res},function(data){
				if(data.code == 200){
					$state.go('verify.verifyCourse');
				}
			})
		},approveSeries);
	}
	$scope.verifyUnpass = function(id){
		deleteDialogPlan(function(){
			worDoorHttp.postHttp(courseVerifyUrl,{auditStatus:-1,deployStatus:-1,auditor:userInformation.userId,materialId:id},function(data){
				if(data.code == 200){
					$state.go('verify.verifyCourse');
				}
			})
		},function(){

		},Language.Are_applicant_has_not_passed,Language.rejected);
	}
}])

/*机构语言获取*/
function orginLanguage(){
	var html = '';
	$.ajax({
     		url:langOrgUrl,
     		type:'post',
     		data:{
     			id:orgId,
     			lang:Lang
     		},
     		headers:{
     			'A-Token-Header':userInformation.token
     		},
     		success:function(data){
     			if(data.code == 200){
     				data.result.forEach(function(item,index){
     					html+= '<li lang="'+item.value+'">'+item.name+'</li>';
     				})
     				$('.seriesUlLang').html(html);
     			}
     		}
     	})
}
function echart(id,value1,value2){
		// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(id));
        var option = {
			    tooltip: {
			    	trigger: 'item',
			        formatter: "{a} <br/>{b}: {c} ({d}%)"
			    },
			   series: [
			        {
			          /*  name:'数据来源',*/
			            type:'pie',
			            radius: ['50%', '70%'],
			            avoidLabelOverlap: false,
			            label: { 
			                normal: {
			                    show: false,
			                    position: 'center'
			                },
			                emphasis: {
			                    show: false,
			                    textStyle: {
			                        fontSize: '30',
			                        fontWeight: 'bold' 
			                    }
			                }
			            },
			            labelLine: {
			                normal: {
			                    show: false
			                }
			            }, 
			            data:[
			                {value:value1, name:'已完成任务',
			                 itemStyle:{
			                     normal: {
			                        color:'#09C0CE '
			                    }
			                }},
			                {value:(value2-value1), name:'未完成任务',
			                itemStyle:{ 
			                     normal: {
			                        color:'#cdcdcd'
			                    }
			                }}
			            ] 
			        }
			    ]  
			};
			myChart.setOption(option);
	}
function echartZhe(id,value,times){
	var myChart = echarts.init(document.getElementById(id));
	var option = {
	    
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['最大值','最小值']
	    },
	    toolbox: {
	        show: false
	    }, 
	    xAxis:  {
	        type: 'category',
	        boundaryGap: false,
	        data: times
	    },
	    yAxis: {
	        type: 'value',
	        axisLabel: {
	            formatter: '{value}'
	        }
	    },
	    series: [
	        {
	            name:'发单数量',
	            type:'line',
	            data:value, 
	            lineStyle:{
	            	normal:{
	            		color:'#09c0ce'
	            	}
	            }, 
	             itemStyle:{
	                	normal:{
                		color:'#09c0ce',
                		borderColr:'#09c0ce',
                		borderWidth:2 
                	}
                },
	            markPoint: {
	                data: [
	                    {type: 'max', name: '最大值'},
	                    {type: 'min', name: '最小值'}
	                ],
	                itemStyle:{
	                	normal:{
	                		color:'#09c0ce',
	                		borderColr:'#09c0ce'
	                	}
	                },
	                label:{
	                	normal:{
	                		color:'#09c0ce'
	                	}
	                }
	            } 
	           /* markLine: {
	                data: [
	                    {type: 'average', name: '平均值'}
	                ],
	                 lineStyle:{
		            	normal:{
		            		color:'#09c0ce',
		            		type:'dashed'
		            	}
		            }
	            }*/
	        }
	    ]
	};
	myChart.setOption(option);
}
/*当前周*/	
function showThisWeek(){
	var dateRange = {};     
    var Nowdate=new Date();
    var end =  Nowdate.getFullYear()+"/"+twoWeiShuZi(Nowdate.getMonth()+1)+"/"+twoWeiShuZi(Nowdate.getDate());    
    var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);     
    M=Number(WeekFirstDay.getMonth())+1;
    var start = WeekFirstDay.getFullYear()+"/"+twoWeiShuZi(M)+"/"+twoWeiShuZi(WeekFirstDay.getDate());
    dateRange.start = start;
    dateRange.end = end;  
    return dateRange     
}
/*上一周*/
function showLastWeek(){     
    var dateRange = {};     
    var Nowdate=new Date();
    var nowDateWeekend = new Date(Nowdate-Nowdate.getDay()*86400000)
    var end =  nowDateWeekend.getFullYear()+"/"+twoWeiShuZi(nowDateWeekend.getMonth()+1)+"/"+twoWeiShuZi(nowDateWeekend.getDate());    
    var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()+6)*86400000);     
    M=Number(WeekFirstDay.getMonth())+1;
    var start = WeekFirstDay.getFullYear()+"/"+twoWeiShuZi(M)+"/"+twoWeiShuZi(WeekFirstDay.getDate());
    dateRange.start = start;
    dateRange.end = end;  
    return dateRange         
}
/*当前月*/
function showThisMonth(){     
    var dateRange = {};     
    var Nowdate=new Date();
    var end =  Nowdate.getFullYear()+"/"+twoWeiShuZi(Nowdate.getMonth()+1)+"/"+twoWeiShuZi(Nowdate.getDate());      
    var MonthFirstDay=new Date(Nowdate.getFullYear(),Nowdate.getMonth(),1);     
    M=Number(MonthFirstDay.getMonth())+1;
    var start = MonthFirstDay.getFullYear()+"/"+twoWeiShuZi(M)+"/"+twoWeiShuZi(MonthFirstDay.getDate());
     dateRange.start = start;
    dateRange.end = end;      
    return dateRange   
}
/*上一月*/
function showLastMonth(){     
    var dateRange = {};     
    var Nowdate=new Date();
    var nowDateMonth = new Date(Nowdate.getFullYear(),Nowdate.getMonth(),1);
    nowDateMonth = new Date(nowDateMonth-86400000);
    var end =  nowDateMonth.getFullYear()+"/"+twoWeiShuZi(nowDateMonth.getMonth()+1)+"/"+twoWeiShuZi(nowDateMonth.getDate());      
    var MonthFirstDay=new Date(Nowdate.getFullYear(),(Nowdate.getMonth()-1),1);     
    M=Number(MonthFirstDay.getMonth())+1;
    var start = MonthFirstDay.getFullYear()+"/"+twoWeiShuZi(M)+"/"+twoWeiShuZi(MonthFirstDay.getDate());
     dateRange.start = start;
    dateRange.end = end;      
    return dateRange      
}

function add_delete(arr){
	var arr_post = [];
	arr.forEach(function(item,index){
		var arr_save = [];
		var arr_now = item.split(':');
		var left_date = arr_now[0].split('-');
		var right_data = arr_now[1].split(';');
		right_data.forEach(function(value,key){
			var right_data_one = value.split(',');
			var right_date = left_date;
			right_date.push(right_data_one[0]);
			arr_save.push(right_date);
		})
		arr_post.concat(arr_save);
	})
	return arr_post; 
} 

function twoWeiShuZi(num){
	if(num<10){
		num = '0'+num;
	}
	return num
}
function format(shijianchuo){
	//shijianchuo是整数，否则要parseInt转换
	var time = new Date(shijianchuo);
	var y = time.getFullYear();
	var m = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y+'-'+twoWeiShuZi(m)+'-'+twoWeiShuZi(d)+' '+twoWeiShuZi(h)+':'+twoWeiShuZi(mm)+':'+twoWeiShuZi(s);
}
