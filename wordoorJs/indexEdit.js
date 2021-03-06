
var myapp = angular.module('popon',["ui.router"]);

myapp.controller('header',['$scope',"$state",function($scope,$state){
	$scope.userChooseShow = false;
	$scope.langShow = false;
	$scope.avatar = userInformation.avatar;
	$scope.userName = userInformation.userName;
	$scope.nav = [   
		{'value':Language.my_Courses}, 
		{'value':Language.series},
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
	$scope.tuichu = function(){
		window.location.href = './login.html';
	}
	$scope.chooseLanguage = function(langugage){
		window.localStorage['lang'] = langugage;
		$scope.langShow = false;
		window.location.reload();
	}
	 
	$scope.navchoose = function(index){
		switch(index){
			case 0 : $state.go('course');
			break; 
			case 1 : $state.go('courseNav');
			break;
			defaults:;  
			break;
		}
		$scope.choosed = index;
	}

}])

 /*页面路由的设置*/		

myapp.factory('sessionInjector', function(){
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
        'http://192.168.1.82:9080/**']); 
		$urlRouterProvider.otherwise("/course");
		$stateProvider.state("course",{
			url:"/course",
			templateUrl:"./modules/course/course.html",
			controller:"course"
		}).state("courseReview",{
			url:"/courseReview",
			params:{details:null},
			templateUrl:"./modules/course/courseReview.html",
			controller:"courseReview"
		}).state("courseNav",{
			url:"/courseNav",
			templateUrl:"./modules/courseNav/courseNav.html",
			controller:"courseNav"
		}).state("seriesCourse",{
			url:"/seriesCourse",
			params:{seriesId:null},
			templateUrl:"./modules/seriesCourse/seriesCourse.html",
			controller:"seriesCourse"
		})
}]).factory('worDoorHttp',['$http',function($http){ 
		var worDoor = {};
		worDoor.postHttp = function(url,dataPost,fn){
			var myData = {};
			$http({
				url:url,
				params:dataPost,
				method:'post'
			}).then(function(data){
				for(var key in  data.data.result){
					if(key == 'items'){
						myData.items = data.data.result.items;
						myData.count = data.data.result.totalItemsCount;
					}
				}
				myData.code = data.data.code;
				myData.result = data.data.result;
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
}]).controller('course',['$scope','worDoorCourseHttp','worDoorHttp','$state',function($scope,worDoorCourseHttp,worDoorHttp,$state){
	$scope.coursePaging = false;  
	$scope.noDataShow = false;
	/*翻译相关*/
	$scope.Search = Language.Search_course;
	$scope.add_courses = Language.add_courses;
	
	$scope.status = Language.status;
	$scope.type = Language.type;
	 
	$scope.choose_series = Language.choose_series;
	$scope.course_edit = Language.course_edit;
	$scope.Course_Preview = Language.Course_Preview;
	$scope.verify_normal = Language.verify_normal;
	$scope.delete_course = Language.delete_course;
	$scope.noDataShowToAddCourse = Language.noDataShowToAddCourse;
	$scope.statusList = [
		{val:'',display:Language.All},
		{val:0,display:Language.course_status_draft},
		{val:1,display:Language.course_status_review},
		{val:2,display:Language.course_status_published},
		{val:-1,display:Language.course_status_failed}
	];
	$scope.courseTypeList = [ 
		{val:'',display:Language.All},
		{val:'SurvivalOral',display:Language.SurvivalOral},
		{val:'DailyCommunication',display:Language.DailyCommunication},
		{val:'EntertainmentFocus',display:Language.EntertainmentFocus},
		{val:'WorkplaceTalent',display:Language.WorkplaceTalent},
		{val:'SocialIssues',display:Language.SocialIssues},
		{val:'WhileInRome',display:Language.WhileInRome}  
	];
	$scope.displayCourseParams = {
			source:orgId,
			authorId:userInformation.userId, 
			ps:6,
			pn:1,
			lang:Lang
		}  
	$scope.reviewCourse = function(item){
		$state.go('courseReview',{details:item});
	};
	$scope.editCourse = function($event,id){
		shade();
		editCourse(id,Lang);
		$event.stopPropagation();
	};
	$scope.verifyCourse = function($event,id){
		deleteDialogPlan(function(){
			worDoorHttp.postHttp(courseVerifyUrl,{materialId:id,auditor:userInformation.userId,auditStatus:1},function(data){
				if(data.code == 200){
					getDataCourse(courseUrl,$scope.displayCourseParams);
				}
			})
		},function(){
			
		},Language.you_want_to_verify_this,Language.Confirm)
		$event.stopPropagation();
	};
	$scope.removeCourse = function($event,id){
		deleteDialogPlan(function(){
			worDoorHttp.postHttp(courseDeleteUrl,{materialId:id},function(data){
				if(data.code == 200){
					getDataCourse(courseUrl,$scope.displayCourseParams);
				}
			})
		},function(){
			
		},Language.you_want_to_remove_this,Language.Confirm)
		$event.stopPropagation();
	};
	$scope.addToSeries = function($event,item){ 
			shade();
		 EditNewCourseToSeries(item,courseUrl,$scope.displayCourseParams,getDataCourse);
		$('.btnGroupByNew .cancel').remove();
		$event.stopPropagation();
	};
	$scope.changeStyle=[
		{'width':'130px'},   
		{'width':'180px'},
		{'width':'150px'},  
		{'display':'none'}, 
		{'display':'block'} 
	]; 
	//$scope.onlyWithChange = $scope.changeStyle[0];
	/*编辑和移除的显示*/
	$scope.enter = function($event){ 
		$($event.target).parents('.setUp').find('.editLi').css({display:'block'});
		if(Lang == 'English'){  
			$scope.onlyWithChange = $scope.changeStyle[0];  
		}else if(Lang == 'Japanese'){  
			$scope.onlyWithChange = $scope.changeStyle[1];
		}else if(Lang == 'Korean'){
			$scope.onlyWithChange = $scope.changeStyle[0];
		}else if(Lang == 'Spanish'){
			$scope.onlyWithChange = $scope.changeStyle[2];
		}
	};     
	$scope.out = function($event){ 
		$($event.target).parents('.setUp').find('.editLi').css({display:'none'});
	};
	if(Lang == 'English' || Lang == 'Japanese' || Lang == 'Spanish'){
		$scope.fcategoryStyle = $scope.changeStyle[2];   
	};
	/*添加课程*/
	$scope.addNewCourse = function(){
		shade();
		addNewCourse(Lang);
	};
	/*筛选课程*/
	$scope.courseStatusFilter = function(index){
		$scope.statusCourse = false;
		$scope.displayCourseParams.pn = 1;
		$scope.displayCourseParams.auditStatus = index;
		getDataCourse(courseUrl,$scope.displayCourseParams);
	};
	$scope.courseCategoryFilter = function(category){
		$scope.typeCourse = false;
		$scope.displayCourseParams.pn = 1;
		$scope.displayCourseParams.category = category;
		getDataCourse(courseUrl,$scope.displayCourseParams);
	};
	/*搜索课程*/
	$scope.searchCourse = function(search){
		$scope.displayCourseParams.pn = 1;
		$scope.displayCourseParams.q = search;
		getDataCourse(courseUrl,$scope.displayCourseParams);
	};
	getDataCourse(courseUrl,$scope.displayCourseParams);
	/*获取课程列表的方法*/
	function getDataCourse(url,postData){
		worDoorCourseHttp.postHttp(url,postData,function(data){
			$scope.displayCourse = data.items;
			$scope.displayCourseAll = Language.find_x_course + data.count;
			$scope.displayCourse.forEach(function(item,index){
				courseCOnfirm(item);
			})
			if(data.count == 0){
				$scope.noDataShow = true;
			}else{
				$scope.noDataShow = false;
			}

			if (data.count > 6) {
			$('.displayCourse').css({height:'568px'});
			$scope.coursePaging = true;
            $(".tcdPageCode").createPage({
                    pageCount: Math.ceil(data.count / 6) || 1,
                    current:$scope.displayCourseParams.pn,
                    backFn: function (p) {
                        $scope.displayCourseParams.pn = p;
                        worDoorCourseHttp.postHttp(courseUrl,$scope.displayCourseParams,function(data){
							$scope.displayCourse = data.items;
							$scope.displayCourseAll = Language.find_x_course + data.count;
							$scope.displayCourse.forEach(function(item,index){
								courseCOnfirm(item);
							})
						})
                    }
                })
        } else {
             $scope.coursePaging = false;
        }
	})
	}
	
}]).controller('courseReview',['$scope','$stateParams',function($scope,$stateParams){
	$scope.detailsCourse = $stateParams.details;
	$scope.course_details = Language.course_details;
	$scope.courseDetailsShow = function(){
		shade(); 
		reviewCourseShow($scope.detailsCourse);
	}
	
}]).controller('courseNav',['$scope','worDoorHttp','$state','$timeout',function($scope,worDoorHttp,$state,$timeout){
	$scope.statusCourse = false;
	$scope.typeCourse = false;
	$scope.courseNavPaging = false;
	$scope.noDataShow = false;
	
	/*翻译相关*/
	$scope.edit_series = Language.edit_series;
	$scope.series_details = Language.series_details    
	$scope.delete_series = Language.delete_series;
	$scope.verify_normal = Language.verify_normal;
	$scope.Search = Language.Search_series;
	$scope.add_series = Language.add_series;
	
	$scope.status = Language.status;
	$scope.type = Language.type;
	
	$scope.noDataShowToAddSeries = Language.noDataShowToAddSeries;
	$scope.statusList = [
		{val:'',display:Language.All},
		{val:0,display:Language.course_status_draft},
		{val:1,display:Language.course_status_review},
		{val:2,display:Language.Published},   
		{val:-1,display:Language.course_status_failed}
	];
	$scope.courseTypeList = [ 
		{val:'',display:Language.All},
		{val:'SurvivalOral',display:Language.SurvivalOral},
		{val:'DailyCommunication',display:Language.DailyCommunication},
		{val:'EntertainmentFocus',display:Language.EntertainmentFocus},
		{val:'WorkplaceTalent',display:Language.WorkplaceTalent},
		{val:'SocialIssues',display:Language.SocialIssues},
		{val:'WhileInRome',display:Language.WhileInRome}  
	];
	if(Lang == 'English' || Lang == 'Janpanese' || Lang == 'Spanish'){
		$('.fcategory').css({width:'180px'});
	}  
	$scope.seriesListUrlParams = {
			ps:6,
			pn:1,
			creator:userInformation.userId,
			lang:Lang,
			source:orgId
	}
	
	/*编辑和移除的显示*/
		$scope.enter = function(data,$event){
			$($event.target).parents('.setUp').find('.editLi').css({display:'block'});
			if(Lang == 'English'){
				$('.setUp .editLi').css({width:'130px'});
			}else if(Lang == 'Korean'){
				$('.setUp .editLi').css({width:'130px'});
			}else if(Lang == 'Spanish' || Lang == 'Janpanese'){
				$('.setUp .editLi').css({width:'150px'});
			}
		}     
		$scope.out = function(data,$event){
			$($event.target).parents('.setUp').find('.editLi').css({display:'none'});
		}
		
	$scope.editSeries = function($event,id){
		shade();
		editSerise(id,Lang,seriesListUrl,$scope.seriesListUrlParams,getDataSeries);
		$event.stopPropagation();
	}
	$scope.detailSeries = function($event,id){
		lookSeriseDetails(id,Lang);  
		$event.stopPropagation();    
	}    
	$scope.courseSort = function($event,id){
		courseDragSort(id);          
		$event.stopPropagation();        
	}
	$scope.verifySeries = function($event,id){
		deleteDialogPlan(function(){
			worDoorHttp.postHttp(seriesVerifyUrl,{auditStatus:1,seriesId:id,auditor:userInformation.userId},function(data){
				if(data.code == 200){
					$timeout(function(){
						getDataSeries(seriesListUrl,$scope.seriesListUrlParams);
					},100)
				}    
			})
		},function(){
			
		},Language.you_want_to_verify_this,Language.Confirm)
		$event.stopPropagation();
	}
	$scope.removeSeries = function($event,id){
		deleteDialogPlan(function(){
			worDoorHttp.postHttp(seriesDeleteUrl,{seriesId:id},function(data){
				if(data.code == 200){
					$timeout(function(){
						getDataSeries(seriesListUrl,$scope.seriesListUrlParams);
					},100) 
				}
			})
		},function(){
			
		},Language.you_want_to_remove_this,Language.Confirm)
		$event.stopPropagation();
	}
	/*添加系列*/
	$scope.addNewSeries = function(){
		shade();
		addNewSeries(Lang,seriesListUrl,$scope.seriesListUrlParams,getDataSeries);
	}
	/*筛选系列*/
	$scope.courseStatusFilter = function(index){
		$scope.statusCourse = false;
		$scope.seriesListUrlParams.pn = 1;
		$scope.seriesListUrlParams.auditStatus = index;
		getDataSeries(seriesListUrl,$scope.seriesListUrlParams);
	}
	$scope.courseCategoryFilter = function(category){
		$scope.typeCourse = false;
		$scope.seriesListUrlParams.pn = 1;
		$scope.seriesListUrlParams.category = category;
		getDataSeries(seriesListUrl,$scope.seriesListUrlParams);
	}
	/*搜索系列*/
	$scope.searchCourse = function(search){
		$scope.seriesListUrlParams.pn = 1;
		$scope.seriesListUrlParams.q = search;
		getDataSeries(seriesListUrl,$scope.seriesListUrlParams);
	}
	$scope.seriesCourse = function(item){
		$state.go('seriesCourse',{seriesId:item});
	}
	getDataSeries(seriesListUrl,$scope.seriesListUrlParams);
	/*获取系列列表的方法*/
	function getDataSeries(url,postData){
		worDoorHttp.postHttp(url,postData,function(data){
			$scope.seriesList = data.items;
			$scope.seriesAll = Language.find_x_series + data.count;
			if(data.count == 0){
				$scope.noDataShow = true;
			}else{
				$scope.noDataShow = false;
			}
			$scope.seriesList.forEach(function(item,index){
				courseCOnfirmSeries(item);
			})
			if (data.count > 6) {
			$('.displayCourse').css({height:'568px'});
			$scope.courseNavPaging = true;
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
}]).controller('seriesCourse',['$scope','worDoorCourseHttp','$stateParams','$state','worDoorHttp',function($scope,worDoorCourseHttp,$stateParams,$state,worDoorHttp){
	$scope.statusCourse = false;
	$scope.typeCourse = false;
	$scope.coursePaging = false;
	$scope.seriesId = $stateParams.seriesId.id;  
	$scope.forSecNativeLanguages = '';
	$scope.forNativeLanguage =  $stateParams.seriesId.forNativeLanguage.id;
	$scope.serviceLanguage =  $stateParams.seriesId.serviceLanguage.id;
	 $scope.forSecNativeLanguagesNow = $stateParams.seriesId.forSecNativeLanguages ? $stateParams.seriesId.forSecNativeLanguages : [];
	$.each($scope.forSecNativeLanguagesNow,function(index,item){
        $scope.forSecNativeLanguages += item.id +' ';
    });
    $scope.forSecNativeLanguages = $scope.forSecNativeLanguages.replace(/(^\s+)|(\s+$)/g,'');
    $scope.difficulty = $stateParams.seriesId.difficulty.id;
	$scope.noDataShow = false;
	$scope.groupCoursePaging = false;
	/*翻译相关*/
	$scope.Search = Language.Search_course;
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
	$scope.my_Courses = Language.Organization_Courses;
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
	 $scope.MyCourseParams = {
			source:orgId,
			ps:6,
			pn:1,
			lang:Lang,
			auditStatus:2,
			seriesId:$scope.seriesId,
			forNativeLanguage:$scope.forNativeLanguage,
			forSecNativeLanguages:$scope.forSecNativeLanguages,
			serviceLanguage:$scope.serviceLanguage,
			difficulty:$scope.difficulty
		};
	 $scope.customCourseParams = {
		ps:6,
		pn:1,
		lang:Lang,
		auditStatus:2,
		seriesId:$scope.seriesId,
		ignoreSources:orgId,
		scope:1,
		forNativeLanguage:$scope.forNativeLanguage,
		forSecNativeLanguages:$scope.forSecNativeLanguages,
		serviceLanguage:$scope.serviceLanguage,
		difficulty:$scope.difficulty
	}
	$scope.inStatus = function($event){
		$scope.statusCourse = true;
	}
	$scope.outStatus = function($event){
		$scope.statusCourse = false;
	}
	$scope.inType = function($event){
		$scope.typeCourse = true;
	}
	$scope.outType = function($event){
		$scope.typeCourse = false;
	}
	$scope.choosecolor = function($event){
		$($event.target).css({backgroundColor:'#09c0ce',color:"#fff"});
	}
	$scope.choosecolorNo = function($event){
		$($event.target).css({backgroundColor:'#fff',color:"#000"});
	}
	$scope.reviewCourse = function($event,item){
		$state.go('courseReview',{details:item});
		$event.stopPropagation();
	}
	$scope.editCourse = function($event,id){
		shade();
		editCourse(id,Lang);
		$event.stopPropagation();
	}
	/*系列中审核课程*/
	$scope.verifyCourse = function($event,id){
		deleteDialogPlan(function(){
			worDoorCourseHttp.postHttp(courseVerifyUrl,{materialId:id,auditor:userInformation.userId,auditStatus:1},function(data){
				if(data.code == 200){
					getDataCourseInSeries(seriesAllCourseUrl,$scope.displayCourseParams);
				}
			})
		},function(){
			
		},Language.you_want_to_verify_this,Language.Confirm)
		$event.stopPropagation();
	}
	/*系列中删除课程*/
	$scope.removeCourse = function($event,id){
		deleteDialogPlan(function(){
			worDoorCourseHttp.postHttp(courseDeleteUrl,{materialId:id},function(data){
				if(data.code == 200){
					getDataCourseInSeries(seriesAllCourseUrl,$scope.displayCourseParams);
				}
			})
		},function(){
			
		},Language.you_want_to_remove_this,Language.Confirm)
		$event.stopPropagation();
	}
	/*从系列中移除课程*/
	$scope.removeFromSeries = function($event,id){
		deleteDialogPlan(function(){
			worDoorCourseHttp.postHttp(removeCourseInSeries,{seriesResourceId:id},function(data){
				if(data.code == 200){
					getDataCourseInSeries(seriesAllCourseUrl,$scope.displayCourseParams);
				}
			})
		},function(){
			
		},Language.you_want_to_delete_this,Language.Confirm)
		$event.stopPropagation();
	}
	$scope.addToSeries = function($event,item){
		shade();
		 EditNewCourseToSeries(item);
		$('.btnGroupByNew .cancel').remove();
	}
	
	/*编辑和移除的显示*/
		$scope.enter = function(data,$event){
			$($event.target).parents('.setUp').find('.editLi').css({display:'block'});
			if(Lang == 'English'){
				$('.setUp .editLi').css({width:'150px'});
			}
		}
		$scope.out = function(data,$event){
			$($event.target).parents('.setUp').find('.editLi').css({display:'none'});
		}
		/*编辑和移除的css变化*/
		$scope.editEnter = function($event){
			$($event.target).css({backgroundColor:'#09c0ce',color:"#fff"});
		}
		$scope.editOut = function($event){
			$($event.target).css({backgroundColor:'#fff',color:"#000"});
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

	/*添加课程到系列中弹框*/  
	$scope.addNewCourse = function(id){
		if($stateParams.seriesId && $stateParams.seriesId.auditStatus.id == 2){
			$scope.showAddCourse = true;
			$scope.groupMyCourse = true;
			$scope.groupCustomCourse = false;
			$('.addGroupCourse').animate({height:'950px',top:0},200);
			getDataMyCourse(normal_query_course_url,$scope.MyCourseParams);
		}else{
			alert('该系列还没有发布,请发布完之后再进行添加课程！');
		}
	}

	$scope.myCourse = function($event){
		$($event.target).siblings().removeClass('tabActiveMy').end().addClass('tabActiveMy');
		$scope.groupMyCourse = true;
		$scope.groupCustomCourse = false;
		getDataMyCourse(normal_query_course_url,$scope.MyCourseParams);
	}
	$scope.customCourse = function($event){
		$($event.target).siblings().removeClass('tabActiveMy').end().addClass('tabActiveMy');
		$scope.groupMyCourse = false;
		$scope.groupCustomCourse = true;
		getDataCustomCourse(normal_query_course_url,$scope.customCourseParams);
	}
	$scope.removeHtmlCourse = function(){
		$('.addGroupCourse').animate({height:0,top:'950px'},300,function(){
			$scope.showAddCourse = false;
			getDataCourseInSeries(seriesAllCourseUrl,$scope.displayCourseParams);
		})
	}
	/*添加课程到系列中保存*/
	$scope.addMyToSeries = function(materialId,index){
		worDoorHttp.postHttp(courseToSeries,{seriesId:$scope.seriesId,materialId:materialId},function(data){
			if(data.code == 200){
				if($scope.groupMyCourse){
					$scope.displayMyCourse[index].addCourseMy = Language.added;
				}else{
					$scope.displayCustomCourse[index].addCourseMy = Language.added;
				}
			}else if(data.code == 991){
				alert(Language.Have_added_to_the_series);
			}
		})
	}
	/*弹框课程中搜索课程*/
	$scope.searchRelativeCourse = function(){
		if($scope.groupMyCourse){
			$scope.MyCourseParams.title = $scope.searchContent;
			getDataMyCourse(normal_query_course_url,$scope.MyCourseParams);
		}else{
			$scope.customCourseParams.title = $scope.searchContent;
			getDataCustomCourse(normal_query_course_url,$scope.customCourseParams);
		}  
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
					$scope.courseInSeriesAll = $stateParams.seriesId.title + '  '+Language.find_x_course + data.count;
				}  
				if (data.count > 6) {  
					$('.displayCourse').css({height:'560px'});  
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
	/*获取课程列表的方法*/
	function getDataMyCourse(url,postData){
		worDoorCourseHttp.postHttp(url,postData,function(data){
			$scope.displayMyCourse = data.items;
			$scope.displayMyCourse.forEach(function(item,index){
				courseCOnfirm(item);
				$scope.displayMyCourse[index].addCourseMy = Language.add;
			})
			if(data.count == 0){
					$scope.noDataMyCourseShow = true;
				}else{
					$scope.noDataMyCourseShow = false;
				}
			if (data.count > 6) {
			$('.displayMyCourse').css({height:'658px'});
			$scope.groupMyCoursePaging = true;
            $(".tcdPageCode").createPage({
                    pageCount: Math.ceil(data.count / 6) || 1,
                    current:$scope.MyCourseParams.pn,
                    backFn: function (p) {
                        $scope.MyCourseParams.pn = p;
                        worDoorCourseHttp.postHttp(normal_query_course_url,$scope.MyCourseParams,function(data){
							$scope.displayMyCourse = data.items;
							$scope.displayMyCourse.forEach(function(item,index){
								courseCOnfirm(item);
								$scope.displayMyCourse[index].addCourseMy = Language.add;
							})
						})
                    }
                })
        } else {
             $scope.groupMyCoursePaging = false;
        }
	})
	}
	function getDataCustomCourse(url,postData){
		worDoorCourseHttp.postHttp(url,postData,function(data){
			$scope.displayCustomCourse = data.items;
			$scope.displayCustomCourse.forEach(function(item,index){
				courseCOnfirm(item);
				$scope.displayCustomCourse[index].addCourseMy = Language.add;
			})
			if(data.count == 0){
				$scope.noDataCustomCourseShow = true;
			}else{
				$scope.noDataCustomCourseShow = false;
			}
			if (data.count > 6) {  
			$('.displayMyCourse').css({height:'658px'});
			$scope.groupCustomCoursePaging = true;
            $(".tcdPageCode").createPage({
                    pageCount: Math.ceil(data.count / 6) || 1,
                    current:$scope.customCourseParams.pn,
                    backFn: function (p) {
                        $scope.customCourseParams.pn = p;
                        worDoorCourseHttp.postHttp(normal_query_course_url,$scope.customCourseParams,function(data){
							$scope.displayCustomCourse = data.items;
							$scope.displayCustomCourse.forEach(function(item,index){
								courseCOnfirm(item);
								$scope.displayCustomCourse[index].addCourseMy = Language.add;
							})
						})
                    }
                })
        } else {
             $scope.groupCustomCoursePaging = false;
        }
	})
	}
}])

/*新增系列*/
function addNewSeries(lang,url,dataSeries,fn){
			var html = '<div class="course-along"><div class="title"><span>'+Language.add_series+'</span><img class="alongDelete" src="./images/close.png" /></div><div class="courseinp"><div class="time"><span>'+Language.first_Language+'</span> <input type="text" readonly isok="0"><ul class="alongCourse native_languages"></ul></div><div class="language"><span>'+Language.second_language+'</span> <input type="text" language="" readonly isok="0"';
            html += '><ul class="languagechoose alongCourse sec_languages">';
            html += '</ul></div><div class="classify"><span>'+Language.series_classification+'</span> <input type="text" readonly isok="0"><ul class="alongCourse categoryCourse">';
           	html += '</ul></div><div class="difficult"><span>'+Language.difficulty+'</span> <input type="text" readonly isok="0"><ul class="alongCourse difficultyCourse">';
           	html += '</ul></div><div class="navtitle"><span>'+ Language.series_title+'</span> <input type="text" maxlength="50" onkeyup="setShowLength(this,50,&quot;navinp&quot;)"><div class="news" id="navinp">'+Language.also_you_can_enter+50+Language.word+'</div></div><div class="des"><span>'+Language.series_description+'</span><textarea></textarea></div><div class="imgChoose"><span class="imgtext">'+Language.series_Cover+'</span><div class="imgUpDate"><span></span></div></div>';
            html += '<div class="clear"></div></div><div class="btnGroupByNew clear">' +
                '               <div class="confirm save courseinpNewFr">' + Language.save + '</div>' +
                '           </div></div>';
            $(html).appendTo($('body'));
            $('.courseinp .imgChoose .imgUpDate').attr('cover','http://7xk8ky.com1.z0.glb.clouddn.com/syb9zeg75sdundefinedgsc3osrq175oqnt5k4drh9zt.png').css({backgroundImage: 'url(http://7xk8ky.com1.z0.glb.clouddn.com/syb9zeg75sdundefinedgsc3osrq175oqnt5k4drh9zt.png)',backgroundSize:'100% 100%'}).on('mouseover',function(){
                $(this).find('span').css({display:'block'})
            }).on('mouseout',function(){
                $(this).find('span').css({display:'none'})
            });
           
            /*长传图片的点击事件*/
           	up_post_func()
           courseInputFunc(lang,0,second_language_Func);
           SeriesSave(url,dataSeries,fn);
           
};

/*编辑系列 */
function editSerise(mid,lang,url,dataSeries,fn){
    $.ajax({
                url:seriesDetailsUrl,
                type:'post',
                data:{
                    seriesId:mid,
                    lang:lang  
                },
                success:function(dataList) {
                	 /*传递H5编辑页面的URL*/
                    var difficultyEdit = dataList.result.difficulty.id;
                    var difficultyVal = dataList.result.difficulty.display;
                    var categoryEdit = dataList.result.category.id;
                    var categoryVal = dataList.result.category.display;
                    var titleEdit = dataList.result.title;
                   var descEdit = dataList.result.desc;
                    var durationEdit = dataList.result.forNativeLanguage.id;
                    var durationVal = dataList.result.forNativeLanguage.display;
                    var coverEdit = dataList.result.cover;
                     var forPeopleLanguageIdsEdit = '';
                    var forPeopleLanguageIdsEditDis = '';
                   
            var html = '<div class="course-along"><div class="title"><span>'+Language.edit_series+'</span><img class="alongDelete" src="./images/close.png" /></div><div class="courseinp"><div class="time"><span>'+Language.first_Language+'</span> <input type="text" readonly isok="0" value="'+durationVal+'" first_language="'+durationEdit+'"><ul class="alongCourse native_languages"></ul></div><div class="language"><span>'+Language.second_language+'</span> <input type="text" readonly isok="0"';
            html += '><ul class="languagechoose alongCourse sec_languages">';
            html += '</ul></div><div class="classify"><span>'+Language.series_classification+'</span> <input type="text" readonly isok="0" value="'+categoryVal+'" categories="'+categoryEdit+'"><ul class="alongCourse categoryCourse">';
            html += '</ul></div><div class="difficult"><span>'+Language.difficulty+'</span> <input type="text" readonly isok="0" value="'+difficultyVal+'" difficulties="'+difficultyEdit+'"><ul class="alongCourse difficultyCourse">';
            html += '</ul></div><div class="navtitle"><span>'+ Language.series_title+'</span> <input type="text" maxlength="50" onkeyup="setShowLength(this,50,&quot;navinp&quot;)" value="'+titleEdit+'"><div class="news" id="navinp">'+Language.also_you_can_enter+(50-titleEdit.length)+Language.word+'</div></div><div class="des"><span>'+Language.series_description+'</span><textarea>'+descEdit+'</textarea></div><div class="imgChoose"><span class="imgtext">'+Language.series_Cover+'</span><div class="imgUpDate" cover="'+coverEdit+'" style="background-image:url('+coverEdit+');background-size:100% 100%;"><span></span></div></div>';
            html += '<div class="clear"></div></div><div class="btnGroupByNew clear">' +
                '               <div class="confirm save courseinpNewFr">' + Language.save + '</div>' +
                '           </div></div>';
            $(html).appendTo($('body'));
             second_languageShow(dataList.result.forSecNativeLanguages);
            second_language_Func(durationEdit,lang);
            courseInputFunc(lang,second_languageShow(dataList.result.forSecNativeLanguages),second_language_Func);
            	$('.courseinp .imgChoose .imgUpDate').on('mouseover',function(){
	                $(this).find('span').css({display:'block'})
	            }).on('mouseout',function(){
	                $(this).find('span').css({display:'none'})
	            });
	            /*长传图片的点击事件*/
	           	up_post_func();
           		SeriesSave(url,dataSeries,fn,{seriesId:mid});
           	
            }
        })
};
/*系列的保存方法*/
function SeriesSave(url,dataPost,fn,obj){
	var clicktag = 0; 
	$('.course-along .save').off().on('click',function(){
		  /*向后台传输数据*/
                var difficulty = $('.courseinp .difficult input').attr('difficulties');
                var category = $('.courseinp .classify input').attr('categories');
                var title = $('.courseinp .navtitle input').val();
                var desc = $('.courseinp .des textarea').val();
                var duration = $('.courseinp .time input').attr('first_language');
                var cover = $('.courseinp .imgChoose .imgUpDate').attr('cover');
                var forPeopleLanguageIds = $('.courseinp .language input').attr('language');
                var dataGet = {
				 		category:category,
				 		cover:cover,
				 		desc:desc,
				 		difficulty:difficulty,
				 		forNativeLanguage:duration,
				 		forSecNativeLanguages:forPeopleLanguageIds,
				 		title:title,
				 		serviceLanguage:userInformation.language,
				 		creator:userInformation.userId,
				 		source:orgId
				 	};
				if(obj){
					for(var key in obj){
						dataGet[key] = obj[key];
					}
				}
				if(!duration){
                    alert(Language.You_must_select);
                    return
                }else if($('.courseinp .classify input').val() == ''){
                    alert(Language.Please_select_the_series);
                    return
                }else if($('.courseinp .difficult input').val() == ''){
                    alert(Language.Please_select_the_level);
                    return
                }else if(title == ''){
                    alert(Language.Please_enter_the_topic);
                    return
                }else if(desc == ''){
                    alert(Language.Description);
                    return
                }else if(cover == ''){
                    alert(Language.Please_add_the_cover);
                    return
                }
                if(clicktag == 0){
                	clicktag = 1;
                	 $.ajax({
					 	url:addSeriesSaveUrl,
					 	type:'post',
					 	data:dataGet,
					 	success:function(data){
					 		if(data.code == 200){
					 			 $('.course-along').remove();
							 	 $('.worDoorShade').remove();
					 			setTimeout(function(){
					 				fn&&fn(url,dataPost);
							 		clicktag == 0;
					 			},1000) 
					 		}
					 	}
				 	})
                }
				
         });
}
/*编辑课程 */
function editCourse(mid,lang){
	$.ajax({
                url:courseDetailsUrl,
                type:'post',
                data:{
                    materialId:mid,
                    lang:lang
                },
                success:function(dataList) {
                	var difficultyEdit = dataList.result.difficulty.id;
                    var difficultyVal = dataList.result.difficulty.display;
                    if(dataList.result.category){
                    	var categoryEdit = dataList.result.category.id;
                   		var categoryVal = dataList.result.category.display;
                    }else{
                    	var categoryEdit = '';
                   		var categoryVal = '';
                    }
                    var titleEdit = dataList.result.title;
                   var descEdit = dataList.result.desc;
                    var durationEdit = dataList.result.forNativeLanguage.id;
                    var durationVal = dataList.result.forNativeLanguage.display;
                    var coverEdit = dataList.result.cover;
                    
             var html = '<div class="course-along"><div class="title"><span>'+Language.course_information+'</span><img class="alongDelete" src="./images/close.png" /></div><div class="courseinp"><div class="time"><span>'+Language.first_Language+'</span> <input type="text" readonly isok="0" value="'+durationVal+'" first_language="'+durationEdit+'"><ul class="alongCourse native_languages"></ul></div><div class="language"><span>'+Language.second_language+'</span> <input type="text" readonly isok="0"';
            html += '><ul class="languagechoose alongCourse sec_languages">';
            html += '</ul></div><div class="classify"><span>'+Language.course_classification+'</span> <input type="text" readonly isok="0" value="'+categoryVal+'" categories="'+categoryEdit+'"><ul class="alongCourse categoryCourse">';
            html += '</ul></div><div class="difficult"><span>'+Language.difficulty+'</span> <input type="text" readonly isok="0" value="'+difficultyVal+'" difficulties="'+difficultyEdit+'"><ul class="alongCourse difficultyCourse">';
            html += '</ul></div><div class="navtitle"><span>'+ Language.coyurse_title+'</span> <input type="text" maxlength="50" onkeyup="setShowLength(this,50,&quot;navinp&quot;)" value="'+titleEdit+'"><div class="news" id="navinp">'+Language.also_you_can_enter+(50-titleEdit.length)+Language.word+'</div></div><div class="des"><span>'+Language.course_description+'</span><textarea>'+descEdit+'</textarea></div><div class="imgChoose"><span class="imgtext">'+Language.Cover+'</span><div class="imgUpDate" cover="'+coverEdit+'" style="background-image:url('+coverEdit+');background-size:100% 100%;"><span></span></div></div>';
            html += '<div class="clear"></div></div><div class="btnGroupByNew clear">' +
                '               <div class="confirm save courseinpNewFr">' + Language.save + '</div>' +
                '           </div></div>';  
            $(html).appendTo($('body'));
            second_languageShow(dataList.result.forSecNativeLanguages);
           second_language_Func(durationEdit,lang);
            courseInputFunc(lang,second_languageShow(dataList.result.forSecNativeLanguages),second_language_Func);

            $('.courseinp .imgChoose .imgUpDate').on('mouseover',function(){
                $(this).find('span').css({display:'block'})
            }).on('mouseout',function(){
                $(this).find('span').css({display:'none'})
            });
            /*长传图片的点击事件*/
           	up_post_func();
           	courseSave({materialId:mid}); 
           		
            } 
        })  
};

/*新增课程*/
function addNewCourse(lang){
			var html = '<div class="course-along"><div class="title"><span>'+Language.add_courses+'</span><img class="alongDelete" src="./images/close.png" /></div><div class="courseinp"><div class="time"><span>'+Language.first_Language+'</span> <input type="text" readonly isok="0"><ul class="alongCourse native_languages"></ul></div><div class="language"><span>'+Language.second_language+'</span> <input type="text" language="" readonly isok="0"';
            html += '><ul class="languagechoose alongCourse sec_languages">';
            html += '</ul></div><div class="classify"><span>'+Language.course_classification+'</span> <input type="text" readonly isok="0"><ul class="alongCourse categoryCourse">';
           	html += '</ul></div><div class="difficult"><span>'+Language.difficulty+'</span> <input type="text" readonly isok="0"><ul class="alongCourse difficultyCourse">';
           	html += '</ul></div><div class="navtitle"><span>'+ Language.coyurse_title+'</span> <input type="text" maxlength="50" onkeyup="setShowLength(this,50,&quot;navinp&quot;)"><div class="news" id="navinp">'+Language.also_you_can_enter+50+Language.word+'</div></div><div class="des"><span>'+Language.course_description+'</span><textarea></textarea></div><div class="imgChoose"><span class="imgtext">'+Language.Cover+'</span><div class="imgUpDate"><span></span></div></div>';
            html += '<div class="clear"></div></div><div class="btnGroupByNew clear">' +
                '               <div class="confirm save courseinpNewFr">' + Language.save + '</div>' +
                '           </div></div>';
            $(html).appendTo($('body'));
            $('.courseinp .imgChoose .imgUpDate').attr('cover','http://7xk8ky.com1.z0.glb.clouddn.com/syb9zeg75sdundefinedgsc3osrq175oqnt5k4drh9zt.png').css({backgroundImage: 'url(http://7xk8ky.com1.z0.glb.clouddn.com/syb9zeg75sdundefinedgsc3osrq175oqnt5k4drh9zt.png)',backgroundSize:'100% 100%'}).on('mouseover',function(){
                $(this).find('span').css({display:'block'})
            }).on('mouseout',function(){
                $(this).find('span').css({display:'none'})
            });
            
            /*长传图片的点击事件*/
           	up_post_func()  
           	courseInputFunc(lang,0,second_language_Func);
           	courseSave();
            
}; 
/*课程的保存方法*/
function courseSave(obj){
	var sceneUrl = ADD_SCENE;
	var clicktag = 0; 
	var user_id = userInformation.userId;
	$('.course-along .save').off().on('click',function(){
		  /*向后台传输数据*/
                var difficulty = $('.courseinp .difficult input').attr('difficulties');
                var category = $('.courseinp .classify input').attr('categories');
                var title = $('.courseinp .navtitle input').val();
                var desc = $('.courseinp .des textarea').val();
                var duration = $('.courseinp .time input').attr('first_language');
                var cover = $('.courseinp .imgChoose .imgUpDate').attr('cover');
                var forPeopleLanguageIds = $('.courseinp .language input').attr('language');
                var dataGet = {
				 		category:category,
				 		cover:cover,
				 		desc:desc,
				 		difficulty:difficulty,
				 		forNativeLanguage:duration,
				 		forSecNativeLanguages:forPeopleLanguageIds,
				 		title:title,
				 		serviceLanguage:userInformation.language,
				 		authorId:userInformation.userId,
				 		source:orgId
				 	};
				if(obj){ 
					for(var key in obj){
						dataGet[key] = obj[key];
					}
					sceneUrl = EDIT_SCENE;
				}
				if(!duration){
                    alert(Language.You_must_select);
                    return
                }else if($('.courseinp .classify input').val() == ''){
                    alert('请选择课程分类');
                    return
                }else if($('.courseinp .difficult input').val() == ''){
                    alert(Language.Please_select_the_level);
                    return
                }else if(title == ''){
                    alert(Language.Please_enter_the_topic);
                    return
                }else if(desc == ''){
                    alert(Language.Description);
                    return
                }else if(cover == ''){
                    alert(Language.Please_add_the_cover);
                    return
                } 
                if(clicktag == 0){
                	clicktag = 1;
                	 $.ajax({
						 	url:courseSaveUrl,
						 	type:'post',
						 	data:dataGet,
						 	success:function(data){
						 		if(data.code == 200){
						 			var materialId = data.result.id;
						 			var user_id = data.result.authorId;
									if(data.result.ref){
						 				materialId = data.result.ref 
						 			}
						 			if(data.result.refAuthorId){ 
						 				user_id = data.result.refAuthorId;
						 			}
						 			var languagePost = 'zh-CN';
						 			if(Lang == 'English'){
						 				languagePost = 'en';
						 			}
						 			var redirect_url = escape(urlPost+'/indexEdit.html');
						 			$.ajax({
										url:H5UrlGiveUrl,
										data:{ 
											encodeUrl:'wordoor'
										},  
										type:'post', 
										success:function(dataUrl){
											if(data.code == 200){
												var urlToken = dataUrl.result;
											 	//var EditH5Url = sceneUrl +'course_id='+ materialId + '&user_id=' +user_id+'&lang='+languagePost+'&redirect_url='+redirect_url+'&token='+urlToken;
												
												var EditH5Url = 'http://192.168.1.82:9080/index.html?material_id='+materialId+'&from=wordoor&access_token='+ localStorage.getItem('wordoor_access_token'); 
												window.location.href = EditH5Url;    
												setTimeout(function () { clicktag = 0 }, 1000);      
											}  
										} 
									})
						 		}
						 		
						 	}
					})
                }
				
              });
}

  function second_languageShow(language){
    	 var forPeopleLanguageIdsEdit = '';
        var forPeopleLanguageIdsEditDis = '';
        if(language){
        	$.each(language,function(index,item){
                forPeopleLanguageIdsEdit +=item.id +',';
				forPeopleLanguageIdsEditDis += item.display +' ';
            });
            var number_language = language.length;
            forPeopleLanguageIdsEdit = forPeopleLanguageIdsEdit.replace(/(^,)|(,$)/g,'');
        	forPeopleLanguageIdsEditDis = forPeopleLanguageIdsEditDis.replace(/(^\s+)|(\s+$)/g,'');
        }
        $('.courseinp .language input').attr('language',forPeopleLanguageIdsEdit).val(forPeopleLanguageIdsEditDis);
        return number_language
    }
/*修改课程添加到系列的方法*/
function EditNewCourseToSeries(item,url,postData,func){
			 var navHtml = "";
            navHtml += "<div class=\"nav-along\">\n";
            navHtml += "	<div class=\"title\">\n";
            navHtml += "		<span>"+Language.choose_series+"<\/span><img class='nav-delete' src='./images/close.png' alt=''>\n";
            navHtml += "	<\/div>\n";
           	navHtml += "<div class='chooseSeries'><div>"+Language.Select_series_to+"</div><div class='centerDiv'><input class='inpchoose seriesName' type='text' /><ul class='seriesUl seriesNameUl'></ul><div class='showseriesLi'></div></div><div style='clear:both;'></div></div>";
          	 navHtml += "<div class='chooseSeries numberSeries'><div>"+Language.Select_the_order_inside_series+"</div><div class='centerDiv'><input class='inpchoose seriesNumber' readonly='readonly' type='text' /><ul class='seriesUlNumber seriesUl'></ul><div class='showseriesLi'></div></div><div style='clear:both;'></div></div>";
            navHtml += "<div style='margin:50px 0 0 30px;'>"+Language.Added_to_Series+"</div>";
            navHtml += "<ul class='addedSeries'></ul>";
            navHtml += "	<div class=\"btnGroupByNew clear\">\n";
            navHtml += "		<div class=\"confirm save courseinpNewFr\">\n";
            navHtml += "			"+Language.add+"\n";
            navHtml += "		<\/div>\n";
           /* navHtml += "		<div class=\"cancel courseinpNewFr\">\n";
            navHtml += Language.previous_step;
            navHtml += "		<\/div>\n";*/
            navHtml += "	<\/div>\n";
            navHtml += "<\/div>\n";
            $(navHtml).appendTo($('body'));
            addNewCourseToSeriesEvent(item,url,postData,func);
     
};
/*课程添加到系列中系列列表的分页显示*/
function seriesListShow(num,item,title){
	if(title){
		var title = title;
	}else{
		var title = '';
	}
	var difficulty = item.difficulty.id;
	var category = item.category.id;
	var forNativeLanguage = item.forNativeLanguage.id;
	var serviceLanguage = item.serviceLanguage.id;
	var forSecNativeLanguages = '';
	if(item.forSecNativeLanguages){
		 $.each(item.forSecNativeLanguages,function(index,item){
	        forSecNativeLanguages +=item.id +' ';
		});
	    forSecNativeLanguages = forSecNativeLanguages.replace(/(^\s+)|(\s+$)/g,'');
	}
	 $.ajax({
     	 	url:seriesListUrl,
     	 	data:{
     	 		pn:num,
     	 		ps:6,
     	 		lang:Lang,
     	 		creator:userInformation.userId,
     	 		forNativeLanguage:forNativeLanguage,
     	 		forSecNativeLanguages:forSecNativeLanguages,
     	 		serviceLanguage:serviceLanguage,
     	 		difficulty:difficulty,
     	 		auditStatus:2,
     	 		q:title
     	 	},
     	 	type:'post',
     	 	success:function(data){
     	 		var html = '';
     	 		if(data.result.totalItemsCount == 0){
     	 			html += '<div>'+Language.No_maching_series+'</div>';
     	 		}else{
     	 			$.each(data.result.items,function(index,item){
	     	 			html +='<li seriesId="'+item.id+'" num="'+item.resourceNum+'">'+item.title+'</li>';
	     	 		})
	     	 		if(data.result.totalItemsCount > 6){
	     	 			html +='<div style="position:absolute;width:100%;background:#fff;"><span class="nextPage" num="'+data.result.totalItemsCount+'">'+Language.next+'</span><span class="prevPage">'+Language.previous+'</span></div>';
	     	 		}
     	 		} 
     	 		$('.seriesNameUl').html(html);
     	 	}
     	 })
}
/*序列号的显示*/
function numberSortShow(pn){
		var html = '';
		var bigNum = pn*5;
		var number = Number($('.seriesNumber').attr('num'));
		if(number<=5){
			for(var i =0;i<(number+1);i++){
	    		html += '<li>'+(i+1)+'</li>';
	    	}
		}else{
			if(pn<=1){
				pn = 1
			}else if(bigNum>=number){
				pn = Math.ceil(number/5);
				bigNum = number+1;
			}
			for(var i =(5*pn-5);i<bigNum;i++){
	    		html += '<li>'+(i+1)+'</li>';
	    	}
	    	html +='<div style="position:absolute;width:100%;background:#fff;"><span class="nextPage" number="'+number+'">'+Language.next+'</span><span class="prevPage">'+Language.previous+'</span></div>';
		}
		
    	$('.seriesUlNumber').html(html);
}
/*课程加入的系列*/
function courseInSeriesAllFunc(materialId,fn){
	var html = '';
	$.ajax({
		url:courseInSeriesAll,
		type:'post',
		data:{
			materialId:materialId
		},
		success:function(data){
			fn && fn(data);
		}
	})
}
/*课程加入系列弹框的方法函数*/
function addNewCourseToSeriesEvent(item,url,postData,func){
	var pageListSeries = 1;
	var pageListSort = 1;
	courseInSeriesAllFunc(item.id,function(data){
		var html = '';
		if(data.code == 200 && data.result.length != 0){
				 $('.numberSeries').css({display:'block'});
				data.result.forEach(function(item,index){
					html += '<li num="'+item.sort+'">'+item.title+'</li>';
				})
			}
			$('.addedSeries').html(html);
	});
	$('.seriesName').on('click',function(e){
		seriesListShow(pageListSeries,item);
		$('.seriesNumber').val('');
		e.stopPropagation();
   	})
   	$('.seriesName').on('keyup',function(e){
   		var title = $(this).val();
		seriesListShow(pageListSeries,item,title);
		$('.seriesNumber').val('');
		e.stopPropagation();
   	})
   	$(document).on('click',function(){
   		$('.seriesNameUl').html('');
   	})
	/*分页显示系列和序号*/
	$('.seriesNameUl').delegate('.nextPage','click',function(){
    	pageListSeries+=1;
    	var number = $(this).attr('num');
    	if(pageListSeries >= Math.ceil(number/6)){
    		pageListSeries = Math.ceil(number/6)
    	}
    	seriesListShow(pageListSeries,item);
    })
    $('.seriesNameUl').delegate('.prevPage','click',function(){
    	pageListSeries-=1;
    	if(pageListSeries<=1){
    		pageListSeries=1;
    	}
    	seriesListShow(pageListSeries,item);
    })
    $('.seriesUlNumber').delegate('.nextPage','click',function(){
    	pageListSort+=1;
    	numberSortShow(pageListSort)
    })
    $('.seriesUlNumber').delegate('.prevPage','click',function(){
    	pageListSort-=1;
    	if(pageListSort <= 0){
    		pageListSort = 1;
    	}
    	numberSortShow(pageListSort)
    })
  $('.seriesUl').delegate('li','mouseover',function(){
        $(this).css({backgroundColor:'#09c0ce'});
    }).delegate('li','mouseout',function(){
        $(this).css({backgroundColor:'#fff'});
    });

    $('.seriesNameUl').delegate('li','click',function(){
    	$('.seriesName').val($(this).text()).attr('seriesId',$(this).attr('seriesId'));
       $('.seriesNameUl').html('');
       $('.numberSeries').css({display:'block'}).find('.seriesNumber').attr('num',$(this).attr('num'));
    })
    $('.seriesNumber').on('click',function(){
    	var number = $(this).attr('num');
    	numberSortShow(pageListSort,number);
	})
    $('.seriesUlNumber').delegate('li','click',function(){
    	$('.seriesNumber').val($(this).text());
       $('.seriesUlNumber').html('');
    }) 
    
    $('.addedSeries').delegate('li','click',function(){
    	var content = $(this).text();
    	var number = $(this).attr('num');
    	$(this).css({backgroundColor:'#f9f9f9'}).siblings().css({backgroundColor:'#fff'});
    	$('.seriesNumber').val(number);
    	$('.seriesName').val(content);
    })
  	$('.btnGroupByNew .save').on('click',function(){
  		addCourseToCourseSave(item);
    })
    $('.nav-delete').on('click',function(){
    	$('.worDoorShade').remove();
    	$('.nav-along').remove();
    	func&&func(url,postData);
    })	
};

/*添加课程到系列的请求*/
function addCourseToCourseSave(item){
		var content = $('.seriesName').val();
    	var number = $('.seriesNumber').val();
    	var html = '';
    	if( content== '' || number ==''){
    		alert(Language.Please_select_the_series_and_order);
    	}else{
    		$.ajax({
				url:courseToSeries,
				type:'post',
				data:{
					materialId:item.id,
					seriesId:$('.seriesName').attr('seriesId'),
					sort:number
				},
				success:function(data){
					if(data.code ==200){
						html = '<li num="'+number+'">'+$('.seriesName').val()+'</li>';
						$(html).appendTo($('.addedSeries'));
					}else if(data.code == 991){
						alert(Language.Have_added_to_the_series);
					}else{
						alert(Language.The_lesson_not_match_the_series);
					}
				}
			})
    		
    	}
}
/*课程输入框的方法函数*/
function courseInputFunc(lang,number,fn){
	var sec_languagesNumbers = number;
	/*如果是英文时就让标题的行高减小以适应长度*/
    if(lang == 'English' || lang == 'Spanish'){
        $('.courseinp .language span,.courseinp .time span,.courseinp .difficult span,.courseinp .classify span').css({lineHeight:'20px'});
    }else{
    	$('.courseinp .language span').css({lineHeight:'20px'});
    }
	var first_Language = '';
	/*母语的获取*/
	 $.ajax({
            	url:native_languagesUrl,
            	type:'post',
            	data:{
            		lang:lang
            	},
            	headers:{
            		'Accept-Language':lang
            	},
            	success:function(data){
            		var html = '';
            		$.each(data.result,function(index,item){
            			html += '<li first_Language="'+item.id+'">'+item.display+'</li>';
            		})
            		$('.native_languages').html(html);
            	}
            })
	 /*难度分类列表的获取*/
	 $.ajax({
            	url:difficultiesUrl,
            	type:'post',
            	data:{
            		lang:lang
            	},
            	headers:{
            		'Accept-Language':lang
            	},
            	success:function(data){
            		var html = '';
            		$.each(data.result,function(index,item){
            			html += '<li difficulties="'+item.id+'">'+item.display+'</li>';
            		})
            		$('.difficultyCourse').html(html);
            	}
            })
	 /*内容类别列表的获取*/
	 $.ajax({
            	url:categoriesUrl,
            	type:'post',
            	data:{
            		lang:lang
            	},
            	headers:{
            		'Accept-Language':lang
            	},
            	success:function(data){
            		var html = '';
            		$.each(data.result,function(index,item){
            			html += '<li categories="'+item.id+'">'+item.display+'</li>';
            		})
            		$('.categoryCourse').html(html);
            	}
            })
	 /*输入框的点击事件*/
            var inputAll = $('.courseinp .language input,.courseinp .classify input,.courseinp .difficult input,.courseinp .time input');
            inputAll.on('click',function(ev){
				if($(this).attr('isok') == '1'){
                    $(this).next("ul").slideUp(300);
                    $(this).attr('isok','0');
                }else{
                    $(this).attr('isok','1').next("ul").slideDown(300);
                }
                $(this).parent().siblings().find('input').attr('isok','0');
                $(this).parent().siblings().find('ul').css({display:'none'}).end().find('input').css({border:'1px solid #dbdbdb'});
                $(this).css({border:'1px solid #09c0ce'});
                ev.stopPropagation();

            });
            /*下拉列表的移入移出事件*/
            var classifyLi = $('.courseinp .classify ul');
            var timeLi =  $('.courseinp .time ul');
            var difficultLi =  $('.courseinp .difficult ul');
            var languageLi = $('.courseinp .language ul');
            var courseLi = $('.courseinp .classify ul, .courseinp .time ul, .courseinp .difficult ul');
            courseLi.delegate('li','mouseover',function(){
                $(this).css({backgroundColor:'#09c0ce'});
            }).delegate('li','mouseout',function(){
                $(this).css({backgroundColor:'#fff'});
            });
            /*点击下拉列表选中值事件*/
            classifyLi.delegate('li','click',function(ev){
                var content = $(this).text();
                $(this).parent().prev().val(content).attr('isok','0').attr('categories',$(this).attr('categories'));
                $(this).parent().slideUp(300);
                ev.stopPropagation();
            });
            timeLi.delegate('li','click',function(ev){
            	var new_arr = [];
                var first_Language = $(this).text();
                var second_language = $(this).attr('first_Language');
                var second_lang_display = $('.language input').val();
                var second_lang_id = $('.language input').attr('language');
                if(second_lang_display){
                	second_lang_display = second_lang_display.split(' ');
                	second_lang_id = second_lang_id.split(',');
                	second_lang_display.forEach(function(item,index){
                		var newObj = {};
                		if(item != first_Language){
                			newObj.display = item;
                			newObj.id = second_lang_id[index];
                			new_arr.push(newObj);
                		}
                	})
                	sec_languagesNumbers = new_arr.length;
                	second_languageShow(new_arr);
                }
                $(this).parent().prev().val(first_Language).attr('first_Language',$(this).attr('first_Language')).attr('isok','0');
               fn && fn(second_language,lang);
                $(this).parent().slideUp(300);
                ev.stopPropagation();
            });
            difficultLi.delegate('li','click',function(ev){
                var content = $(this).text();
                $(this).parent().prev().val(content).attr('isok','0').attr('difficulties',$(this).attr('difficulties'));
                $(this).parent().slideUp(300);
                ev.stopPropagation();
            });

            /*语言输入框的点击事件，可以多选*/
            languageLi.delegate('li','click',function(ev){
            	var language = $(this).attr('class');
                var content = $(this).text();
                var languageInpVal = $(this).parent().prev();
                var languageId = $(this).attr('language');
                var languageInpId = languageInpVal.attr('language');
                if(language == 'language-active'){
                	sec_languagesNumbers-=1;
                    $(this).attr('class','language-unactive');
                    var lanres = languageInpVal.val().replace(content,'');
                    lanres = lanres.replace(/(^\s+)|(\s+$)/g,'');
                    languageInpVal.val(lanres);
					languageInpId = languageInpId.replace(languageId,'').replace(/(^,)|(,$)/g,'').replace(/,,/,',');
                    languageInpVal.attr('language',languageInpId);
                }else{
                	sec_languagesNumbers+=1;
                	if(sec_languagesNumbers >3){
                		alert(Language.You_can_only_add_3_languages);
                		sec_languagesNumbers = 3;
                	}else{
                		 $(this).attr('class','language-active');
	                    var saveres = languageInpVal.val() + ' ' + content;
	                    saveres = saveres.replace(/^\s+/g,'');
	                    languageInpVal.val(saveres); 
	                    languageInpId += ','+ languageId ;
	                    languageInpId = languageInpId.replace(/(^,)|(,$)/g,'').replace(/,,/,',');
	                    languageInpVal.attr('language',languageInpId);
                	}
                   
                }
                 ev.stopPropagation();
            });
            /*点击document关闭所有下拉列表*/
            $(document).on('click',function(){
                $('.courseinp ul').slideUp(300);
                $('.courseinp input').css({border:'1px solid #dbdbdb'});
                inputAll.attr('isok','0');
            });
            /*标题的点击事件*/
            $('.courseinp .navtitle input').on('click',function(){
                $(this).css({border:'1px solid #09c0ce'});
                $(this).parent().siblings().find('input').css({border:'1px solid #dbdbdb'});
                return false;
            }).on('blur',function(){
                $(this).css({border:'1px solid #dbdbdb'});
                return false;
            });
            /*描述的点击事件*/
            $('.courseinp .des textarea').on('click',function(){
                $(this).css({border:'1px solid #09c0ce'});
                $(this).parent().siblings().find('input').css({border:'1px solid #dbdbdb'});
                return false;
            }).on('blur',function(){
                $(this).css({border:'1px solid #dbdbdb'});
                return false;
            });

            /* 点击右上角的关闭按钮*/
            $('.alongDelete').on('click',function(){
                $('.course-along').remove();
                $('.worDoorShade').remove();
            });
}
/*第二语言的列表获取*/
function second_language_Func(language,lang){
	/*第二语言的获取*/
			 $.ajax({
		            	url:sec_languagesUrl,
		            	type:'post',
		            	data:{
		            		filterLanguage:language,
		            		lang:lang
		            	},
		            	headers:{
		            		'Accept-Language':lang
		            	},
		            	success:function(data){
		            		var html = '';
		            		$.each(data.result,function(index,item){
		            			html += '<li class="language-unactive" language="'+item.id+'" index="'+index+'">'+item.display+'</li>';
		            		})
		            		$('.sec_languages').html(html);
		            		/*语言一栏返回相应下拉列表被选中的状态*/
				            var languageValue = $('.courseinp .language input').val();
				            var languageLi = $('.courseinp .sec_languages li');
				            if(languageValue){
				            	languageLi.each(function(index,item){
				                    if(languageValue.indexOf($(item).text()) != -1){
				                        $('.courseinp .sec_languages li').eq(index).attr('class','language-active');
				                    }
				                })
				            }
		            	}
	            })
}

/*上传图片函数*/
  function up_post_func(){
        var uptoken = '';
          $.ajax({
            type:'get',
            url:uploadImgUrl,
            async:false,
            headers:{
            	'A-Token-Header':userInformation.token
            },
            success:function(data){
              uptoken =data.upToken;
              /*长传图片的点击事件*/
               $('.imgUpDate span').upLoad({
                'display': 'none',
                'html': Language.Upload_pictures,
                uptoken: uptoken, 
                domain: 'http://7xk8ky.com1.z0.glb.clouddn.com/',
                max_file_size: '100mb',
                }, function (src, width, height) {
                	shadeCropWrap();
                	var html = '<div class="cropWrap leftCenter"><div class="cropBtns"><div class="saveCurtPic pop_btns pop-btnsDeep pop_btns-small pop_circle pop_delete">' + Language.confirm + "</div><div class='cancleCurtPic pop_btns pop-btnsShallow pop_btns-small pop_circle pop_cancel'>" + Language.cancel + '</div></div><img src=' + src + ' id=' + 'cropbox' + ' /></div>';
                	$(html).appendTo($('body'));
                	if($('#cropbox').width() >= $('body').width()){
                		$('#cropbox').css({width:$('body').width()});
                	}
                	 $('#cropbox').Jcrop({
	                   aspectRatio: 1.6,
	                   onSelect: updateCoords,
						setSelect: [0, 0, 320, 200]
	                }, function () {

	                });

                	 $('.cropBtns .cancleCurtPic').off().on('click',function(){
                	 	$('.cropWrap').remove();
                	 	$('.worDoorCropWrap').remove();
                	 })
                	  $('.cropBtns .saveCurtPic').off().on('click', function () {
                	  		$.ajax({
                	  			url:imgCutUrl,
                	  			type:'post',
                	  			data:{
                	  				oldImgUrl:src,
                	  				startX:x,
                	  				startY:y,
                	  				width:w,
                	  				height:h
                	  			},
                	  			success:function(data){
                	  				if(data.code == 200){
                	  					var newUrl = data.result.newUrl;
                	  					 $('.courseinp .imgChoose .imgUpDate').attr('cover',newUrl).css({backgroundImage:'url('+newUrl+')',backgroundSize:'100% 100%'});
                	  					$('.cropWrap').remove();
                	 					$('.worDoorCropWrap').remove();
                	  				}
                	  			}
                	  		})
                	  		
                	  })

                	    var x = 0;
		                var y = 0;
		                var w = 160;
		                var h = 100;

		                function updateCoords(c) {
		                	x = parseInt(c.x);
		                    y = parseInt(c.y);
		                    w = parseInt(c.w);
		                    h = parseInt(c.h);
		                }
                  
            	});
            }
          });
        }


 (function ($) {
		function upLoad(options,fn) {
			var defaults = {
            runtimes: 'html5,flash,html4',    //上传模式,依次退化
            browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
            //uptoken: 'b6IUnkFTntc_V8N9xwvjpoeTTWfZtb8GvJPVBa9f:HuzUTMQm2PAYzY4NvGZHz0C9FQU=:eyJzY29wZSI6InVuNWxpc3QiLCJkZWFkbGluZSI6MTQ2NTg5OTU2MH0=',
          	//  uptoken_url: '/course/tutor/qiniu-token',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
            // uptoken : '', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
            // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
            // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
            domain: '',
            get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
           // container: 'upContent',           //上传区域DOM ID，默认是browser_button的父元素，
         	//   max_file_size: '100mb',           //最大文件体积限制
            flash_swf_url: 'Moxie.swf',
            max_retries: 3,                   //上传失败最大重试次数
            dragdrop: true,                   //开启可拖曳上传
          	//  drop_element: 'upContent',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: '4mb',                //分块上传时，每片的体积
            auto_start: true,              //选择文件后自动上传，若关闭需要自己绑定事件触发上传
			selfCallBack:function(){},
            init: {
                'FilesAdded': function (up, files) {
					//添加文件前,处理相关的事情
				},
                'BeforeUpload': function (up, file) {
                	 // 每个文件上传前,处理相关的事情
                	if(file.type.indexOf('image') == -1){
                		alert('请选择图片文件');
                		return false
                	}
                 
                },
                'UploadProgress': function (up, file) {
                    // 每个文件上传时,处理相关的事情
                   // $('#'+defaults.progressId).html(file.percent);
					/*var dom = document.getElementById(defaults.progressId);
					$(dom).html(file.percent + '%');
					if(file.percent==100){
						$(dom).html('');
					}*/
				},
                'FileUploaded': function (up, file, info) {

                    // 每个文件上传成功后,处理相关的事情
                    // 其中 info 是文件上传成功后，服务端返回的json，形式如
                    // {
                    //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                    //    "key": "gogopher.jpg"
                    //  }
                  	var domain = up.getOption('domain');
                    var res = JSON.parse(info);
                    var sourceLink = domain + res.key;
                   	var type = file.type;
					var img = new Image();
					img.onload=function () {
						var w = this.width;
						var h = this.height;
						defaults.selfCallBack.apply(this,[sourceLink,w,h]);
					}
					img.src=sourceLink;
				 },
                'Error': function (up, err, errTip) {
                    //上传出错时,处理相关的事情
                },
                'UploadComplete': function (up,file) {
                    //队列文件处理完毕后,处理相关的事情

                },

                'Key': function (up, file) {
					// 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效

					//随机字符串  的名字  就是key的名字

					return randomName();
					function randomName(){
						var arr = 'abcdefghigklmnopqrstuvwxyz1234567890'.split('');
						var len = arr.length;
						var str = '';
						for(var i=0;i<arr.length;i++){
							var n = Math.floor(Math.random()*(len+1));
							str+=arr[n];
						}
						var end = file.name.substring(file.name.lastIndexOf('.'));
						return encodeURI(str.substring(0,15)+end);
					}
                }
            }
        }

		  var settings = {
			//uptoken_url: '/course/tutor/qiniu-token',
            domain: 'http://o8pimsyar.bkt.clouddn.com/',
			max_file_size: '100mb',
			uptoken:'abc',
		};
				var id = 'pickfiles'+Math.random();
				defaults.browse_button = id;
				var idContent = 'upContent'+Math.random();
				defaults.contaier = idContent;
				defaults.drop_element = idContent;
				defaults.progressId = "showper"+Math.random();
				defaults.selfCallBack=fn;
			settings = $.extend(settings,defaults,options);
			var html = options['html']||'上传';
			var display = options['display']||'block';
			style="width:300px;height:100px;background:#abcdef;display:"+display;
            var upload = '<a class="btn btn-default btn-lg " id='+id+' href="#" style="color:#000;width:100%;display:block;height:100%;"><i class="glyphicon glyphicon-plus"></i><sapn>'+html+'<span></a><div id='+defaults.progressId+'></div><div id='+idContent+' style='+style+'></div>'
            this.append(upload);    
            var uploader = Qiniu.uploader(settings);
        }

		$.fn.extend({
            upLoad: upLoad
        });
 })(jQuery);
/** 
* 
*  Base64 encode / decode 
* 
*  @author haitao.tu 
*  @date   2010-04-26 
*  @email  tuhaitao@foxmail.com 
* 
*/  
   

function base64encode(str){

var out,i,len,base64EncodeChars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var c1,c2,c3;
len=str.length;
i=0;
out='';
while(i<len){ c1=str.charCodeAt(i++)&0xff; if(i==len){ out+=base64EncodeChars.charAt(c1>>2);
out+=base64EncodeChars.charAt((c1&0x3)<<4); out+='=='; break; } c2=str.charCodeAt(i++); if(i==len){ out+=base64EncodeChars.charAt(c1>>2);
out+=base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));
out+=base64EncodeChars.charAt((c2&0xF)<<2); out+='='; break; } c3=str.charCodeAt(i++); out+=base64EncodeChars.charAt(c1>>2);
out+=base64EncodeChars.charAt(((c1&0x3)<<4)|((c2&0xF0)>>4));
out+=base64EncodeChars.charAt(((c2&0xF)<<2)|((c3&0xC0)>>6));
out+=base64EncodeChars.charAt(c3&0x3F);
}

return out;
}
    //引入Plupload 、qiniu.js后
    // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
    // uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
    /*上传图片的骑牛和upload的插件*/
!function(e,t){"use strict";function n(e,t){for(var n,i=[],r=0;r<e.length;++r){if(n=s[e[r]]||o(e[r]),!n)throw"module definition dependecy not found: "+e[r];i.push(n)}t.apply(null,i)}function i(e,i,r){if("string"!=typeof e)throw"invalid module definition, module id must be defined and be a string";if(i===t)throw"invalid module definition, dependencies must be specified";if(r===t)throw"invalid module definition, definition function must be specified";n(i,function(){s[e]=r.apply(null,arguments)})}function r(e){return!!s[e]}function o(t){for(var n=e,i=t.split(/[.\/]/),r=0;r<i.length;++r){if(!n[i[r]])return;n=n[i[r]]}return n}function a(n){for(var i=0;i<n.length;i++){for(var r=e,o=n[i],a=o.split(/[.\/]/),u=0;u<a.length-1;++u)r[a[u]]===t&&(r[a[u]]={}),r=r[a[u]];r[a[a.length-1]]=s[o]}}var s={},u="moxie/core/utils/Basic",c="moxie/core/utils/Env",l="moxie/core/I18n",d="moxie/core/utils/Mime",h="moxie/core/utils/Dom",f="moxie/core/Exceptions",p="moxie/core/EventTarget",m="moxie/runtime/Runtime",g="moxie/runtime/RuntimeClient",v="moxie/file/FileInput",w="moxie/core/utils/Encode",y="moxie/file/Blob",E="moxie/file/File",_="moxie/file/FileDrop",b="moxie/file/FileReader",x="moxie/core/utils/Url",R="moxie/runtime/RuntimeTarget",A="moxie/file/FileReaderSync",I="moxie/xhr/FormData",T="moxie/xhr/XMLHttpRequest",S="moxie/runtime/Transporter",O="moxie/image/Image",D="moxie/runtime/html5/Runtime",N="moxie/core/utils/Events",L="moxie/runtime/html5/file/FileInput",C="moxie/runtime/html5/file/Blob",M="moxie/runtime/html5/file/FileDrop",F="moxie/runtime/html5/file/FileReader",P="moxie/runtime/html5/xhr/XMLHttpRequest",H="moxie/runtime/html5/utils/BinaryReader",B="moxie/runtime/html5/image/JPEGHeaders",k="moxie/runtime/html5/image/ExifParser",U="moxie/runtime/html5/image/JPEG",G="moxie/runtime/html5/image/PNG",z="moxie/runtime/html5/image/ImageInfo",q="moxie/runtime/html5/image/MegaPixel",j="moxie/runtime/html5/image/Image",X="moxie/runtime/flash/Runtime",V="moxie/runtime/flash/file/FileInput",W="moxie/runtime/flash/file/Blob",Y="moxie/runtime/flash/file/FileReader",$="moxie/runtime/flash/file/FileReaderSync",J="moxie/runtime/flash/xhr/XMLHttpRequest",Z="moxie/runtime/flash/runtime/Transporter",K="moxie/runtime/flash/image/Image",Q="moxie/runtime/silverlight/Runtime",ee="moxie/runtime/silverlight/file/FileInput",te="moxie/runtime/silverlight/file/Blob",ne="moxie/runtime/silverlight/file/FileDrop",ie="moxie/runtime/silverlight/file/FileReader",re="moxie/runtime/silverlight/file/FileReaderSync",oe="moxie/runtime/silverlight/xhr/XMLHttpRequest",ae="moxie/runtime/silverlight/runtime/Transporter",se="moxie/runtime/silverlight/image/Image",ue="moxie/runtime/html4/Runtime",ce="moxie/runtime/html4/file/FileInput",le="moxie/runtime/html4/file/FileReader",de="moxie/runtime/html4/xhr/XMLHttpRequest",he="moxie/runtime/html4/image/Image";i(u,[],function(){var e=function(e){var t;return e===t?"undefined":null===e?"null":e.nodeType?"node":{}.toString.call(e).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()},t=function(i){var r;return n(arguments,function(o,s){s>0&&n(o,function(n,o){n!==r&&(e(i[o])===e(n)&&~a(e(n),["array","object"])?t(i[o],n):i[o]=n)})}),i},n=function(t,n){var i,r,o,a;if(t)if("number"===e(t.length)){for(o=0,i=t.length;i>o;o++)if(n(t[o],o)===!1)return}else if("object"===e(t))for(r in t)if(t.hasOwnProperty(r)&&n(t[r],r)===!1)return},i=function(t){var n;if(!t||"object"!==e(t))return!0;for(n in t)return!1;return!0},r=function(t,n){function i(r){"function"===e(t[r])&&t[r](function(e){++r<o&&!e?i(r):n(e)})}var r=0,o=t.length;"function"!==e(n)&&(n=function(){}),t&&t.length||n(),i(r)},o=function(e,t){var i=0,r=e.length,o=new Array(r);n(e,function(e,n){e(function(e){if(e)return t(e);var a=[].slice.call(arguments);a.shift(),o[n]=a,i++,i===r&&(o.unshift(null),t.apply(this,o))})})},a=function(e,t){if(t){if(Array.prototype.indexOf)return Array.prototype.indexOf.call(t,e);for(var n=0,i=t.length;i>n;n++)if(t[n]===e)return n}return-1},s=function(t,n){var i=[];"array"!==e(t)&&(t=[t]),"array"!==e(n)&&(n=[n]);for(var r in t)-1===a(t[r],n)&&i.push(t[r]);return i.length?i:!1},u=function(e,t){var i=[];return n(e,function(e){-1!==a(e,t)&&i.push(e)}),i.length?i:null},c=function(e){var t,n=[];for(t=0;t<e.length;t++)n[t]=e[t];return n},l=function(){var e=0;return function(t){var n=(new Date).getTime().toString(32),i;for(i=0;5>i;i++)n+=Math.floor(65535*Math.random()).toString(32);return(t||"o_")+n+(e++).toString(32)}}(),d=function(e){return e?String.prototype.trim?String.prototype.trim.call(e):e.toString().replace(/^\s*/,"").replace(/\s*$/,""):e},h=function(e){if("string"!=typeof e)return e;var t={t:1099511627776,g:1073741824,m:1048576,k:1024},n;return e=/^([0-9\.]+)([tmgk]?)$/.exec(e.toLowerCase().replace(/[^0-9\.tmkg]/g,"")),n=e[2],e=+e[1],t.hasOwnProperty(n)&&(e*=t[n]),Math.floor(e)},f=function(t){var n=[].slice.call(arguments,1);return t.replace(/%[a-z]/g,function(){var t=n.shift();return"undefined"!==e(t)?t:""})};return{guid:l,typeOf:e,extend:t,each:n,isEmptyObj:i,inSeries:r,inParallel:o,inArray:a,arrayDiff:s,arrayIntersect:u,toArray:c,trim:d,sprintf:f,parseSizeStr:h}}),i(c,[u],function(e){function t(e,t,n){var i=0,r=0,o=0,a={dev:-6,alpha:-5,a:-5,beta:-4,b:-4,RC:-3,rc:-3,"#":-2,p:1,pl:1},s=function(e){return e=(""+e).replace(/[_\-+]/g,"."),e=e.replace(/([^.\d]+)/g,".$1.").replace(/\.{2,}/g,"."),e.length?e.split("."):[-8]},u=function(e){return e?isNaN(e)?a[e]||-7:parseInt(e,10):0};for(e=s(e),t=s(t),r=Math.max(e.length,t.length),i=0;r>i;i++)if(e[i]!=t[i]){if(e[i]=u(e[i]),t[i]=u(t[i]),e[i]<t[i]){o=-1;break}if(e[i]>t[i]){o=1;break}}if(!n)return o;switch(n){case">":case"gt":return o>0;case">=":case"ge":return o>=0;case"<=":case"le":return 0>=o;case"==":case"=":case"eq":return 0===o;case"<>":case"!=":case"ne":return 0!==o;case"":case"<":case"lt":return 0>o;default:return null}}var n=function(e){var t="",n="?",i="function",r="undefined",o="object",a="major",s="model",u="name",c="type",l="vendor",d="version",h="architecture",f="console",p="mobile",m="tablet",g={has:function(e,t){return-1!==t.toLowerCase().indexOf(e.toLowerCase())},lowerize:function(e){return e.toLowerCase()}},v={rgx:function(){for(var t,n=0,a,s,u,c,l,d,h=arguments;n<h.length;n+=2){var f=h[n],p=h[n+1];if(typeof t===r){t={};for(u in p)c=p[u],typeof c===o?t[c[0]]=e:t[c]=e}for(a=s=0;a<f.length;a++)if(l=f[a].exec(this.getUA())){for(u=0;u<p.length;u++)d=l[++s],c=p[u],typeof c===o&&c.length>0?2==c.length?typeof c[1]==i?t[c[0]]=c[1].call(this,d):t[c[0]]=c[1]:3==c.length?typeof c[1]!==i||c[1].exec&&c[1].test?t[c[0]]=d?d.replace(c[1],c[2]):e:t[c[0]]=d?c[1].call(this,d,c[2]):e:4==c.length&&(t[c[0]]=d?c[3].call(this,d.replace(c[1],c[2])):e):t[c]=d?d:e;break}if(l)break}return t},str:function(t,i){for(var r in i)if(typeof i[r]===o&&i[r].length>0){for(var a=0;a<i[r].length;a++)if(g.has(i[r][a],t))return r===n?e:r}else if(g.has(i[r],t))return r===n?e:r;return t}},w={browser:{oldsafari:{major:{1:["/8","/1","/3"],2:"/4","?":"/"},version:{"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}}},device:{sprint:{model:{"Evo Shift 4G":"7373KT"},vendor:{HTC:"APA",Sprint:"Sprint"}}},os:{windows:{version:{ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2000:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",RT:"ARM"}}}},y={browser:[[/(opera\smini)\/([\w\.-]+)/i,/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,/(opera).+version\/([\w\.]+)/i,/(opera)[\/\s]+([\w\.]+)/i],[u,d],[/\s(opr)\/([\w\.]+)/i],[[u,"Opera"],d],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,/(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,/(?:ms|\()(ie)\s([\w\.]+)/i,/(rekonq)\/([\w\.]+)*/i,/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi)\/([\w\.-]+)/i],[u,d],[/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],[[u,"IE"],d],[/(edge)\/((\d+)?[\w\.]+)/i],[u,d],[/(yabrowser)\/([\w\.]+)/i],[[u,"Yandex"],d],[/(comodo_dragon)\/([\w\.]+)/i],[[u,/_/g," "],d],[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,/(uc\s?browser|qqbrowser)[\/\s]?([\w\.]+)/i],[u,d],[/(dolfin)\/([\w\.]+)/i],[[u,"Dolphin"],d],[/((?:android.+)crmo|crios)\/([\w\.]+)/i],[[u,"Chrome"],d],[/XiaoMi\/MiuiBrowser\/([\w\.]+)/i],[d,[u,"MIUI Browser"]],[/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i],[d,[u,"Android Browser"]],[/FBAV\/([\w\.]+);/i],[d,[u,"Facebook"]],[/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],[d,[u,"Mobile Safari"]],[/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],[d,u],[/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[u,[d,v.str,w.browser.oldsafari.version]],[/(konqueror)\/([\w\.]+)/i,/(webkit|khtml)\/([\w\.]+)/i],[u,d],[/(navigator|netscape)\/([\w\.-]+)/i],[[u,"Netscape"],d],[/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,/(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf)[\/\s]?([\w\.]+)/i,/(links)\s\(([\w\.]+)/i,/(gobrowser)\/?([\w\.]+)*/i,/(ice\s?browser)\/v?([\w\._]+)/i,/(mosaic)[\/\s]([\w\.]+)/i],[u,d]],engine:[[/windows.+\sedge\/([\w\.]+)/i],[d,[u,"EdgeHTML"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,/(icab)[\/\s]([23]\.[\d\.]+)/i],[u,d],[/rv\:([\w\.]+).*(gecko)/i],[d,u]],os:[[/microsoft\s(windows)\s(vista|xp)/i],[u,d],[/(windows)\snt\s6\.2;\s(arm)/i,/(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],[u,[d,v.str,w.os.windows.version]],[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],[[u,"Windows"],[d,v.str,w.os.windows.version]],[/\((bb)(10);/i],[[u,"BlackBerry"],d],[/(blackberry)\w*\/?([\w\.]+)*/i,/(tizen)[\/\s]([\w\.]+)/i,/(android|webos|palm\os|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,/linux;.+(sailfish);/i],[u,d],[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],[[u,"Symbian"],d],[/\((series40);/i],[u],[/mozilla.+\(mobile;.+gecko.+firefox/i],[[u,"Firefox OS"],d],[/(nintendo|playstation)\s([wids3portablevu]+)/i,/(mint)[\/\s\(]?(\w+)*/i,/(mageia|vectorlinux)[;\s]/i,/(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i,/(hurd|linux)\s?([\w\.]+)*/i,/(gnu)\s?([\w\.]+)*/i],[u,d],[/(cros)\s[\w]+\s([\w\.]+\w)/i],[[u,"Chromium OS"],d],[/(sunos)\s?([\w\.]+\d)*/i],[[u,"Solaris"],d],[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],[u,d],[/(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i],[[u,"iOS"],[d,/_/g,"."]],[/(mac\sos\sx)\s?([\w\s\.]+\w)*/i,/(macintosh|mac(?=_powerpc)\s)/i],[[u,"Mac OS"],[d,/_/g,"."]],[/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,/(haiku)\s(\w+)/i,/(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,/(unix)\s?([\w\.]+)*/i],[u,d]]},E=function(e){var n=e||(window&&window.navigator&&window.navigator.userAgent?window.navigator.userAgent:t);this.getBrowser=function(){return v.rgx.apply(this,y.browser)},this.getEngine=function(){return v.rgx.apply(this,y.engine)},this.getOS=function(){return v.rgx.apply(this,y.os)},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS()}},this.getUA=function(){return n},this.setUA=function(e){return n=e,this},this.setUA(n)};return E}(),i=function(){var t={define_property:function(){return!1}(),create_canvas:function(){var e=document.createElement("canvas");return!(!e.getContext||!e.getContext("2d"))}(),return_response_type:function(t){try{if(-1!==e.inArray(t,["","text","document"]))return!0;if(window.XMLHttpRequest){var n=new XMLHttpRequest;if(n.open("get","/"),"responseType"in n)return n.responseType=t,n.responseType===t}}catch(i){}return!1},use_data_uri:function(){var e=new Image;return e.onload=function(){t.use_data_uri=1===e.width&&1===e.height},setTimeout(function(){e.src="data:image/gif;base64,R0lGODlhAQABAIAAAP8AAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="},1),!1}(),use_data_uri_over32kb:function(){return t.use_data_uri&&("IE"!==o.browser||o.version>=9)},use_data_uri_of:function(e){return t.use_data_uri&&33e3>e||t.use_data_uri_over32kb()},use_fileinput:function(){if(navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/))return!1;var e=document.createElement("input");return e.setAttribute("type","file"),!e.disabled}};return function(n){var i=[].slice.call(arguments);return i.shift(),"function"===e.typeOf(t[n])?t[n].apply(this,i):!!t[n]}}(),r=(new n).getResult(),o={can:i,uaParser:n,browser:r.browser.name,version:r.browser.version,os:r.os.name,osVersion:r.os.version,verComp:t,swf_url:"../flash/Moxie.swf",xap_url:"../silverlight/Moxie.xap",global_event_dispatcher:"moxie.core.EventTarget.instance.dispatchEvent"};return o.OS=o.os,o}),i(l,[u],function(e){var t={};return{addI18n:function(n){return e.extend(t,n)},translate:function(e){return t[e]||e},_:function(e){return this.translate(e)},sprintf:function(t){var n=[].slice.call(arguments,1);return t.replace(/%[a-z]/g,function(){var t=n.shift();return"undefined"!==e.typeOf(t)?t:""})}}}),i(d,[u,l],function(e,t){var n="application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx,application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx,application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx,application/vnd.openxmlformats-officedocument.presentationml.template,potx,application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx,application/x-javascript,js,application/json,json,audio/mpeg,mp3 mpga mpega mp2,audio/x-wav,wav,audio/x-m4a,m4a,audio/ogg,oga ogg,audio/aiff,aiff aif,audio/flac,flac,audio/aac,aac,audio/ac3,ac3,audio/x-ms-wma,wma,image/bmp,bmp,image/gif,gif,image/jpeg,jpg jpeg jpe,image/photoshop,psd,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/plain,asc txt text diff log,text/html,htm html xhtml,text/css,css,text/csv,csv,text/rtf,rtf,video/mpeg,mpeg mpg mpe m2v,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/x-ms-wmv,wmv,video/avi,avi,video/webm,webm,video/3gpp,3gpp 3gp,video/3gpp2,3g2,video/vnd.rn-realvideo,rv,video/ogg,ogv,video/x-matroska,mkv,application/vnd.oasis.opendocument.formula-template,otf,application/octet-stream,exe",i={mimes:{},extensions:{},addMimeType:function(e){var t=e.split(/,/),n,i,r;for(n=0;n<t.length;n+=2){for(r=t[n+1].split(/ /),i=0;i<r.length;i++)this.mimes[r[i]]=t[n];this.extensions[t[n]]=r}},extList2mimes:function(t,n){var i=this,r,o,a,s,u=[];for(o=0;o<t.length;o++)for(r=t[o].extensions.split(/\s*,\s*/),a=0;a<r.length;a++){if("*"===r[a])return[];if(s=i.mimes[r[a]],s&&-1===e.inArray(s,u)&&u.push(s),n&&/^\w+$/.test(r[a]))u.push("."+r[a]);else if(!s)return[]}return u},mimes2exts:function(t){var n=this,i=[];return e.each(t,function(t){if("*"===t)return i=[],!1;var r=t.match(/^(\w+)\/(\*|\w+)$/);r&&("*"===r[2]?e.each(n.extensions,function(e,t){new RegExp("^"+r[1]+"/").test(t)&&[].push.apply(i,n.extensions[t])}):n.extensions[t]&&[].push.apply(i,n.extensions[t]))}),i},mimes2extList:function(n){var i=[],r=[];return"string"===e.typeOf(n)&&(n=e.trim(n).split(/\s*,\s*/)),r=this.mimes2exts(n),i.push({title:t.translate("Files"),extensions:r.length?r.join(","):"*"}),i.mimes=n,i},getFileExtension:function(e){var t=e&&e.match(/\.([^.]+)$/);return t?t[1].toLowerCase():""},getFileMime:function(e){return this.mimes[this.getFileExtension(e)]||""}};return i.addMimeType(n),i}),i(h,[c],function(e){var t=function(e){return"string"!=typeof e?e:document.getElementById(e)},n=function(e,t){if(!e.className)return!1;var n=new RegExp("(^|\\s+)"+t+"(\\s+|$)");return n.test(e.className)},i=function(e,t){n(e,t)||(e.className=e.className?e.className.replace(/\s+$/,"")+" "+t:t)},r=function(e,t){if(e.className){var n=new RegExp("(^|\\s+)"+t+"(\\s+|$)");e.className=e.className.replace(n,function(e,t,n){return" "===t&&" "===n?" ":""})}},o=function(e,t){return e.currentStyle?e.currentStyle[t]:window.getComputedStyle?window.getComputedStyle(e,null)[t]:void 0},a=function(t,n){function i(e){var t,n,i=0,r=0;return e&&(n=e.getBoundingClientRect(),t="CSS1Compat"===s.compatMode?s.documentElement:s.body,i=n.left+t.scrollLeft,r=n.top+t.scrollTop),{x:i,y:r}}var r=0,o=0,a,s=document,u,c;if(t=t,n=n||s.body,t&&t.getBoundingClientRect&&"IE"===e.browser&&(!s.documentMode||s.documentMode<8))return u=i(t),c=i(n),{x:u.x-c.x,y:u.y-c.y};for(a=t;a&&a!=n&&a.nodeType;)r+=a.offsetLeft||0,o+=a.offsetTop||0,a=a.offsetParent;for(a=t.parentNode;a&&a!=n&&a.nodeType;)r-=a.scrollLeft||0,o-=a.scrollTop||0,a=a.parentNode;return{x:r,y:o}},s=function(e){return{w:e.offsetWidth||e.clientWidth,h:e.offsetHeight||e.clientHeight}};return{get:t,hasClass:n,addClass:i,removeClass:r,getStyle:o,getPos:a,getSize:s}}),i(f,[u],function(e){function t(e,t){var n;for(n in e)if(e[n]===t)return n;return null}return{RuntimeError:function(){function n(e){this.code=e,this.name=t(i,e),this.message=this.name+": RuntimeError "+this.code}var i={NOT_INIT_ERR:1,NOT_SUPPORTED_ERR:9,JS_ERR:4};return e.extend(n,i),n.prototype=Error.prototype,n}(),OperationNotAllowedException:function(){function t(e){this.code=e,this.name="OperationNotAllowedException"}return e.extend(t,{NOT_ALLOWED_ERR:1}),t.prototype=Error.prototype,t}(),ImageError:function(){function n(e){this.code=e,this.name=t(i,e),this.message=this.name+": ImageError "+this.code}var i={WRONG_FORMAT:1,MAX_RESOLUTION_ERR:2,INVALID_META_ERR:3};return e.extend(n,i),n.prototype=Error.prototype,n}(),FileException:function(){function n(e){this.code=e,this.name=t(i,e),this.message=this.name+": FileException "+this.code}var i={NOT_FOUND_ERR:1,SECURITY_ERR:2,ABORT_ERR:3,NOT_READABLE_ERR:4,ENCODING_ERR:5,NO_MODIFICATION_ALLOWED_ERR:6,INVALID_STATE_ERR:7,SYNTAX_ERR:8};return e.extend(n,i),n.prototype=Error.prototype,n}(),DOMException:function(){function n(e){this.code=e,this.name=t(i,e),this.message=this.name+": DOMException "+this.code}var i={INDEX_SIZE_ERR:1,DOMSTRING_SIZE_ERR:2,HIERARCHY_REQUEST_ERR:3,WRONG_DOCUMENT_ERR:4,INVALID_CHARACTER_ERR:5,NO_DATA_ALLOWED_ERR:6,NO_MODIFICATION_ALLOWED_ERR:7,NOT_FOUND_ERR:8,NOT_SUPPORTED_ERR:9,INUSE_ATTRIBUTE_ERR:10,INVALID_STATE_ERR:11,SYNTAX_ERR:12,INVALID_MODIFICATION_ERR:13,NAMESPACE_ERR:14,INVALID_ACCESS_ERR:15,VALIDATION_ERR:16,TYPE_MISMATCH_ERR:17,SECURITY_ERR:18,NETWORK_ERR:19,ABORT_ERR:20,URL_MISMATCH_ERR:21,QUOTA_EXCEEDED_ERR:22,TIMEOUT_ERR:23,INVALID_NODE_TYPE_ERR:24,DATA_CLONE_ERR:25};return e.extend(n,i),n.prototype=Error.prototype,n}(),EventException:function(){function t(e){this.code=e,this.name="EventException"}return e.extend(t,{UNSPECIFIED_EVENT_TYPE_ERR:0}),t.prototype=Error.prototype,t}()}}),i(p,[c,f,u],function(e,t,n){function i(){var e={};n.extend(this,{uid:null,init:function(){this.uid||(this.uid=n.guid("uid_"))},addEventListener:function(t,i,r,o){var a=this,s;return this.hasOwnProperty("uid")||(this.uid=n.guid("uid_")),t=n.trim(t),/\s/.test(t)?void n.each(t.split(/\s+/),function(e){a.addEventListener(e,i,r,o)}):(t=t.toLowerCase(),r=parseInt(r,10)||0,s=e[this.uid]&&e[this.uid][t]||[],s.push({fn:i,priority:r,scope:o||this}),e[this.uid]||(e[this.uid]={}),void(e[this.uid][t]=s))},hasEventListener:function(t){var n=t?e[this.uid]&&e[this.uid][t]:e[this.uid];return n?n:!1},removeEventListener:function(t,i){t=t.toLowerCase();var r=e[this.uid]&&e[this.uid][t],o;if(r){if(i){for(o=r.length-1;o>=0;o--)if(r[o].fn===i){r.splice(o,1);break}}else r=[];r.length||(delete e[this.uid][t],n.isEmptyObj(e[this.uid])&&delete e[this.uid])}},removeAllEventListeners:function(){e[this.uid]&&delete e[this.uid]},dispatchEvent:function(i){var r,o,a,s,u={},c=!0,l;if("string"!==n.typeOf(i)){if(s=i,"string"!==n.typeOf(s.type))throw new t.EventException(t.EventException.UNSPECIFIED_EVENT_TYPE_ERR);i=s.type,s.total!==l&&s.loaded!==l&&(u.total=s.total,u.loaded=s.loaded),u.async=s.async||!1}if(-1!==i.indexOf("::")?!function(e){r=e[0],i=e[1]}(i.split("::")):r=this.uid,i=i.toLowerCase(),o=e[r]&&e[r][i]){o.sort(function(e,t){return t.priority-e.priority}),a=[].slice.call(arguments),a.shift(),u.type=i,a.unshift(u);var d=[];n.each(o,function(e){a[0].target=e.scope,u.async?d.push(function(t){setTimeout(function(){t(e.fn.apply(e.scope,a)===!1)},1)}):d.push(function(t){t(e.fn.apply(e.scope,a)===!1)})}),d.length&&n.inSeries(d,function(e){c=!e})}return c},bind:function(){this.addEventListener.apply(this,arguments)},unbind:function(){this.removeEventListener.apply(this,arguments)},unbindAll:function(){this.removeAllEventListeners.apply(this,arguments)},trigger:function(){return this.dispatchEvent.apply(this,arguments)},handleEventProps:function(e){var t=this;this.bind(e.join(" "),function(e){var t="on"+e.type.toLowerCase();"function"===n.typeOf(this[t])&&this[t].apply(this,arguments)}),n.each(e,function(e){e="on"+e.toLowerCase(e),"undefined"===n.typeOf(t[e])&&(t[e]=null)})}})}return i.instance=new i,i}),i(m,[c,u,h,p],function(e,t,n,i){function r(e,i,o,s,u){var c=this,l,d=t.guid(i+"_"),h=u||"browser";e=e||{},a[d]=this,o=t.extend({access_binary:!1,access_image_binary:!1,display_media:!1,do_cors:!1,drag_and_drop:!1,filter_by_extension:!0,resize_image:!1,report_upload_progress:!1,return_response_headers:!1,return_response_type:!1,return_status_code:!0,send_custom_headers:!1,select_file:!1,select_folder:!1,select_multiple:!0,send_binary_string:!1,send_browser_cookies:!0,send_multipart:!0,slice_blob:!1,stream_upload:!1,summon_file_dialog:!1,upload_filesize:!0,use_http_method:!0},o),e.preferred_caps&&(h=r.getMode(s,e.preferred_caps,h)),l=function(){var e={};return{exec:function(t,n,i,r){return l[n]&&(e[t]||(e[t]={context:this,instance:new l[n]}),e[t].instance[i])?e[t].instance[i].apply(this,r):void 0},removeInstance:function(t){delete e[t]},removeAllInstances:function(){var n=this;t.each(e,function(e,i){"function"===t.typeOf(e.instance.destroy)&&e.instance.destroy.call(e.context),n.removeInstance(i)})}}}(),t.extend(this,{initialized:!1,uid:d,type:i,mode:r.getMode(s,e.required_caps,h),shimid:d+"_container",clients:0,options:e,can:function(e,n){var i=arguments[2]||o;if("string"===t.typeOf(e)&&"undefined"===t.typeOf(n)&&(e=r.parseCaps(e)),"object"===t.typeOf(e)){for(var a in e)if(!this.can(a,e[a],i))return!1;return!0}return"function"===t.typeOf(i[e])?i[e].call(this,n):n===i[e]},getShimContainer:function(){var e,i=n.get(this.shimid);return i||(e=this.options.container?n.get(this.options.container):document.body,i=document.createElement("div"),i.id=this.shimid,i.className="moxie-shim moxie-shim-"+this.type,t.extend(i.style,{position:"absolute",top:"0px",left:"0px",width:"1px",height:"1px",overflow:"hidden"}),e.appendChild(i),e=null),i},getShim:function(){return l},shimExec:function(e,t){var n=[].slice.call(arguments,2);return c.getShim().exec.call(this,this.uid,e,t,n)},exec:function(e,t){var n=[].slice.call(arguments,2);return c[e]&&c[e][t]?c[e][t].apply(this,n):c.shimExec.apply(this,arguments)},destroy:function(){if(c){var e=n.get(this.shimid);e&&e.parentNode.removeChild(e),l&&l.removeAllInstances(),this.unbindAll(),delete a[this.uid],this.uid=null,d=c=l=e=null}}}),this.mode&&e.required_caps&&!this.can(e.required_caps)&&(this.mode=!1)}var o={},a={};return r.order="html5,flash,silverlight,html4",r.getRuntime=function(e){return a[e]?a[e]:!1},r.addConstructor=function(e,t){t.prototype=i.instance,o[e]=t},r.getConstructor=function(e){return o[e]||null},r.getInfo=function(e){var t=r.getRuntime(e);return t?{uid:t.uid,type:t.type,mode:t.mode,can:function(){return t.can.apply(t,arguments)}}:null},r.parseCaps=function(e){var n={};return"string"!==t.typeOf(e)?e||{}:(t.each(e.split(","),function(e){n[e]=!0}),n)},r.can=function(e,t){var n,i=r.getConstructor(e),o;return i?(n=new i({required_caps:t}),o=n.mode,n.destroy(),!!o):!1},r.thatCan=function(e,t){var n=(t||r.order).split(/\s*,\s*/);for(var i in n)if(r.can(n[i],e))return n[i];return null},r.getMode=function(e,n,i){var r=null;if("undefined"===t.typeOf(i)&&(i="browser"),n&&!t.isEmptyObj(e)){if(t.each(n,function(n,i){if(e.hasOwnProperty(i)){var o=e[i](n);if("string"==typeof o&&(o=[o]),r){if(!(r=t.arrayIntersect(r,o)))return r=!1}else r=o}}),r)return-1!==t.inArray(i,r)?i:r[0];if(r===!1)return!1}return i},r.capTrue=function(){return!0},r.capFalse=function(){return!1},r.capTest=function(e){return function(){return!!e}},r}),i(g,[c,f,u,m],function(e,t,n,i){return function r(){var e;n.extend(this,{connectRuntime:function(r){function o(n){var s,u;return n.length?(s=n.shift().toLowerCase(),(u=i.getConstructor(s))?(e=new u(r),e.bind("Init",function(){e.initialized=!0,setTimeout(function(){e.clients++,a.trigger("RuntimeInit",e)},1)}),e.bind("Error",function(){e.destroy(),o(n)}),e.mode?void e.init():void e.trigger("Error")):void o(n)):(a.trigger("RuntimeError",new t.RuntimeError(t.RuntimeError.NOT_INIT_ERR)),void(e=null))}var a=this,s;if("string"===n.typeOf(r)?s=r:"string"===n.typeOf(r.ruid)&&(s=r.ruid),s){if(e=i.getRuntime(s))return e.clients++,e;throw new t.RuntimeError(t.RuntimeError.NOT_INIT_ERR)}o((r.runtime_order||i.order).split(/\s*,\s*/))},disconnectRuntime:function(){e&&--e.clients<=0&&e.destroy(),e=null},getRuntime:function(){return e&&e.uid?e:e=null},exec:function(){return e?e.exec.apply(this,arguments):null}})}}),i(v,[u,c,d,h,f,p,l,m,g],function(e,t,n,i,r,o,a,s,u){function c(t){var o=this,c,d,h;if(-1!==e.inArray(e.typeOf(t),["string","node"])&&(t={browse_button:t}),d=i.get(t.browse_button),!d)throw new r.DOMException(r.DOMException.NOT_FOUND_ERR);h={accept:[{title:a.translate("All Files"),extensions:"*"}],name:"file",multiple:!1,required_caps:!1,container:d.parentNode||document.body},t=e.extend({},h,t),"string"==typeof t.required_caps&&(t.required_caps=s.parseCaps(t.required_caps)),"string"==typeof t.accept&&(t.accept=n.mimes2extList(t.accept)),c=i.get(t.container),c||(c=document.body),"static"===i.getStyle(c,"position")&&(c.style.position="relative"),c=d=null,u.call(o),e.extend(o,{uid:e.guid("uid_"),ruid:null,shimid:null,files:null,init:function(){o.bind("RuntimeInit",function(n,r){o.ruid=r.uid,o.shimid=r.shimid,o.bind("Ready",function(){o.trigger("Refresh")},999),o.bind("Refresh",function(){var n,o,a,s;a=i.get(t.browse_button),s=i.get(r.shimid),a&&(n=i.getPos(a,i.get(t.container)),o=i.getSize(a),s&&e.extend(s.style,{top:n.y+"px",left:n.x+"px",width:o.w+"px",height:o.h+"px"})),s=a=null}),r.exec.call(o,"FileInput","init",t)}),o.connectRuntime(e.extend({},t,{required_caps:{select_file:!0}}))},disable:function(t){var n=this.getRuntime();n&&n.exec.call(this,"FileInput","disable","undefined"===e.typeOf(t)?!0:t)},refresh:function(){o.trigger("Refresh")},destroy:function(){var t=this.getRuntime();t&&(t.exec.call(this,"FileInput","destroy"),this.disconnectRuntime()),"array"===e.typeOf(this.files)&&e.each(this.files,function(e){e.destroy()}),this.files=null,this.unbindAll()}}),this.handleEventProps(l)}var l=["ready","change","cancel","mouseenter","mouseleave","mousedown","mouseup"];return c.prototype=o.instance,c}),i(w,[],function(){var e=function(e){return unescape(encodeURIComponent(e))},t=function(e){return decodeURIComponent(escape(e))},n=function(e,n){if("function"==typeof window.atob)return n?t(window.atob(e)):window.atob(e);var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",r,o,a,s,u,c,l,d,h=0,f=0,p="",m=[];if(!e)return e;e+="";do s=i.indexOf(e.charAt(h++)),u=i.indexOf(e.charAt(h++)),c=i.indexOf(e.charAt(h++)),l=i.indexOf(e.charAt(h++)),d=s<<18|u<<12|c<<6|l,r=d>>16&255,o=d>>8&255,a=255&d,64==c?m[f++]=String.fromCharCode(r):64==l?m[f++]=String.fromCharCode(r,o):m[f++]=String.fromCharCode(r,o,a);while(h<e.length);return p=m.join(""),n?t(p):p},i=function(t,n){if(n&&(t=e(t)),"function"==typeof window.btoa)return window.btoa(t);var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",r,o,a,s,u,c,l,d,h=0,f=0,p="",m=[];if(!t)return t;do r=t.charCodeAt(h++),o=t.charCodeAt(h++),a=t.charCodeAt(h++),d=r<<16|o<<8|a,s=d>>18&63,u=d>>12&63,c=d>>6&63,l=63&d,m[f++]=i.charAt(s)+i.charAt(u)+i.charAt(c)+i.charAt(l);while(h<t.length);p=m.join("");var g=t.length%3;return(g?p.slice(0,g-3):p)+"===".slice(g||3)};return{utf8_encode:e,utf8_decode:t,atob:n,btoa:i}}),i(y,[u,w,g],function(e,t,n){function i(o,a){function s(t,n,o){var a,s=r[this.uid];return"string"===e.typeOf(s)&&s.length?(a=new i(null,{type:o,size:n-t}),a.detach(s.substr(t,a.size)),a):null}n.call(this),o&&this.connectRuntime(o),a?"string"===e.typeOf(a)&&(a={data:a}):a={},e.extend(this,{uid:a.uid||e.guid("uid_"),ruid:o,size:a.size||0,type:a.type||"",slice:function(e,t,n){return this.isDetached()?s.apply(this,arguments):this.getRuntime().exec.call(this,"Blob","slice",this.getSource(),e,t,n)},getSource:function(){return r[this.uid]?r[this.uid]:null},detach:function(e){if(this.ruid&&(this.getRuntime().exec.call(this,"Blob","destroy"),this.disconnectRuntime(),this.ruid=null),e=e||"","data:"==e.substr(0,5)){var n=e.indexOf(";base64,");this.type=e.substring(5,n),e=t.atob(e.substring(n+8))}this.size=e.length,r[this.uid]=e},isDetached:function(){return!this.ruid&&"string"===e.typeOf(r[this.uid])},destroy:function(){this.detach(),delete r[this.uid]}}),a.data?this.detach(a.data):r[this.uid]=a}var r={};return i}),i(E,[u,d,y],function(e,t,n){function i(i,r){r||(r={}),n.apply(this,arguments),this.type||(this.type=t.getFileMime(r.name));var o;if(r.name)o=r.name.replace(/\\/g,"/"),o=o.substr(o.lastIndexOf("/")+1);else if(this.type){var a=this.type.split("/")[0];o=e.guid((""!==a?a:"file")+"_"),t.extensions[this.type]&&(o+="."+t.extensions[this.type][0])}e.extend(this,{name:o||e.guid("file_"),relativePath:"",lastModifiedDate:r.lastModifiedDate||(new Date).toLocaleString()})}return i.prototype=n.prototype,i}),i(_,[l,h,f,u,c,E,g,p,d],function(e,t,n,i,r,o,a,s,u){function c(n){var r=this,o;"string"==typeof n&&(n={drop_zone:n}),o={accept:[{title:e.translate("All Files"),extensions:"*"}],required_caps:{drag_and_drop:!0}},n="object"==typeof n?i.extend({},o,n):o,n.container=t.get(n.drop_zone)||document.body,"static"===t.getStyle(n.container,"position")&&(n.container.style.position="relative"),"string"==typeof n.accept&&(n.accept=u.mimes2extList(n.accept)),a.call(r),i.extend(r,{uid:i.guid("uid_"),ruid:null,files:null,init:function(){r.bind("RuntimeInit",function(e,t){r.ruid=t.uid,t.exec.call(r,"FileDrop","init",n),r.dispatchEvent("ready")}),r.connectRuntime(n)},destroy:function(){var e=this.getRuntime();e&&(e.exec.call(this,"FileDrop","destroy"),this.disconnectRuntime()),this.files=null,this.unbindAll()}}),this.handleEventProps(l)}var l=["ready","dragenter","dragleave","drop","error"];return c.prototype=s.instance,c}),i(b,[u,w,f,p,y,g],function(e,t,n,i,r,o){function a(){function i(e,i){var o=this;if(this.trigger("loadstart"),this.readyState===a.LOADING)return this.trigger("error",new n.DOMException(n.DOMException.INVALID_STATE_ERR)),void this.trigger("loadend");if(!(i instanceof r))return this.trigger("error",new n.DOMException(n.DOMException.NOT_FOUND_ERR)),void this.trigger("loadend");if(this.result=null,this.readyState=a.LOADING,i.isDetached()){var s=i.getSource();switch(e){case"readAsText":case"readAsBinaryString":this.result=s;break;case"readAsDataURL":this.result="data:"+i.type+";base64,"+t.btoa(s)}this.readyState=a.DONE,this.trigger("load"),this.trigger("loadend")}else this.connectRuntime(i.ruid),this.exec("FileReader","read",e,i)}o.call(this),e.extend(this,{uid:e.guid("uid_"),readyState:a.EMPTY,result:null,error:null,readAsBinaryString:function(e){i.call(this,"readAsBinaryString",e)},readAsDataURL:function(e){i.call(this,"readAsDataURL",e)},readAsText:function(e){i.call(this,"readAsText",e);
},abort:function(){this.result=null,-1===e.inArray(this.readyState,[a.EMPTY,a.DONE])&&(this.readyState===a.LOADING&&(this.readyState=a.DONE),this.exec("FileReader","abort"),this.trigger("abort"),this.trigger("loadend"))},destroy:function(){this.abort(),this.exec("FileReader","destroy"),this.disconnectRuntime(),this.unbindAll()}}),this.handleEventProps(s),this.bind("Error",function(e,t){this.readyState=a.DONE,this.error=t},999),this.bind("Load",function(e){this.readyState=a.DONE},999)}var s=["loadstart","progress","load","abort","error","loadend"];return a.EMPTY=0,a.LOADING=1,a.DONE=2,a.prototype=i.instance,a}),i(x,[],function(){var e=function(t,n){for(var i=["source","scheme","authority","userInfo","user","pass","host","port","relative","path","directory","file","query","fragment"],r=i.length,o={http:80,https:443},a={},s=/^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)/,u=s.exec(t||"");r--;)u[r]&&(a[i[r]]=u[r]);if(!a.scheme){n&&"string"!=typeof n||(n=e(n||document.location.href)),a.scheme=n.scheme,a.host=n.host,a.port=n.port;var c="";/^[^\/]/.test(a.path)&&(c=n.path,c=/\/[^\/]*\.[^\/]*$/.test(c)?c.replace(/\/[^\/]+$/,"/"):c.replace(/\/?$/,"/")),a.path=c+(a.path||"")}return a.port||(a.port=o[a.scheme]||80),a.port=parseInt(a.port,10),a.path||(a.path="/"),delete a.source,a},t=function(t){var n={http:80,https:443},i="object"==typeof t?t:e(t);return i.scheme+"://"+i.host+(i.port!==n[i.scheme]?":"+i.port:"")+i.path+(i.query?i.query:"")},n=function(t){function n(e){return[e.scheme,e.host,e.port].join("/")}return"string"==typeof t&&(t=e(t)),n(e())===n(t)};return{parseUrl:e,resolveUrl:t,hasSameOrigin:n}}),i(R,[u,g,p],function(e,t,n){function i(){this.uid=e.guid("uid_"),t.call(this),this.destroy=function(){this.disconnectRuntime(),this.unbindAll()}}return i.prototype=n.instance,i}),i(A,[u,g,w],function(e,t,n){return function(){function i(e,t){if(!t.isDetached()){var i=this.connectRuntime(t.ruid).exec.call(this,"FileReaderSync","read",e,t);return this.disconnectRuntime(),i}var r=t.getSource();switch(e){case"readAsBinaryString":return r;case"readAsDataURL":return"data:"+t.type+";base64,"+n.btoa(r);case"readAsText":for(var o="",a=0,s=r.length;s>a;a++)o+=String.fromCharCode(r[a]);return o}}t.call(this),e.extend(this,{uid:e.guid("uid_"),readAsBinaryString:function(e){return i.call(this,"readAsBinaryString",e)},readAsDataURL:function(e){return i.call(this,"readAsDataURL",e)},readAsText:function(e){return i.call(this,"readAsText",e)}})}}),i(I,[f,u,y],function(e,t,n){function i(){var e,i=[];t.extend(this,{append:function(r,o){var a=this,s=t.typeOf(o);o instanceof n?e={name:r,value:o}:"array"===s?(r+="[]",t.each(o,function(e){a.append(r,e)})):"object"===s?t.each(o,function(e,t){a.append(r+"["+t+"]",e)}):"null"===s||"undefined"===s||"number"===s&&isNaN(o)?a.append(r,"false"):i.push({name:r,value:o.toString()})},hasBlob:function(){return!!this.getBlob()},getBlob:function(){return e&&e.value||null},getBlobName:function(){return e&&e.name||null},each:function(n){t.each(i,function(e){n(e.value,e.name)}),e&&n(e.value,e.name)},destroy:function(){e=null,i=[]}})}return i}),i(T,[u,f,p,w,x,m,R,y,A,I,c,d],function(e,t,n,i,r,o,a,s,u,c,l,d){function h(){this.uid=e.guid("uid_")}function f(){function n(e,t){return w.hasOwnProperty(e)?1===arguments.length?l.can("define_property")?w[e]:v[e]:void(l.can("define_property")?w[e]=t:v[e]=t):void 0}function u(t){function i(){B&&(B.destroy(),B=null),s.dispatchEvent("loadend"),s=null}function r(r){B.bind("LoadStart",function(e){n("readyState",f.LOADING),s.dispatchEvent("readystatechange"),s.dispatchEvent(e),O&&s.upload.dispatchEvent(e)}),B.bind("Progress",function(e){n("readyState")!==f.LOADING&&(n("readyState",f.LOADING),s.dispatchEvent("readystatechange")),s.dispatchEvent(e)}),B.bind("UploadProgress",function(e){O&&s.upload.dispatchEvent({type:"progress",lengthComputable:!1,total:e.total,loaded:e.loaded})}),B.bind("Load",function(t){n("readyState",f.DONE),n("status",Number(r.exec.call(B,"XMLHttpRequest","getStatus")||0)),n("statusText",p[n("status")]||""),n("response",r.exec.call(B,"XMLHttpRequest","getResponse",n("responseType"))),~e.inArray(n("responseType"),["text",""])?n("responseText",n("response")):"document"===n("responseType")&&n("responseXML",n("response")),k=r.exec.call(B,"XMLHttpRequest","getAllResponseHeaders"),s.dispatchEvent("readystatechange"),n("status")>0?(O&&s.upload.dispatchEvent(t),s.dispatchEvent(t)):(N=!0,s.dispatchEvent("error")),i()}),B.bind("Abort",function(e){s.dispatchEvent(e),i()}),B.bind("Error",function(e){N=!0,n("readyState",f.DONE),s.dispatchEvent("readystatechange"),D=!0,s.dispatchEvent(e),i()}),r.exec.call(B,"XMLHttpRequest","send",{url:E,method:_,async:y,user:x,password:R,headers:b,mimeType:I,encoding:A,responseType:s.responseType,withCredentials:s.withCredentials,options:H},t)}var s=this;C=(new Date).getTime(),B=new a,"string"==typeof H.required_caps&&(H.required_caps=o.parseCaps(H.required_caps)),H.required_caps=e.extend({},H.required_caps,{return_response_type:s.responseType}),t instanceof c&&(H.required_caps.send_multipart=!0),e.isEmptyObj(b)||(H.required_caps.send_custom_headers=!0),L||(H.required_caps.do_cors=!0),H.ruid?r(B.connectRuntime(H)):(B.bind("RuntimeInit",function(e,t){r(t)}),B.bind("RuntimeError",function(e,t){s.dispatchEvent("RuntimeError",t)}),B.connectRuntime(H))}function g(){n("responseText",""),n("responseXML",null),n("response",null),n("status",0),n("statusText",""),C=M=null}var v=this,w={timeout:0,readyState:f.UNSENT,withCredentials:!1,status:0,statusText:"",responseType:"",responseXML:null,responseText:null,response:null},y=!0,E,_,b={},x,R,A=null,I=null,T=!1,S=!1,O=!1,D=!1,N=!1,L=!1,C,M,F=null,P=null,H={},B,k="",U;e.extend(this,w,{uid:e.guid("uid_"),upload:new h,open:function(o,a,s,u,c){var l;if(!o||!a)throw new t.DOMException(t.DOMException.SYNTAX_ERR);if(/[\u0100-\uffff]/.test(o)||i.utf8_encode(o)!==o)throw new t.DOMException(t.DOMException.SYNTAX_ERR);if(~e.inArray(o.toUpperCase(),["CONNECT","DELETE","GET","HEAD","OPTIONS","POST","PUT","TRACE","TRACK"])&&(_=o.toUpperCase()),~e.inArray(_,["CONNECT","TRACE","TRACK"]))throw new t.DOMException(t.DOMException.SECURITY_ERR);if(a=i.utf8_encode(a),l=r.parseUrl(a),L=r.hasSameOrigin(l),E=r.resolveUrl(a),(u||c)&&!L)throw new t.DOMException(t.DOMException.INVALID_ACCESS_ERR);if(x=u||l.user,R=c||l.pass,y=s||!0,y===!1&&(n("timeout")||n("withCredentials")||""!==n("responseType")))throw new t.DOMException(t.DOMException.INVALID_ACCESS_ERR);T=!y,S=!1,b={},g.call(this),n("readyState",f.OPENED),this.dispatchEvent("readystatechange")},setRequestHeader:function(r,o){var a=["accept-charset","accept-encoding","access-control-request-headers","access-control-request-method","connection","content-length","cookie","cookie2","content-transfer-encoding","date","expect","host","keep-alive","origin","referer","te","trailer","transfer-encoding","upgrade","user-agent","via"];if(n("readyState")!==f.OPENED||S)throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);if(/[\u0100-\uffff]/.test(r)||i.utf8_encode(r)!==r)throw new t.DOMException(t.DOMException.SYNTAX_ERR);return r=e.trim(r).toLowerCase(),~e.inArray(r,a)||/^(proxy\-|sec\-)/.test(r)?!1:(b[r]?b[r]+=", "+o:b[r]=o,!0)},getAllResponseHeaders:function(){return k||""},getResponseHeader:function(t){return t=t.toLowerCase(),N||~e.inArray(t,["set-cookie","set-cookie2"])?null:k&&""!==k&&(U||(U={},e.each(k.split(/\r\n/),function(t){var n=t.split(/:\s+/);2===n.length&&(n[0]=e.trim(n[0]),U[n[0].toLowerCase()]={header:n[0],value:e.trim(n[1])})})),U.hasOwnProperty(t))?U[t].header+": "+U[t].value:null},overrideMimeType:function(i){var r,o;if(~e.inArray(n("readyState"),[f.LOADING,f.DONE]))throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);if(i=e.trim(i.toLowerCase()),/;/.test(i)&&(r=i.match(/^([^;]+)(?:;\scharset\=)?(.*)$/))&&(i=r[1],r[2]&&(o=r[2])),!d.mimes[i])throw new t.DOMException(t.DOMException.SYNTAX_ERR);F=i,P=o},send:function(n,r){if(H="string"===e.typeOf(r)?{ruid:r}:r?r:{},this.readyState!==f.OPENED||S)throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);if(n instanceof s)H.ruid=n.ruid,I=n.type||"application/octet-stream";else if(n instanceof c){if(n.hasBlob()){var o=n.getBlob();H.ruid=o.ruid,I=o.type||"application/octet-stream"}}else"string"==typeof n&&(A="UTF-8",I="text/plain;charset=UTF-8",n=i.utf8_encode(n));this.withCredentials||(this.withCredentials=H.required_caps&&H.required_caps.send_browser_cookies&&!L),O=!T&&this.upload.hasEventListener(),N=!1,D=!n,T||(S=!0),u.call(this,n)},abort:function(){if(N=!0,T=!1,~e.inArray(n("readyState"),[f.UNSENT,f.OPENED,f.DONE]))n("readyState",f.UNSENT);else{if(n("readyState",f.DONE),S=!1,!B)throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);B.getRuntime().exec.call(B,"XMLHttpRequest","abort",D),D=!0}},destroy:function(){B&&("function"===e.typeOf(B.destroy)&&B.destroy(),B=null),this.unbindAll(),this.upload&&(this.upload.unbindAll(),this.upload=null)}}),this.handleEventProps(m.concat(["readystatechange"])),this.upload.handleEventProps(m)}var p={100:"Continue",101:"Switching Protocols",102:"Processing",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi-Status",226:"IM Used",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",305:"Use Proxy",306:"Reserved",307:"Temporary Redirect",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Request Entity Too Large",414:"Request-URI Too Long",415:"Unsupported Media Type",416:"Requested Range Not Satisfiable",417:"Expectation Failed",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",426:"Upgrade Required",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",510:"Not Extended"};h.prototype=n.instance;var m=["loadstart","progress","abort","error","load","timeout","loadend"],g=1,v=2;return f.UNSENT=0,f.OPENED=1,f.HEADERS_RECEIVED=2,f.LOADING=3,f.DONE=4,f.prototype=n.instance,f}),i(S,[u,w,g,p],function(e,t,n,i){function r(){function i(){l=d=0,c=this.result=null}function o(t,n){var i=this;u=n,i.bind("TransportingProgress",function(t){d=t.loaded,l>d&&-1===e.inArray(i.state,[r.IDLE,r.DONE])&&a.call(i)},999),i.bind("TransportingComplete",function(){d=l,i.state=r.DONE,c=null,i.result=u.exec.call(i,"Transporter","getAsBlob",t||"")},999),i.state=r.BUSY,i.trigger("TransportingStarted"),a.call(i)}function a(){var e=this,n,i=l-d;h>i&&(h=i),n=t.btoa(c.substr(d,h)),u.exec.call(e,"Transporter","receive",n,l)}var s,u,c,l,d,h;n.call(this),e.extend(this,{uid:e.guid("uid_"),state:r.IDLE,result:null,transport:function(t,n,r){var a=this;if(r=e.extend({chunk_size:204798},r),(s=r.chunk_size%3)&&(r.chunk_size+=3-s),h=r.chunk_size,i.call(this),c=t,l=t.length,"string"===e.typeOf(r)||r.ruid)o.call(a,n,this.connectRuntime(r));else{var u=function(e,t){a.unbind("RuntimeInit",u),o.call(a,n,t)};this.bind("RuntimeInit",u),this.connectRuntime(r)}},abort:function(){var e=this;e.state=r.IDLE,u&&(u.exec.call(e,"Transporter","clear"),e.trigger("TransportingAborted")),i.call(e)},destroy:function(){this.unbindAll(),u=null,this.disconnectRuntime(),i.call(this)}})}return r.IDLE=0,r.BUSY=1,r.DONE=2,r.prototype=i.instance,r}),i(O,[u,h,f,A,T,m,g,S,c,p,y,E,w],function(e,t,n,i,r,o,a,s,u,c,l,d,h){function f(){function i(e){e||(e=this.exec("Image","getInfo")),this.size=e.size,this.width=e.width,this.height=e.height,this.type=e.type,this.meta=e.meta,""===this.name&&(this.name=e.name)}function c(t){var i=e.typeOf(t);try{if(t instanceof f){if(!t.size)throw new n.DOMException(n.DOMException.INVALID_STATE_ERR);m.apply(this,arguments)}else if(t instanceof l){if(!~e.inArray(t.type,["image/jpeg","image/png"]))throw new n.ImageError(n.ImageError.WRONG_FORMAT);g.apply(this,arguments)}else if(-1!==e.inArray(i,["blob","file"]))c.call(this,new d(null,t),arguments[1]);else if("string"===i)"data:"===t.substr(0,5)?c.call(this,new l(null,{data:t}),arguments[1]):v.apply(this,arguments);else{if("node"!==i||"img"!==t.nodeName.toLowerCase())throw new n.DOMException(n.DOMException.TYPE_MISMATCH_ERR);c.call(this,t.src,arguments[1])}}catch(r){this.trigger("error",r.code)}}function m(t,n){var i=this.connectRuntime(t.ruid);this.ruid=i.uid,i.exec.call(this,"Image","loadFromImage",t,"undefined"===e.typeOf(n)?!0:n)}function g(t,n){function i(e){r.ruid=e.uid,e.exec.call(r,"Image","loadFromBlob",t)}var r=this;r.name=t.name||"",t.isDetached()?(this.bind("RuntimeInit",function(e,t){i(t)}),n&&"string"==typeof n.required_caps&&(n.required_caps=o.parseCaps(n.required_caps)),this.connectRuntime(e.extend({required_caps:{access_image_binary:!0,resize_image:!0}},n))):i(this.connectRuntime(t.ruid))}function v(e,t){var n=this,i;i=new r,i.open("get",e),i.responseType="blob",i.onprogress=function(e){n.trigger(e)},i.onload=function(){g.call(n,i.response,!0)},i.onerror=function(e){n.trigger(e)},i.onloadend=function(){i.destroy()},i.bind("RuntimeError",function(e,t){n.trigger("RuntimeError",t)}),i.send(null,t)}a.call(this),e.extend(this,{uid:e.guid("uid_"),ruid:null,name:"",size:0,width:0,height:0,type:"",meta:{},clone:function(){this.load.apply(this,arguments)},load:function(){c.apply(this,arguments)},downsize:function(t){var i={width:this.width,height:this.height,type:this.type||"image/jpeg",quality:90,crop:!1,preserveHeaders:!0,resample:!1};t="object"==typeof t?e.extend(i,t):e.extend(i,{width:arguments[0],height:arguments[1],crop:arguments[2],preserveHeaders:arguments[3]});try{if(!this.size)throw new n.DOMException(n.DOMException.INVALID_STATE_ERR);if(this.width>f.MAX_RESIZE_WIDTH||this.height>f.MAX_RESIZE_HEIGHT)throw new n.ImageError(n.ImageError.MAX_RESOLUTION_ERR);this.exec("Image","downsize",t.width,t.height,t.crop,t.preserveHeaders)}catch(r){this.trigger("error",r.code)}},crop:function(e,t,n){this.downsize(e,t,!0,n)},getAsCanvas:function(){if(!u.can("create_canvas"))throw new n.RuntimeError(n.RuntimeError.NOT_SUPPORTED_ERR);var e=this.connectRuntime(this.ruid);return e.exec.call(this,"Image","getAsCanvas")},getAsBlob:function(e,t){if(!this.size)throw new n.DOMException(n.DOMException.INVALID_STATE_ERR);return this.exec("Image","getAsBlob",e||"image/jpeg",t||90)},getAsDataURL:function(e,t){if(!this.size)throw new n.DOMException(n.DOMException.INVALID_STATE_ERR);return this.exec("Image","getAsDataURL",e||"image/jpeg",t||90)},getAsBinaryString:function(e,t){var n=this.getAsDataURL(e,t);return h.atob(n.substring(n.indexOf("base64,")+7))},embed:function(i,r){function o(t,r){var o=this;if(u.can("create_canvas")){var l=o.getAsCanvas();if(l)return i.appendChild(l),l=null,o.destroy(),void a.trigger("embedded")}var d=o.getAsDataURL(t,r);if(!d)throw new n.ImageError(n.ImageError.WRONG_FORMAT);if(u.can("use_data_uri_of",d.length))i.innerHTML='<img src="'+d+'" width="'+o.width+'" height="'+o.height+'" />',o.destroy(),a.trigger("embedded");else{var f=new s;f.bind("TransportingComplete",function(){c=a.connectRuntime(this.result.ruid),a.bind("Embedded",function(){e.extend(c.getShimContainer().style,{top:"0px",left:"0px",width:o.width+"px",height:o.height+"px"}),c=null},999),c.exec.call(a,"ImageView","display",this.result.uid,width,height),o.destroy()}),f.transport(h.atob(d.substring(d.indexOf("base64,")+7)),t,{required_caps:{display_media:!0},runtime_order:"flash,silverlight",container:i})}}var a=this,c;r=e.extend({width:this.width,height:this.height,type:this.type||"image/jpeg",quality:90},r||{});try{if(!(i=t.get(i)))throw new n.DOMException(n.DOMException.INVALID_NODE_TYPE_ERR);if(!this.size)throw new n.DOMException(n.DOMException.INVALID_STATE_ERR);this.width>f.MAX_RESIZE_WIDTH||this.height>f.MAX_RESIZE_HEIGHT;var l=new f;return l.bind("Resize",function(){o.call(this,r.type,r.quality)}),l.bind("Load",function(){l.downsize(r)}),this.meta.thumb&&this.meta.thumb.width>=r.width&&this.meta.thumb.height>=r.height?l.load(this.meta.thumb.data):l.clone(this,!1),l}catch(d){this.trigger("error",d.code)}},destroy:function(){this.ruid&&(this.getRuntime().exec.call(this,"Image","destroy"),this.disconnectRuntime()),this.unbindAll()}}),this.handleEventProps(p),this.bind("Load Resize",function(){i.call(this)},999)}var p=["progress","load","error","resize","embedded"];return f.MAX_RESIZE_WIDTH=8192,f.MAX_RESIZE_HEIGHT=8192,f.prototype=c.instance,f}),i(D,[u,f,m,c],function(e,t,n,i){function r(t){var r=this,s=n.capTest,u=n.capTrue,c=e.extend({access_binary:s(window.FileReader||window.File&&window.File.getAsDataURL),access_image_binary:function(){return r.can("access_binary")&&!!a.Image},display_media:s(i.can("create_canvas")||i.can("use_data_uri_over32kb")),do_cors:s(window.XMLHttpRequest&&"withCredentials"in new XMLHttpRequest),drag_and_drop:s(function(){var e=document.createElement("div");return("draggable"in e||"ondragstart"in e&&"ondrop"in e)&&("IE"!==i.browser||i.verComp(i.version,9,">"))}()),filter_by_extension:s(function(){return"Chrome"===i.browser&&i.verComp(i.version,28,">=")||"IE"===i.browser&&i.verComp(i.version,10,">=")||"Safari"===i.browser&&i.verComp(i.version,7,">=")}()),return_response_headers:u,return_response_type:function(e){return"json"===e&&window.JSON?!0:i.can("return_response_type",e)},return_status_code:u,report_upload_progress:s(window.XMLHttpRequest&&(new XMLHttpRequest).upload),resize_image:function(){return r.can("access_binary")&&i.can("create_canvas")},select_file:function(){return i.can("use_fileinput")&&window.File},select_folder:function(){return r.can("select_file")&&"Chrome"===i.browser&&i.verComp(i.version,21,">=")},select_multiple:function(){return r.can("select_file")&&!("Safari"===i.browser&&"Windows"===i.os)&&!("iOS"===i.os&&i.verComp(i.osVersion,"7.0.0",">")&&i.verComp(i.osVersion,"8.0.0","<"))},send_binary_string:s(window.XMLHttpRequest&&((new XMLHttpRequest).sendAsBinary||window.Uint8Array&&window.ArrayBuffer)),send_custom_headers:s(window.XMLHttpRequest),send_multipart:function(){return!!(window.XMLHttpRequest&&(new XMLHttpRequest).upload&&window.FormData)||r.can("send_binary_string")},slice_blob:s(window.File&&(File.prototype.mozSlice||File.prototype.webkitSlice||File.prototype.slice)),stream_upload:function(){return r.can("slice_blob")&&r.can("send_multipart")},summon_file_dialog:function(){return r.can("select_file")&&("Firefox"===i.browser&&i.verComp(i.version,4,">=")||"Opera"===i.browser&&i.verComp(i.version,12,">=")||"IE"===i.browser&&i.verComp(i.version,10,">=")||!!~e.inArray(i.browser,["Chrome","Safari"]))},upload_filesize:u},arguments[2]);n.call(this,t,arguments[1]||o,c),e.extend(this,{init:function(){this.trigger("Init")},destroy:function(e){return function(){e.call(r),e=r=null}}(this.destroy)}),e.extend(this.getShim(),a)}var o="html5",a={};return n.addConstructor(o,r),a}),i(N,[u],function(e){function t(){this.returnValue=!1}function n(){this.cancelBubble=!0}var i={},r="moxie_"+e.guid(),o=function(o,a,s,u){var c,l;a=a.toLowerCase(),o.addEventListener?(c=s,o.addEventListener(a,c,!1)):o.attachEvent&&(c=function(){var e=window.event;e.target||(e.target=e.srcElement),e.preventDefault=t,e.stopPropagation=n,s(e)},o.attachEvent("on"+a,c)),o[r]||(o[r]=e.guid()),i.hasOwnProperty(o[r])||(i[o[r]]={}),l=i[o[r]],l.hasOwnProperty(a)||(l[a]=[]),l[a].push({func:c,orig:s,key:u})},a=function(t,n,o){var a,s;if(n=n.toLowerCase(),t[r]&&i[t[r]]&&i[t[r]][n]){a=i[t[r]][n];for(var u=a.length-1;u>=0&&(a[u].orig!==o&&a[u].key!==o||(t.removeEventListener?t.removeEventListener(n,a[u].func,!1):t.detachEvent&&t.detachEvent("on"+n,a[u].func),a[u].orig=null,a[u].func=null,a.splice(u,1),o===s));u--);if(a.length||delete i[t[r]][n],e.isEmptyObj(i[t[r]])){delete i[t[r]];try{delete t[r]}catch(c){t[r]=s}}}},s=function(t,n){t&&t[r]&&e.each(i[t[r]],function(e,i){a(t,i,n)})};return{addEvent:o,removeEvent:a,removeAllEvents:s}}),i(L,[D,E,u,h,N,d,c],function(e,t,n,i,r,o,a){function s(){var e;n.extend(this,{init:function(s){var u=this,c=u.getRuntime(),l,d,h,f,p,m;e=s,h=e.accept.mimes||o.extList2mimes(e.accept,c.can("filter_by_extension")),d=c.getShimContainer(),d.innerHTML='<input id="'+c.uid+'" type="file" style="font-size:999px;opacity:0;"'+(e.multiple&&c.can("select_multiple")?"multiple":"")+(e.directory&&c.can("select_folder")?"webkitdirectory directory":"")+(h?' accept="'+h.join(",")+'"':"")+" />",l=i.get(c.uid),n.extend(l.style,{position:"absolute",top:0,left:0,width:"100%",height:"100%"}),f=i.get(e.browse_button),c.can("summon_file_dialog")&&("static"===i.getStyle(f,"position")&&(f.style.position="relative"),p=parseInt(i.getStyle(f,"z-index"),10)||1,f.style.zIndex=p,d.style.zIndex=p-1,r.addEvent(f,"click",function(e){var t=i.get(c.uid);t&&!t.disabled&&t.click(),e.preventDefault()},u.uid)),m=c.can("summon_file_dialog")?f:d,r.addEvent(m,"mouseover",function(){u.trigger("mouseenter")},u.uid),r.addEvent(m,"mouseout",function(){u.trigger("mouseleave")},u.uid),r.addEvent(m,"mousedown",function(){u.trigger("mousedown")},u.uid),r.addEvent(i.get(e.container),"mouseup",function(){u.trigger("mouseup")},u.uid),l.onchange=function g(i){if(u.files=[],n.each(this.files,function(n){var i="";return e.directory&&"."==n.name?!0:(n.webkitRelativePath&&(i="/"+n.webkitRelativePath.replace(/^\//,"")),n=new t(c.uid,n),n.relativePath=i,void u.files.push(n))}),"IE"!==a.browser&&"IEMobile"!==a.browser)this.value="";else{var r=this.cloneNode(!0);this.parentNode.replaceChild(r,this),r.onchange=g}u.files.length&&u.trigger("change")},u.trigger({type:"ready",async:!0}),d=null},disable:function(e){var t=this.getRuntime(),n;(n=i.get(t.uid))&&(n.disabled=!!e)},destroy:function(){var t=this.getRuntime(),n=t.getShim(),o=t.getShimContainer();r.removeAllEvents(o,this.uid),r.removeAllEvents(e&&i.get(e.container),this.uid),r.removeAllEvents(e&&i.get(e.browse_button),this.uid),o&&(o.innerHTML=""),n.removeInstance(this.uid),e=o=n=null}})}return e.FileInput=s}),i(C,[D,y],function(e,t){function n(){function e(e,t,n){var i;if(!window.File.prototype.slice)return(i=window.File.prototype.webkitSlice||window.File.prototype.mozSlice)?i.call(e,t,n):null;try{return e.slice(),e.slice(t,n)}catch(r){return e.slice(t,n-t)}}this.slice=function(){return new t(this.getRuntime().uid,e.apply(this,arguments))}}return e.Blob=n}),i(M,[D,E,u,h,N,d],function(e,t,n,i,r,o){function a(){function e(e){if(!e.dataTransfer||!e.dataTransfer.types)return!1;var t=n.toArray(e.dataTransfer.types||[]);return-1!==n.inArray("Files",t)||-1!==n.inArray("public.file-url",t)||-1!==n.inArray("application/x-moz-file",t)}function a(e,n){if(u(e)){var i=new t(g,e);i.relativePath=n||"",f.push(i)}}function s(e){for(var t=[],i=0;i<e.length;i++)[].push.apply(t,e[i].extensions.split(/\s*,\s*/));return-1===n.inArray("*",t)?t:[]}function u(e){if(!p.length)return!0;var t=o.getFileExtension(e.name);return!t||-1!==n.inArray(t,p)}function c(e,t){var i=[];n.each(e,function(e){var t=e.webkitGetAsEntry();t&&(t.isFile?a(e.getAsFile(),t.fullPath):i.push(t))}),i.length?l(i,t):t()}function l(e,t){var i=[];n.each(e,function(e){i.push(function(t){d(e,t)})}),n.inSeries(i,function(){t()})}function d(e,t){e.isFile?e.file(function(n){a(n,e.fullPath),t()},function(){t()}):e.isDirectory?h(e,t):t()}function h(e,t){function n(e){r.readEntries(function(t){t.length?([].push.apply(i,t),n(e)):e()},e)}var i=[],r=e.createReader();n(function(){l(i,t)})}var f=[],p=[],m,g;n.extend(this,{init:function(t){var i=this,o;m=t,g=i.ruid,p=s(m.accept),o=m.container,r.addEvent(o,"dragover",function(t){e(t)&&(t.preventDefault(),t.dataTransfer.dropEffect="copy")},i.uid),r.addEvent(o,"drop",function(t){e(t)&&(t.preventDefault(),f=[],t.dataTransfer.items&&t.dataTransfer.items[0].webkitGetAsEntry?c(t.dataTransfer.items,function(){i.files=f,i.trigger("drop")}):(n.each(t.dataTransfer.files,function(e){a(e)}),i.files=f,i.trigger("drop")))},i.uid),r.addEvent(o,"dragenter",function(e){i.trigger("dragenter")},i.uid),r.addEvent(o,"dragleave",function(e){i.trigger("dragleave")},i.uid)},destroy:function(){r.removeAllEvents(m&&i.get(m.container),this.uid),g=f=p=m=null}})}return e.FileDrop=a}),i(F,[D,w,u],function(e,t,n){function i(){function e(e){return t.atob(e.substring(e.indexOf("base64,")+7))}var i,r=!1;n.extend(this,{read:function(t,o){var a=this;a.result="",i=new window.FileReader,i.addEventListener("progress",function(e){a.trigger(e)}),i.addEventListener("load",function(t){a.result=r?e(i.result):i.result,a.trigger(t)}),i.addEventListener("error",function(e){a.trigger(e,i.error)}),i.addEventListener("loadend",function(e){i=null,a.trigger(e)}),"function"===n.typeOf(i[t])?(r=!1,i[t](o.getSource())):"readAsBinaryString"===t&&(r=!0,i.readAsDataURL(o.getSource()))},abort:function(){i&&i.abort()},destroy:function(){i=null}})}return e.FileReader=i}),i(P,[D,u,d,x,E,y,I,f,c],function(e,t,n,i,r,o,a,s,u){function c(){function e(e,t){var n=this,i,r;i=t.getBlob().getSource(),r=new window.FileReader,r.onload=function(){t.append(t.getBlobName(),new o(null,{type:i.type,data:r.result})),h.send.call(n,e,t)},r.readAsBinaryString(i)}function c(){return!window.XMLHttpRequest||"IE"===u.browser&&u.verComp(u.version,8,"<")?function(){for(var e=["Msxml2.XMLHTTP.6.0","Microsoft.XMLHTTP"],t=0;t<e.length;t++)try{return new ActiveXObject(e[t])}catch(n){}}():new window.XMLHttpRequest}function l(e){var t=e.responseXML,n=e.responseText;return"IE"===u.browser&&n&&t&&!t.documentElement&&/[^\/]+\/[^\+]+\+xml/.test(e.getResponseHeader("Content-Type"))&&(t=new window.ActiveXObject("Microsoft.XMLDOM"),t.async=!1,t.validateOnParse=!1,t.loadXML(n)),t&&("IE"===u.browser&&0!==t.parseError||!t.documentElement||"parsererror"===t.documentElement.tagName)?null:t}function d(e){var t="----moxieboundary"+(new Date).getTime(),n="--",i="\r\n",r="",a=this.getRuntime();if(!a.can("send_binary_string"))throw new s.RuntimeError(s.RuntimeError.NOT_SUPPORTED_ERR);return f.setRequestHeader("Content-Type","multipart/form-data; boundary="+t),e.each(function(e,a){r+=e instanceof o?n+t+i+'Content-Disposition: form-data; name="'+a+'"; filename="'+unescape(encodeURIComponent(e.name||"blob"))+'"'+i+"Content-Type: "+(e.type||"application/octet-stream")+i+i+e.getSource()+i:n+t+i+'Content-Disposition: form-data; name="'+a+'"'+i+i+unescape(encodeURIComponent(e))+i}),r+=n+t+n+i}var h=this,f,p;t.extend(this,{send:function(n,r){var s=this,l="Mozilla"===u.browser&&u.verComp(u.version,4,">=")&&u.verComp(u.version,7,"<"),h="Android Browser"===u.browser,m=!1;if(p=n.url.replace(/^.+?\/([\w\-\.]+)$/,"$1").toLowerCase(),f=c(),f.open(n.method,n.url,n.async,n.user,n.password),r instanceof o)r.isDetached()&&(m=!0),r=r.getSource();else if(r instanceof a){if(r.hasBlob())if(r.getBlob().isDetached())r=d.call(s,r),m=!0;else if((l||h)&&"blob"===t.typeOf(r.getBlob().getSource())&&window.FileReader)return void e.call(s,n,r);if(r instanceof a){var g=new window.FormData;r.each(function(e,t){e instanceof o?g.append(t,e.getSource()):g.append(t,e)}),r=g}}f.upload?(n.withCredentials&&(f.withCredentials=!0),f.addEventListener("load",function(e){s.trigger(e)}),f.addEventListener("error",function(e){s.trigger(e)}),f.addEventListener("progress",function(e){s.trigger(e)}),f.upload.addEventListener("progress",function(e){s.trigger({type:"UploadProgress",loaded:e.loaded,total:e.total})})):f.onreadystatechange=function v(){switch(f.readyState){case 1:break;case 2:break;case 3:var e,t;try{i.hasSameOrigin(n.url)&&(e=f.getResponseHeader("Content-Length")||0),f.responseText&&(t=f.responseText.length)}catch(r){e=t=0}s.trigger({type:"progress",lengthComputable:!!e,total:parseInt(e,10),loaded:t});break;case 4:f.onreadystatechange=function(){},0===f.status?s.trigger("error"):s.trigger("load")}},t.isEmptyObj(n.headers)||t.each(n.headers,function(e,t){f.setRequestHeader(t,e)}),""!==n.responseType&&"responseType"in f&&("json"!==n.responseType||u.can("return_response_type","json")?f.responseType=n.responseType:f.responseType="text"),m?f.sendAsBinary?f.sendAsBinary(r):!function(){for(var e=new Uint8Array(r.length),t=0;t<r.length;t++)e[t]=255&r.charCodeAt(t);f.send(e.buffer)}():f.send(r),s.trigger("loadstart")},getStatus:function(){try{if(f)return f.status}catch(e){}return 0},getResponse:function(e){var t=this.getRuntime();try{switch(e){case"blob":var i=new r(t.uid,f.response),o=f.getResponseHeader("Content-Disposition");if(o){var a=o.match(/filename=([\'\"'])([^\1]+)\1/);a&&(p=a[2])}return i.name=p,i.type||(i.type=n.getFileMime(p)),i;case"json":return u.can("return_response_type","json")?f.response:200===f.status&&window.JSON?JSON.parse(f.responseText):null;case"document":return l(f);default:return""!==f.responseText?f.responseText:null}}catch(s){return null}},getAllResponseHeaders:function(){try{return f.getAllResponseHeaders()}catch(e){}return""},abort:function(){f&&f.abort()},destroy:function(){h=p=null}})}return e.XMLHttpRequest=c}),i(H,[u],function(e){function t(e){e instanceof ArrayBuffer?n.apply(this,arguments):i.apply(this,arguments)}function n(t){var n=new DataView(t);e.extend(this,{readByteAt:function(e){return n.getUint8(e)},writeByteAt:function(e,t){n.setUint8(e,t)},SEGMENT:function(e,i,r){switch(arguments.length){case 2:return t.slice(e,e+i);case 1:return t.slice(e);case 3:if(null===r&&(r=new ArrayBuffer),r instanceof ArrayBuffer){var o=new Uint8Array(this.length()-i+r.byteLength);e>0&&o.set(new Uint8Array(t.slice(0,e)),0),o.set(new Uint8Array(r),e),o.set(new Uint8Array(t.slice(e+i)),e+r.byteLength),this.clear(),t=o.buffer,n=new DataView(t);break}default:return t}},length:function(){return t?t.byteLength:0},clear:function(){n=t=null}})}function i(t){function n(e,n,i){i=3===arguments.length?i:t.length-n-1,t=t.substr(0,n)+e+t.substr(i+n)}e.extend(this,{readByteAt:function(e){return t.charCodeAt(e)},writeByteAt:function(e,t){n(String.fromCharCode(t),e,1)},SEGMENT:function(e,i,r){switch(arguments.length){case 1:return t.substr(e);case 2:return t.substr(e,i);case 3:n(null!==r?r:"",e,i);break;default:return t}},length:function(){return t?t.length:0},clear:function(){t=null}})}return e.extend(t.prototype,{littleEndian:!1,read:function(e,t){var n,i,r;if(e+t>this.length())throw new Error("You are trying to read outside the source boundaries.");for(i=this.littleEndian?0:-8*(t-1),r=0,n=0;t>r;r++)n|=this.readByteAt(e+r)<<Math.abs(i+8*r);return n},write:function(e,t,n){var i,r,o="";if(e>this.length())throw new Error("You are trying to write outside the source boundaries.");for(i=this.littleEndian?0:-8*(n-1),r=0;n>r;r++)this.writeByteAt(e+r,t>>Math.abs(i+8*r)&255)},BYTE:function(e){return this.read(e,1)},SHORT:function(e){return this.read(e,2)},LONG:function(e){return this.read(e,4)},SLONG:function(e){var t=this.read(e,4);return t>2147483647?t-4294967296:t},CHAR:function(e){return String.fromCharCode(this.read(e,1))},STRING:function(e,t){return this.asArray("CHAR",e,t).join("")},asArray:function(e,t,n){for(var i=[],r=0;n>r;r++)i[r]=this[e](t+r);return i}}),t}),i(B,[H,f],function(e,t){return function n(i){var r=[],o,a,s,u=0;if(o=new e(i),65496!==o.SHORT(0))throw o.clear(),new t.ImageError(t.ImageError.WRONG_FORMAT);for(a=2;a<=o.length();)if(s=o.SHORT(a),s>=65488&&65495>=s)a+=2;else{if(65498===s||65497===s)break;u=o.SHORT(a+2)+2,s>=65505&&65519>=s&&r.push({hex:s,name:"APP"+(15&s),start:a,length:u,segment:o.SEGMENT(a,u)}),a+=u}return o.clear(),{headers:r,restore:function(t){var n,i,o;for(o=new e(t),a=65504==o.SHORT(2)?4+o.SHORT(4):2,i=0,n=r.length;n>i;i++)o.SEGMENT(a,0,r[i].segment),a+=r[i].length;return t=o.SEGMENT(),o.clear(),t},strip:function(t){var i,r,o,a;for(o=new n(t),r=o.headers,o.purge(),i=new e(t),a=r.length;a--;)i.SEGMENT(r[a].start,r[a].length,"");return t=i.SEGMENT(),i.clear(),t},get:function(e){for(var t=[],n=0,i=r.length;i>n;n++)r[n].name===e.toUpperCase()&&t.push(r[n].segment);
return t},set:function(e,t){var n=[],i,o,a;for("string"==typeof t?n.push(t):n=t,i=o=0,a=r.length;a>i&&(r[i].name===e.toUpperCase()&&(r[i].segment=n[o],r[i].length=n[o].length,o++),!(o>=n.length));i++);},purge:function(){this.headers=r=[]}}}}),i(k,[u,H,f],function(e,n,i){function r(o){function a(n,r){var o=this,a,s,u,c,h,f,p,m,g=[],v={},w={1:"BYTE",7:"UNDEFINED",2:"ASCII",3:"SHORT",4:"LONG",5:"RATIONAL",9:"SLONG",10:"SRATIONAL"},y={BYTE:1,UNDEFINED:1,ASCII:1,SHORT:2,LONG:4,RATIONAL:8,SLONG:4,SRATIONAL:8};for(a=o.SHORT(n),s=0;a>s;s++)if(g=[],p=n+2+12*s,u=r[o.SHORT(p)],u!==t){if(c=w[o.SHORT(p+=2)],h=o.LONG(p+=2),f=y[c],!f)throw new i.ImageError(i.ImageError.INVALID_META_ERR);if(p+=4,f*h>4&&(p=o.LONG(p)+d.tiffHeader),p+f*h>=this.length())throw new i.ImageError(i.ImageError.INVALID_META_ERR);"ASCII"!==c?(g=o.asArray(c,p,h),m=1==h?g[0]:g,l.hasOwnProperty(u)&&"object"!=typeof m?v[u]=l[u][m]:v[u]=m):v[u]=e.trim(o.STRING(p,h).replace(/\0$/,""))}return v}function s(e,t,n){var i,r,o,a=0;if("string"==typeof t){var s=c[e.toLowerCase()];for(var u in s)if(s[u]===t){t=u;break}}i=d[e.toLowerCase()+"IFD"],r=this.SHORT(i);for(var l=0;r>l;l++)if(o=i+12*l+2,this.SHORT(o)==t){a=o+8;break}if(!a)return!1;try{this.write(a,n,4)}catch(h){return!1}return!0}var u,c,l,d,h,f;if(n.call(this,o),c={tiff:{274:"Orientation",270:"ImageDescription",271:"Make",272:"Model",305:"Software",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer"},exif:{36864:"ExifVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",36867:"DateTimeOriginal",33434:"ExposureTime",33437:"FNumber",34855:"ISOSpeedRatings",37377:"ShutterSpeedValue",37378:"ApertureValue",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37386:"FocalLength",41986:"ExposureMode",41987:"WhiteBalance",41990:"SceneCaptureType",41988:"DigitalZoomRatio",41992:"Contrast",41993:"Saturation",41994:"Sharpness"},gps:{0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude"},thumb:{513:"JPEGInterchangeFormat",514:"JPEGInterchangeFormatLength"}},l={ColorSpace:{1:"sRGB",0:"Uncalibrated"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{1:"Daylight",2:"Fliorescent",3:"Tungsten",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 -5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},ExposureMode:{0:"Auto exposure",1:"Manual exposure",2:"Auto bracket"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},GPSLatitudeRef:{N:"North latitude",S:"South latitude"},GPSLongitudeRef:{E:"East longitude",W:"West longitude"}},d={tiffHeader:10},h=d.tiffHeader,u={clear:this.clear},e.extend(this,{read:function(){try{return r.prototype.read.apply(this,arguments)}catch(e){throw new i.ImageError(i.ImageError.INVALID_META_ERR)}},write:function(){try{return r.prototype.write.apply(this,arguments)}catch(e){throw new i.ImageError(i.ImageError.INVALID_META_ERR)}},UNDEFINED:function(){return this.BYTE.apply(this,arguments)},RATIONAL:function(e){return this.LONG(e)/this.LONG(e+4)},SRATIONAL:function(e){return this.SLONG(e)/this.SLONG(e+4)},ASCII:function(e){return this.CHAR(e)},TIFF:function(){return f||null},EXIF:function(){var t=null;if(d.exifIFD){try{t=a.call(this,d.exifIFD,c.exif)}catch(n){return null}if(t.ExifVersion&&"array"===e.typeOf(t.ExifVersion)){for(var i=0,r="";i<t.ExifVersion.length;i++)r+=String.fromCharCode(t.ExifVersion[i]);t.ExifVersion=r}}return t},GPS:function(){var t=null;if(d.gpsIFD){try{t=a.call(this,d.gpsIFD,c.gps)}catch(n){return null}t.GPSVersionID&&"array"===e.typeOf(t.GPSVersionID)&&(t.GPSVersionID=t.GPSVersionID.join("."))}return t},thumb:function(){if(d.IFD1)try{var e=a.call(this,d.IFD1,c.thumb);if("JPEGInterchangeFormat"in e)return this.SEGMENT(d.tiffHeader+e.JPEGInterchangeFormat,e.JPEGInterchangeFormatLength)}catch(t){}return null},setExif:function(e,t){return"PixelXDimension"!==e&&"PixelYDimension"!==e?!1:s.call(this,"exif",e,t)},clear:function(){u.clear(),o=c=l=f=d=u=null}}),65505!==this.SHORT(0)||"EXIF\x00"!==this.STRING(4,5).toUpperCase())throw new i.ImageError(i.ImageError.INVALID_META_ERR);if(this.littleEndian=18761==this.SHORT(h),42!==this.SHORT(h+=2))throw new i.ImageError(i.ImageError.INVALID_META_ERR);d.IFD0=d.tiffHeader+this.LONG(h+=2),f=a.call(this,d.IFD0,c.tiff),"ExifIFDPointer"in f&&(d.exifIFD=d.tiffHeader+f.ExifIFDPointer,delete f.ExifIFDPointer),"GPSInfoIFDPointer"in f&&(d.gpsIFD=d.tiffHeader+f.GPSInfoIFDPointer,delete f.GPSInfoIFDPointer),e.isEmptyObj(f)&&(f=null);var p=this.LONG(d.IFD0+12*this.SHORT(d.IFD0)+2);p&&(d.IFD1=d.tiffHeader+p)}return r.prototype=n.prototype,r}),i(U,[u,f,B,H,k],function(e,t,n,i,r){function o(o){function a(e){var t=0,n,i;for(e||(e=c);t<=e.length();){if(n=e.SHORT(t+=2),n>=65472&&65475>=n)return t+=5,{height:e.SHORT(t),width:e.SHORT(t+=2)};i=e.SHORT(t+=2),t+=i-2}return null}function s(){var e=d.thumb(),t,n;return e&&(t=new i(e),n=a(t),t.clear(),n)?(n.data=e,n):null}function u(){d&&l&&c&&(d.clear(),l.purge(),c.clear(),h=l=d=c=null)}var c,l,d,h;if(c=new i(o),65496!==c.SHORT(0))throw new t.ImageError(t.ImageError.WRONG_FORMAT);l=new n(o);try{d=new r(l.get("app1")[0])}catch(f){}h=a.call(this),e.extend(this,{type:"image/jpeg",size:c.length(),width:h&&h.width||0,height:h&&h.height||0,setExif:function(t,n){return d?("object"===e.typeOf(t)?e.each(t,function(e,t){d.setExif(t,e)}):d.setExif(t,n),void l.set("app1",d.SEGMENT())):!1},writeHeaders:function(){return arguments.length?l.restore(arguments[0]):l.restore(o)},stripHeaders:function(e){return l.strip(e)},purge:function(){u.call(this)}}),d&&(this.meta={tiff:d.TIFF(),exif:d.EXIF(),gps:d.GPS(),thumb:s()})}return o}),i(G,[f,u,H],function(e,t,n){function i(i){function r(){var e,t;return e=a.call(this,8),"IHDR"==e.type?(t=e.start,{width:s.LONG(t),height:s.LONG(t+=4)}):null}function o(){s&&(s.clear(),i=l=u=c=s=null)}function a(e){var t,n,i,r;return t=s.LONG(e),n=s.STRING(e+=4,4),i=e+=4,r=s.LONG(e+t),{length:t,type:n,start:i,CRC:r}}var s,u,c,l;s=new n(i),function(){var t=0,n=0,i=[35152,20039,3338,6666];for(n=0;n<i.length;n++,t+=2)if(i[n]!=s.SHORT(t))throw new e.ImageError(e.ImageError.WRONG_FORMAT)}(),l=r.call(this),t.extend(this,{type:"image/png",size:s.length(),width:l.width,height:l.height,purge:function(){o.call(this)}}),o.call(this)}return i}),i(z,[u,f,U,G],function(e,t,n,i){return function(r){var o=[n,i],a;a=function(){for(var e=0;e<o.length;e++)try{return new o[e](r)}catch(n){}throw new t.ImageError(t.ImageError.WRONG_FORMAT)}(),e.extend(this,{type:"",size:0,width:0,height:0,setExif:function(){},writeHeaders:function(e){return e},stripHeaders:function(e){return e},purge:function(){r=null}}),e.extend(this,a),this.purge=function(){a.purge(),a=null}}}),i(q,[],function(){function e(e,i,r){var o=e.naturalWidth,a=e.naturalHeight,s=r.width,u=r.height,c=r.x||0,l=r.y||0,d=i.getContext("2d");t(e)&&(o/=2,a/=2);var h=1024,f=document.createElement("canvas");f.width=f.height=h;for(var p=f.getContext("2d"),m=n(e,o,a),g=0;a>g;){for(var v=g+h>a?a-g:h,w=0;o>w;){var y=w+h>o?o-w:h;p.clearRect(0,0,h,h),p.drawImage(e,-w,-g);var E=w*s/o+c<<0,_=Math.ceil(y*s/o),b=g*u/a/m+l<<0,x=Math.ceil(v*u/a/m);d.drawImage(f,0,0,y,v,E,b,_,x),w+=h}g+=h}f=p=null}function t(e){var t=e.naturalWidth,n=e.naturalHeight;if(t*n>1048576){var i=document.createElement("canvas");i.width=i.height=1;var r=i.getContext("2d");return r.drawImage(e,-t+1,0),0===r.getImageData(0,0,1,1).data[3]}return!1}function n(e,t,n){var i=document.createElement("canvas");i.width=1,i.height=n;var r=i.getContext("2d");r.drawImage(e,0,0);for(var o=r.getImageData(0,0,1,n).data,a=0,s=n,u=n;u>a;){var c=o[4*(u-1)+3];0===c?s=u:a=u,u=s+a>>1}i=null;var l=u/n;return 0===l?1:l}return{isSubsampled:t,renderTo:e}}),i(j,[D,u,f,w,y,E,z,q,d,c],function(e,t,n,i,r,o,a,s,u,c){function l(){function e(){if(!_&&!y)throw new n.ImageError(n.DOMException.INVALID_STATE_ERR);return _||y}function l(e){return i.atob(e.substring(e.indexOf("base64,")+7))}function d(e,t){return"data:"+(t||"")+";base64,"+i.btoa(e)}function h(e){var t=this;y=new Image,y.onerror=function(){v.call(this),t.trigger("error",n.ImageError.WRONG_FORMAT)},y.onload=function(){t.trigger("load")},y.src="data:"==e.substr(0,5)?e:d(e,x.type)}function f(e,t){var i=this,r;return window.FileReader?(r=new FileReader,r.onload=function(){t(this.result)},r.onerror=function(){i.trigger("error",n.ImageError.WRONG_FORMAT)},r.readAsDataURL(e),void 0):t(e.getAsDataURL())}function p(n,i,r,o){var a=this,s,u,c=0,l=0,d,h,f,p;if(A=o,p=this.meta&&this.meta.tiff&&this.meta.tiff.Orientation||1,-1!==t.inArray(p,[5,6,7,8])){var v=n;n=i,i=v}return d=e(),r?(n=Math.min(n,d.width),i=Math.min(i,d.height),s=Math.max(n/d.width,i/d.height)):s=Math.min(n/d.width,i/d.height),s>1&&!r&&o?void this.trigger("Resize"):(_||(_=document.createElement("canvas")),h=Math.round(d.width*s),f=Math.round(d.height*s),r?(_.width=n,_.height=i,h>n&&(c=Math.round((h-n)/2)),f>i&&(l=Math.round((f-i)/2))):(_.width=h,_.height=f),A||g(_.width,_.height,p),m.call(this,d,_,-c,-l,h,f),this.width=_.width,this.height=_.height,R=!0,void a.trigger("Resize"))}function m(e,t,n,i,r,o){if("iOS"===c.OS)s.renderTo(e,t,{width:r,height:o,x:n,y:i});else{var a=t.getContext("2d");a.drawImage(e,n,i,r,o)}}function g(e,t,n){switch(n){case 5:case 6:case 7:case 8:_.width=t,_.height=e;break;default:_.width=e,_.height=t}var i=_.getContext("2d");switch(n){case 2:i.translate(e,0),i.scale(-1,1);break;case 3:i.translate(e,t),i.rotate(Math.PI);break;case 4:i.translate(0,t),i.scale(1,-1);break;case 5:i.rotate(.5*Math.PI),i.scale(1,-1);break;case 6:i.rotate(.5*Math.PI),i.translate(0,-t);break;case 7:i.rotate(.5*Math.PI),i.translate(e,-t),i.scale(-1,1);break;case 8:i.rotate(-.5*Math.PI),i.translate(-e,0)}}function v(){E&&(E.purge(),E=null),b=y=_=x=null,R=!1}var w=this,y,E,_,b,x,R=!1,A=!0;t.extend(this,{loadFromBlob:function(e){var t=this,i=t.getRuntime(),r=arguments.length>1?arguments[1]:!0;if(!i.can("access_binary"))throw new n.RuntimeError(n.RuntimeError.NOT_SUPPORTED_ERR);return x=e,e.isDetached()?(b=e.getSource(),void h.call(this,b)):void f.call(this,e.getSource(),function(e){r&&(b=l(e)),h.call(t,e)})},loadFromImage:function(e,t){this.meta=e.meta,x=new o(null,{name:e.name,size:e.size,type:e.type}),h.call(this,t?b=e.getAsBinaryString():e.getAsDataURL())},getInfo:function(){var t=this.getRuntime(),n;return!E&&b&&t.can("access_image_binary")&&(E=new a(b)),n={width:e().width||0,height:e().height||0,type:x.type||u.getFileMime(x.name),size:b&&b.length||x.size||0,name:x.name||"",meta:E&&E.meta||this.meta||{}},!n.meta||!n.meta.thumb||n.meta.thumb.data instanceof r||(n.meta.thumb.data=new r(null,{type:"image/jpeg",data:n.meta.thumb.data})),n},downsize:function(){p.apply(this,arguments)},getAsCanvas:function(){return _&&(_.id=this.uid+"_canvas"),_},getAsBlob:function(e,t){return e!==this.type&&p.call(this,this.width,this.height,!1),new o(null,{name:x.name||"",type:e,data:w.getAsBinaryString.call(this,e,t)})},getAsDataURL:function(e){var t=arguments[1]||90;if(!R)return y.src;if("image/jpeg"!==e)return _.toDataURL("image/png");try{return _.toDataURL("image/jpeg",t/100)}catch(n){return _.toDataURL("image/jpeg")}},getAsBinaryString:function(e,t){if(!R)return b||(b=l(w.getAsDataURL(e,t))),b;if("image/jpeg"!==e)b=l(w.getAsDataURL(e,t));else{var n;t||(t=90);try{n=_.toDataURL("image/jpeg",t/100)}catch(i){n=_.toDataURL("image/jpeg")}b=l(n),E&&(b=E.stripHeaders(b),A&&(E.meta&&E.meta.exif&&E.setExif({PixelXDimension:this.width,PixelYDimension:this.height}),b=E.writeHeaders(b)),E.purge(),E=null)}return R=!1,b},destroy:function(){w=null,v.call(this),this.getRuntime().getShim().removeInstance(this.uid)}})}return e.Image=l}),i(X,[u,c,h,f,m],function(e,t,n,i,r){function o(){var e;try{e=navigator.plugins["Shockwave Flash"],e=e.description}catch(t){try{e=new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")}catch(n){e="0.0"}}return e=e.match(/\d+/g),parseFloat(e[0]+"."+e[1])}function a(e){var i=n.get(e);i&&"OBJECT"==i.nodeName&&("IE"===t.browser?(i.style.display="none",function r(){4==i.readyState?s(e):setTimeout(r,10)}()):i.parentNode.removeChild(i))}function s(e){var t=n.get(e);if(t){for(var i in t)"function"==typeof t[i]&&(t[i]=null);t.parentNode.removeChild(t)}}function u(s){var u=this,d;s=e.extend({swf_url:t.swf_url},s),r.call(this,s,c,{access_binary:function(e){return e&&"browser"===u.mode},access_image_binary:function(e){return e&&"browser"===u.mode},display_media:r.capTrue,do_cors:r.capTrue,drag_and_drop:!1,report_upload_progress:function(){return"client"===u.mode},resize_image:r.capTrue,return_response_headers:!1,return_response_type:function(t){return"json"===t&&window.JSON?!0:!e.arrayDiff(t,["","text","document"])||"browser"===u.mode},return_status_code:function(t){return"browser"===u.mode||!e.arrayDiff(t,[200,404])},select_file:r.capTrue,select_multiple:r.capTrue,send_binary_string:function(e){return e&&"browser"===u.mode},send_browser_cookies:function(e){return e&&"browser"===u.mode},send_custom_headers:function(e){return e&&"browser"===u.mode},send_multipart:r.capTrue,slice_blob:function(e){return e&&"browser"===u.mode},stream_upload:function(e){return e&&"browser"===u.mode},summon_file_dialog:!1,upload_filesize:function(t){return e.parseSizeStr(t)<=2097152||"client"===u.mode},use_http_method:function(t){return!e.arrayDiff(t,["GET","POST"])}},{access_binary:function(e){return e?"browser":"client"},access_image_binary:function(e){return e?"browser":"client"},report_upload_progress:function(e){return e?"browser":"client"},return_response_type:function(t){return e.arrayDiff(t,["","text","json","document"])?"browser":["client","browser"]},return_status_code:function(t){return e.arrayDiff(t,[200,404])?"browser":["client","browser"]},send_binary_string:function(e){return e?"browser":"client"},send_browser_cookies:function(e){return e?"browser":"client"},send_custom_headers:function(e){return e?"browser":"client"},stream_upload:function(e){return e?"client":"browser"},upload_filesize:function(t){return e.parseSizeStr(t)>=2097152?"client":"browser"}},"client"),o()<10&&(this.mode=!1),e.extend(this,{getShim:function(){return n.get(this.uid)},shimExec:function(e,t){var n=[].slice.call(arguments,2);return u.getShim().exec(this.uid,e,t,n)},init:function(){var n,r,o;o=this.getShimContainer(),e.extend(o.style,{position:"absolute",top:"-8px",left:"-8px",width:"9px",height:"9px",overflow:"hidden"}),n='<object id="'+this.uid+'" type="application/x-shockwave-flash" data="'+s.swf_url+'" ',"IE"===t.browser&&(n+='classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '),n+='width="100%" height="100%" style="outline:0"><param name="movie" value="'+s.swf_url+'" /><param name="flashvars" value="uid='+escape(this.uid)+"&target="+t.global_event_dispatcher+'" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /></object>',"IE"===t.browser?(r=document.createElement("div"),o.appendChild(r),r.outerHTML=n,r=o=null):o.innerHTML=n,d=setTimeout(function(){u&&!u.initialized&&u.trigger("Error",new i.RuntimeError(i.RuntimeError.NOT_INIT_ERR))},5e3)},destroy:function(e){return function(){a(u.uid),e.call(u),clearTimeout(d),s=d=e=u=null}}(this.destroy)},l)}var c="flash",l={};return r.addConstructor(c,u),l}),i(V,[X,E,u],function(e,t,n){var i={init:function(e){var i=this,r=this.getRuntime();this.bind("Change",function(){var e=r.shimExec.call(i,"FileInput","getFiles");i.files=[],n.each(e,function(e){i.files.push(new t(r.uid,e))})},999),this.getRuntime().shimExec.call(this,"FileInput","init",{name:e.name,accept:e.accept,multiple:e.multiple}),this.trigger("ready")}};return e.FileInput=i}),i(W,[X,y],function(e,t){var n={slice:function(e,n,i,r){var o=this.getRuntime();return 0>n?n=Math.max(e.size+n,0):n>0&&(n=Math.min(n,e.size)),0>i?i=Math.max(e.size+i,0):i>0&&(i=Math.min(i,e.size)),e=o.shimExec.call(this,"Blob","slice",n,i,r||""),e&&(e=new t(o.uid,e)),e}};return e.Blob=n}),i(Y,[X,w],function(e,t){function n(e,n){switch(n){case"readAsText":return t.atob(e,"utf8");case"readAsBinaryString":return t.atob(e);case"readAsDataURL":return e}return null}var i={read:function(e,t){var i=this;return i.result="","readAsDataURL"===e&&(i.result="data:"+(t.type||"")+";base64,"),i.bind("Progress",function(t,r){r&&(i.result+=n(r,e))},999),i.getRuntime().shimExec.call(this,"FileReader","readAsBase64",t.uid)}};return e.FileReader=i}),i($,[X,w],function(e,t){function n(e,n){switch(n){case"readAsText":return t.atob(e,"utf8");case"readAsBinaryString":return t.atob(e);case"readAsDataURL":return e}return null}var i={read:function(e,t){var i,r=this.getRuntime();return(i=r.shimExec.call(this,"FileReaderSync","readAsBase64",t.uid))?("readAsDataURL"===e&&(i="data:"+(t.type||"")+";base64,"+i),n(i,e,t.type)):null}};return e.FileReaderSync=i}),i(J,[X,u,y,E,A,I,S],function(e,t,n,i,r,o,a){var s={send:function(e,i){function r(){e.transport=l.mode,l.shimExec.call(c,"XMLHttpRequest","send",e,i)}function s(e,t){l.shimExec.call(c,"XMLHttpRequest","appendBlob",e,t.uid),i=null,r()}function u(e,t){var n=new a;n.bind("TransportingComplete",function(){t(this.result)}),n.transport(e.getSource(),e.type,{ruid:l.uid})}var c=this,l=c.getRuntime();if(t.isEmptyObj(e.headers)||t.each(e.headers,function(e,t){l.shimExec.call(c,"XMLHttpRequest","setRequestHeader",t,e.toString())}),i instanceof o){var d;if(i.each(function(e,t){e instanceof n?d=t:l.shimExec.call(c,"XMLHttpRequest","append",t,e)}),i.hasBlob()){var h=i.getBlob();h.isDetached()?u(h,function(e){h.destroy(),s(d,e)}):s(d,h)}else i=null,r()}else i instanceof n?i.isDetached()?u(i,function(e){i.destroy(),i=e.uid,r()}):(i=i.uid,r()):r()},getResponse:function(e){var n,o,a=this.getRuntime();if(o=a.shimExec.call(this,"XMLHttpRequest","getResponseAsBlob")){if(o=new i(a.uid,o),"blob"===e)return o;try{if(n=new r,~t.inArray(e,["","text"]))return n.readAsText(o);if("json"===e&&window.JSON)return JSON.parse(n.readAsText(o))}finally{o.destroy()}}return null},abort:function(e){var t=this.getRuntime();t.shimExec.call(this,"XMLHttpRequest","abort"),this.dispatchEvent("readystatechange"),this.dispatchEvent("abort")}};return e.XMLHttpRequest=s}),i(Z,[X,y],function(e,t){var n={getAsBlob:function(e){var n=this.getRuntime(),i=n.shimExec.call(this,"Transporter","getAsBlob",e);return i?new t(n.uid,i):null}};return e.Transporter=n}),i(K,[X,u,S,y,A],function(e,t,n,i,r){var o={loadFromBlob:function(e){function t(e){r.shimExec.call(i,"Image","loadFromBlob",e.uid),i=r=null}var i=this,r=i.getRuntime();if(e.isDetached()){var o=new n;o.bind("TransportingComplete",function(){t(o.result.getSource())}),o.transport(e.getSource(),e.type,{ruid:r.uid})}else t(e.getSource())},loadFromImage:function(e){var t=this.getRuntime();return t.shimExec.call(this,"Image","loadFromImage",e.uid)},getInfo:function(){var e=this.getRuntime(),t=e.shimExec.call(this,"Image","getInfo");return!t.meta||!t.meta.thumb||t.meta.thumb.data instanceof i||(t.meta.thumb.data=new i(e.uid,t.meta.thumb.data)),t},getAsBlob:function(e,t){var n=this.getRuntime(),r=n.shimExec.call(this,"Image","getAsBlob",e,t);return r?new i(n.uid,r):null},getAsDataURL:function(){var e=this.getRuntime(),t=e.Image.getAsBlob.apply(this,arguments),n;return t?(n=new r,n.readAsDataURL(t)):null}};return e.Image=o}),i(Q,[u,c,h,f,m],function(e,t,n,i,r){function o(e){var t=!1,n=null,i,r,o,a,s,u=0;try{try{n=new ActiveXObject("AgControl.AgControl"),n.IsVersionSupported(e)&&(t=!0),n=null}catch(c){var l=navigator.plugins["Silverlight Plug-In"];if(l){for(i=l.description,"1.0.30226.2"===i&&(i="2.0.30226.2"),r=i.split(".");r.length>3;)r.pop();for(;r.length<4;)r.push(0);for(o=e.split(".");o.length>4;)o.pop();do a=parseInt(o[u],10),s=parseInt(r[u],10),u++;while(u<o.length&&a===s);s>=a&&!isNaN(a)&&(t=!0)}}}catch(d){t=!1}return t}function a(a){var c=this,l;a=e.extend({xap_url:t.xap_url},a),r.call(this,a,s,{access_binary:r.capTrue,access_image_binary:r.capTrue,display_media:r.capTrue,do_cors:r.capTrue,drag_and_drop:!1,report_upload_progress:r.capTrue,resize_image:r.capTrue,return_response_headers:function(e){return e&&"client"===c.mode},return_response_type:function(e){return"json"!==e?!0:!!window.JSON},return_status_code:function(t){return"client"===c.mode||!e.arrayDiff(t,[200,404])},select_file:r.capTrue,select_multiple:r.capTrue,send_binary_string:r.capTrue,send_browser_cookies:function(e){return e&&"browser"===c.mode},send_custom_headers:function(e){return e&&"client"===c.mode},send_multipart:r.capTrue,slice_blob:r.capTrue,stream_upload:!0,summon_file_dialog:!1,upload_filesize:r.capTrue,use_http_method:function(t){return"client"===c.mode||!e.arrayDiff(t,["GET","POST"])}},{return_response_headers:function(e){return e?"client":"browser"},return_status_code:function(t){return e.arrayDiff(t,[200,404])?"client":["client","browser"]},send_browser_cookies:function(e){return e?"browser":"client"},send_custom_headers:function(e){return e?"client":"browser"},use_http_method:function(t){return e.arrayDiff(t,["GET","POST"])?"client":["client","browser"]}}),o("2.0.31005.0")&&"Opera"!==t.browser||(this.mode=!1),e.extend(this,{getShim:function(){return n.get(this.uid).content.Moxie},shimExec:function(e,t){var n=[].slice.call(arguments,2);return c.getShim().exec(this.uid,e,t,n)},init:function(){var e;e=this.getShimContainer(),e.innerHTML='<object id="'+this.uid+'" data="data:application/x-silverlight," type="application/x-silverlight-2" width="100%" height="100%" style="outline:none;"><param name="source" value="'+a.xap_url+'"/><param name="background" value="Transparent"/><param name="windowless" value="true"/><param name="enablehtmlaccess" value="true"/><param name="initParams" value="uid='+this.uid+",target="+t.global_event_dispatcher+'"/></object>',l=setTimeout(function(){c&&!c.initialized&&c.trigger("Error",new i.RuntimeError(i.RuntimeError.NOT_INIT_ERR))},"Windows"!==t.OS?1e4:5e3)},destroy:function(e){return function(){e.call(c),clearTimeout(l),a=l=e=c=null}}(this.destroy)},u)}var s="silverlight",u={};return r.addConstructor(s,a),u}),i(ee,[Q,E,u],function(e,t,n){var i={init:function(e){function i(e){for(var t="",n=0;n<e.length;n++)t+=(""!==t?"|":"")+e[n].title+" | *."+e[n].extensions.replace(/,/g,";*.");return t}var r=this,o=this.getRuntime();this.bind("Change",function(){var e=o.shimExec.call(r,"FileInput","getFiles");r.files=[],n.each(e,function(e){r.files.push(new t(o.uid,e))})},999),this.getRuntime().shimExec.call(this,"FileInput","init",i(e.accept),e.name,e.multiple),this.trigger("ready")}};return e.FileInput=i}),i(te,[Q,u,W],function(e,t,n){return e.Blob=t.extend({},n)}),i(ne,[Q,h,N],function(e,t,n){var i={init:function(){var e=this,i=e.getRuntime(),r;return r=i.getShimContainer(),n.addEvent(r,"dragover",function(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer.dropEffect="copy"},e.uid),n.addEvent(r,"dragenter",function(e){e.preventDefault();var n=t.get(i.uid).dragEnter(e);n&&e.stopPropagation()},e.uid),n.addEvent(r,"drop",function(e){e.preventDefault();var n=t.get(i.uid).dragDrop(e);n&&e.stopPropagation()},e.uid),i.shimExec.call(this,"FileDrop","init")}};return e.FileDrop=i}),i(ie,[Q,u,Y],function(e,t,n){return e.FileReader=t.extend({},n)}),i(re,[Q,u,$],function(e,t,n){return e.FileReaderSync=t.extend({},n)}),i(oe,[Q,u,J],function(e,t,n){return e.XMLHttpRequest=t.extend({},n)}),i(ae,[Q,u,Z],function(e,t,n){return e.Transporter=t.extend({},n)}),i(se,[Q,u,y,K],function(e,t,n,i){return e.Image=t.extend({},i,{getInfo:function(){var e=this.getRuntime(),i=["tiff","exif","gps","thumb"],r={meta:{}},o=e.shimExec.call(this,"Image","getInfo");return o.meta&&(t.each(i,function(e){var t=o.meta[e],n,i,a,s;if(t&&t.keys)for(r.meta[e]={},i=0,a=t.keys.length;a>i;i++)n=t.keys[i],s=t[n],s&&(/^(\d|[1-9]\d+)$/.test(s)?s=parseInt(s,10):/^\d*\.\d+$/.test(s)&&(s=parseFloat(s)),r.meta[e][n]=s)}),!r.meta||!r.meta.thumb||r.meta.thumb.data instanceof n||(r.meta.thumb.data=new n(e.uid,r.meta.thumb.data))),r.width=parseInt(o.width,10),r.height=parseInt(o.height,10),r.size=parseInt(o.size,10),r.type=o.type,r.name=o.name,r}})}),i(ue,[u,f,m,c],function(e,t,n,i){function r(t){var r=this,s=n.capTest,u=n.capTrue;n.call(this,t,o,{access_binary:s(window.FileReader||window.File&&File.getAsDataURL),access_image_binary:!1,display_media:s(a.Image&&(i.can("create_canvas")||i.can("use_data_uri_over32kb"))),do_cors:!1,drag_and_drop:!1,filter_by_extension:s(function(){return"Chrome"===i.browser&&i.verComp(i.version,28,">=")||"IE"===i.browser&&i.verComp(i.version,10,">=")||"Safari"===i.browser&&i.verComp(i.version,7,">=")}()),resize_image:function(){return a.Image&&r.can("access_binary")&&i.can("create_canvas")},report_upload_progress:!1,return_response_headers:!1,return_response_type:function(t){return"json"===t&&window.JSON?!0:!!~e.inArray(t,["text","document",""])},return_status_code:function(t){return!e.arrayDiff(t,[200,404])},select_file:function(){return i.can("use_fileinput")},select_multiple:!1,send_binary_string:!1,send_custom_headers:!1,send_multipart:!0,slice_blob:!1,stream_upload:function(){return r.can("select_file")},summon_file_dialog:function(){return r.can("select_file")&&("Firefox"===i.browser&&i.verComp(i.version,4,">=")||"Opera"===i.browser&&i.verComp(i.version,12,">=")||"IE"===i.browser&&i.verComp(i.version,10,">=")||!!~e.inArray(i.browser,["Chrome","Safari"]))},upload_filesize:u,use_http_method:function(t){return!e.arrayDiff(t,["GET","POST"])}}),e.extend(this,{init:function(){this.trigger("Init")},destroy:function(e){return function(){e.call(r),e=r=null}}(this.destroy)}),e.extend(this.getShim(),a)}var o="html4",a={};return n.addConstructor(o,r),a}),i(ce,[ue,E,u,h,N,d,c],function(e,t,n,i,r,o,a){function s(){function e(){var o=this,l=o.getRuntime(),d,h,f,p,m,g;g=n.guid("uid_"),d=l.getShimContainer(),s&&(f=i.get(s+"_form"),f&&n.extend(f.style,{top:"100%"})),p=document.createElement("form"),p.setAttribute("id",g+"_form"),p.setAttribute("method","post"),p.setAttribute("enctype","multipart/form-data"),p.setAttribute("encoding","multipart/form-data"),n.extend(p.style,{overflow:"hidden",position:"absolute",top:0,left:0,width:"100%",height:"100%"}),m=document.createElement("input"),m.setAttribute("id",g),m.setAttribute("type","file"),m.setAttribute("name",c.name||"Filedata"),m.setAttribute("accept",u.join(",")),n.extend(m.style,{fontSize:"999px",opacity:0}),p.appendChild(m),d.appendChild(p),n.extend(m.style,{position:"absolute",top:0,left:0,width:"100%",height:"100%"}),"IE"===a.browser&&a.verComp(a.version,10,"<")&&n.extend(m.style,{filter:"progid:DXImageTransform.Microsoft.Alpha(opacity=0)"}),m.onchange=function(){var n;if(this.value){if(this.files){if(n=this.files[0],0===n.size)return void p.parentNode.removeChild(p)}else n={name:this.value};n=new t(l.uid,n),this.onchange=function(){},e.call(o),o.files=[n],m.setAttribute("id",n.uid),p.setAttribute("id",n.uid+"_form"),o.trigger("change"),m=p=null}},l.can("summon_file_dialog")&&(h=i.get(c.browse_button),r.removeEvent(h,"click",o.uid),r.addEvent(h,"click",function(e){m&&!m.disabled&&m.click(),e.preventDefault()},o.uid)),s=g,d=f=h=null}var s,u=[],c;n.extend(this,{init:function(t){var n=this,a=n.getRuntime(),s;c=t,u=t.accept.mimes||o.extList2mimes(t.accept,a.can("filter_by_extension")),s=a.getShimContainer(),function(){var e,o,u;e=i.get(t.browse_button),a.can("summon_file_dialog")&&("static"===i.getStyle(e,"position")&&(e.style.position="relative"),o=parseInt(i.getStyle(e,"z-index"),10)||1,e.style.zIndex=o,s.style.zIndex=o-1),u=a.can("summon_file_dialog")?e:s,r.addEvent(u,"mouseover",function(){n.trigger("mouseenter")},n.uid),r.addEvent(u,"mouseout",function(){n.trigger("mouseleave")},n.uid),r.addEvent(u,"mousedown",function(){n.trigger("mousedown")},n.uid),r.addEvent(i.get(t.container),"mouseup",function(){n.trigger("mouseup")},n.uid),e=null}(),e.call(this),s=null,n.trigger({type:"ready",async:!0})},disable:function(e){var t;(t=i.get(s))&&(t.disabled=!!e)},destroy:function(){var e=this.getRuntime(),t=e.getShim(),n=e.getShimContainer();r.removeAllEvents(n,this.uid),r.removeAllEvents(c&&i.get(c.container),this.uid),r.removeAllEvents(c&&i.get(c.browse_button),this.uid),n&&(n.innerHTML=""),t.removeInstance(this.uid),s=u=c=n=t=null}})}return e.FileInput=s}),i(le,[ue,F],function(e,t){return e.FileReader=t}),i(de,[ue,u,h,x,f,N,y,I],function(e,t,n,i,r,o,a,s){function u(){function e(e){var t=this,i,r,a,s,u=!1;if(l){if(i=l.id.replace(/_iframe$/,""),r=n.get(i+"_form")){for(a=r.getElementsByTagName("input"),s=a.length;s--;)switch(a[s].getAttribute("type")){case"hidden":a[s].parentNode.removeChild(a[s]);break;case"file":u=!0}a=[],u||r.parentNode.removeChild(r),r=null}setTimeout(function(){o.removeEvent(l,"load",t.uid),l.parentNode&&l.parentNode.removeChild(l);var n=t.getRuntime().getShimContainer();n.children.length||n.parentNode.removeChild(n),n=l=null,e()},1)}}var u,c,l;t.extend(this,{send:function(d,h){function f(){var n=m.getShimContainer()||document.body,r=document.createElement("div");r.innerHTML='<iframe id="'+g+'_iframe" name="'+g+'_iframe" src="javascript:&quot;&quot;" style="display:none"></iframe>',l=r.firstChild,n.appendChild(l),o.addEvent(l,"load",function(){var n;try{n=l.contentWindow.document||l.contentDocument||window.frames[l.id].document,/^4(0[0-9]|1[0-7]|2[2346])\s/.test(n.title)?u=n.title.replace(/^(\d+).*$/,"$1"):(u=200,c=t.trim(n.body.innerHTML),p.trigger({type:"progress",loaded:c.length,total:c.length}),y&&p.trigger({type:"uploadprogress",loaded:y.size||1025,total:y.size||1025}))}catch(r){if(!i.hasSameOrigin(d.url))return void e.call(p,function(){p.trigger("error")});u=404}e.call(p,function(){p.trigger("load")})},p.uid)}var p=this,m=p.getRuntime(),g,v,w,y;if(u=c=null,h instanceof s&&h.hasBlob()){if(y=h.getBlob(),g=y.uid,w=n.get(g),v=n.get(g+"_form"),!v)throw new r.DOMException(r.DOMException.NOT_FOUND_ERR)}else g=t.guid("uid_"),v=document.createElement("form"),v.setAttribute("id",g+"_form"),v.setAttribute("method",d.method),v.setAttribute("enctype","multipart/form-data"),v.setAttribute("encoding","multipart/form-data"),m.getShimContainer().appendChild(v);v.setAttribute("target",g+"_iframe"),h instanceof s&&h.each(function(e,n){if(e instanceof a)w&&w.setAttribute("name",n);else{var i=document.createElement("input");t.extend(i,{type:"hidden",name:n,value:e}),w?v.insertBefore(i,w):v.appendChild(i)}}),v.setAttribute("action",d.url),f(),v.submit(),p.trigger("loadstart")},getStatus:function(){return u},getResponse:function(e){if("json"===e&&"string"===t.typeOf(c)&&window.JSON)try{
return JSON.parse(c.replace(/^\s*<pre[^>]*>/,"").replace(/<\/pre>\s*$/,""))}catch(n){return null}return c},abort:function(){var t=this;l&&l.contentWindow&&(l.contentWindow.stop?l.contentWindow.stop():l.contentWindow.document.execCommand?l.contentWindow.document.execCommand("Stop"):l.src="about:blank"),e.call(this,function(){t.dispatchEvent("abort")})}})}return e.XMLHttpRequest=u}),i(he,[ue,j],function(e,t){return e.Image=t}),a([u,c,l,d,h,f,p,m,g,v,w,y,E,_,b,x,R,A,I,T,S,O,N])}(this);;(function(e){"use strict";var t={},n=e.moxie.core.utils.Basic.inArray;return function r(e){var i,s;for(i in e)s=typeof e[i],s==="object"&&!~n(i,["Exceptions","Env","Mime"])?r(e[i]):s==="function"&&(t[i]=e[i])}(e.moxie),t.Env=e.moxie.core.utils.Env,t.Mime=e.moxie.core.utils.Mime,t.Exceptions=e.moxie.core.Exceptions,e.mOxie=t,e.o||(e.o=t),t})(this);

(function(e,t,n){function s(e){function r(e,t,r){var i={chunks:"slice_blob",jpgresize:"send_binary_string",pngresize:"send_binary_string",progress:"report_upload_progress",multi_selection:"select_multiple",dragdrop:"drag_and_drop",drop_element:"drag_and_drop",headers:"send_custom_headers",urlstream_upload:"send_binary_string",canSendBinary:"send_binary",triggerDialog:"summon_file_dialog"};i[e]?n[i[e]]=t:r||(n[e]=t)}var t=e.required_features,n={};if(typeof t=="string")o.each(t.split(/\s*,\s*/),function(e){r(e,!0)});else if(typeof t=="object")o.each(t,function(e,t){r(t,e)});else if(t===!0){e.chunk_size>0&&(n.slice_blob=!0);if(e.resize.enabled||!e.multipart)n.send_binary_string=!0;o.each(e,function(e,t){r(t,!!e,!0)})}return n}var r=e.setTimeout,i={},o={VERSION:"2.1.9",STOPPED:1,STARTED:2,QUEUED:1,UPLOADING:2,FAILED:4,DONE:5,GENERIC_ERROR:-100,HTTP_ERROR:-200,IO_ERROR:-300,SECURITY_ERROR:-400,INIT_ERROR:-500,FILE_SIZE_ERROR:-600,FILE_EXTENSION_ERROR:-601,FILE_DUPLICATE_ERROR:-602,IMAGE_FORMAT_ERROR:-700,MEMORY_ERROR:-701,IMAGE_DIMENSIONS_ERROR:-702,mimeTypes:t.mimes,ua:t.ua,typeOf:t.typeOf,extend:t.extend,guid:t.guid,getAll:function(t){var n=[],r;o.typeOf(t)!=="array"&&(t=[t]);var i=t.length;while(i--)r=o.get(t[i]),r&&n.push(r);return n.length?n:null},get:t.get,each:t.each,getPos:t.getPos,getSize:t.getSize,xmlEncode:function(e){var t={"<":"lt",">":"gt","&":"amp",'"':"quot","'":"#39"},n=/[<>&\"\']/g;return e?(""+e).replace(n,function(e){return t[e]?"&"+t[e]+";":e}):e},toArray:t.toArray,inArray:t.inArray,addI18n:t.addI18n,translate:t.translate,isEmptyObj:t.isEmptyObj,hasClass:t.hasClass,addClass:t.addClass,removeClass:t.removeClass,getStyle:t.getStyle,addEvent:t.addEvent,removeEvent:t.removeEvent,removeAllEvents:t.removeAllEvents,cleanName:function(e){var t,n;n=[/[\300-\306]/g,"A",/[\340-\346]/g,"a",/\307/g,"C",/\347/g,"c",/[\310-\313]/g,"E",/[\350-\353]/g,"e",/[\314-\317]/g,"I",/[\354-\357]/g,"i",/\321/g,"N",/\361/g,"n",/[\322-\330]/g,"O",/[\362-\370]/g,"o",/[\331-\334]/g,"U",/[\371-\374]/g,"u"];for(t=0;t<n.length;t+=2)e=e.replace(n[t],n[t+1]);return e=e.replace(/\s+/g,"_"),e=e.replace(/[^a-z0-9_\-\.]+/gi,""),e},buildUrl:function(e,t){var n="";return o.each(t,function(e,t){n+=(n?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(e)}),n&&(e+=(e.indexOf("?")>0?"&":"?")+n),e},formatSize:function(e){function t(e,t){return Math.round(e*Math.pow(10,t))/Math.pow(10,t)}if(e===n||/\D/.test(e))return o.translate("N/A");var r=Math.pow(1024,4);return e>r?t(e/r,1)+" "+o.translate("tb"):e>(r/=1024)?t(e/r,1)+" "+o.translate("gb"):e>(r/=1024)?t(e/r,1)+" "+o.translate("mb"):e>1024?Math.round(e/1024)+" "+o.translate("kb"):e+" "+o.translate("b")},parseSize:t.parseSizeStr,predictRuntime:function(e,n){var r,i;return r=new o.Uploader(e),i=t.Runtime.thatCan(r.getOption().required_features,n||e.runtimes),r.destroy(),i},addFileFilter:function(e,t){i[e]=t}};o.addFileFilter("mime_types",function(e,t,n){e.length&&!e.regexp.test(t.name)?(this.trigger("Error",{code:o.FILE_EXTENSION_ERROR,message:o.translate("File extension error."),file:t}),n(!1)):n(!0)}),o.addFileFilter("max_file_size",function(e,t,n){var r;e=o.parseSize(e),t.size!==r&&e&&t.size>e?(this.trigger("Error",{code:o.FILE_SIZE_ERROR,message:o.translate("File size error."),file:t}),n(!1)):n(!0)}),o.addFileFilter("prevent_duplicates",function(e,t,n){if(e){var r=this.files.length;while(r--)if(t.name===this.files[r].name&&t.size===this.files[r].size){this.trigger("Error",{code:o.FILE_DUPLICATE_ERROR,message:o.translate("Duplicate file error."),file:t}),n(!1);return}}n(!0)}),o.Uploader=function(e){function g(){var e,t=0,n;if(this.state==o.STARTED){for(n=0;n<f.length;n++)!e&&f[n].status==o.QUEUED?(e=f[n],this.trigger("BeforeUpload",e)&&(e.status=o.UPLOADING,this.trigger("UploadFile",e))):t++;t==f.length&&(this.state!==o.STOPPED&&(this.state=o.STOPPED,this.trigger("StateChanged")),this.trigger("UploadComplete",f))}}function y(e){e.percent=e.size>0?Math.ceil(e.loaded/e.size*100):100,b()}function b(){var e,t;d.reset();for(e=0;e<f.length;e++)t=f[e],t.size!==n?(d.size+=t.origSize,d.loaded+=t.loaded*t.origSize/t.size):d.size=n,t.status==o.DONE?d.uploaded++:t.status==o.FAILED?d.failed++:d.queued++;d.size===n?d.percent=f.length>0?Math.ceil(d.uploaded/f.length*100):0:(d.bytesPerSec=Math.ceil(d.loaded/((+(new Date)-p||1)/1e3)),d.percent=d.size>0?Math.ceil(d.loaded/d.size*100):0)}function w(){var e=c[0]||h[0];return e?e.getRuntime().uid:!1}function E(e,n){if(e.ruid){var r=t.Runtime.getInfo(e.ruid);if(r)return r.can(n)}return!1}function S(){this.bind("FilesAdded FilesRemoved",function(e){e.trigger("QueueChanged"),e.refresh()}),this.bind("CancelUpload",O),this.bind("BeforeUpload",C),this.bind("UploadFile",k),this.bind("UploadProgress",L),this.bind("StateChanged",A),this.bind("QueueChanged",b),this.bind("Error",_),this.bind("FileUploaded",M),this.bind("Destroy",D)}function x(e,n){var r=this,i=0,s=[],u={runtime_order:e.runtimes,required_caps:e.required_features,preferred_caps:l,swf_url:e.flash_swf_url,xap_url:e.silverlight_xap_url};o.each(e.runtimes.split(/\s*,\s*/),function(t){e[t]&&(u[t]=e[t])}),e.browse_button&&o.each(e.browse_button,function(n){s.push(function(s){var a=new t.FileInput(o.extend({},u,{accept:e.filters.mime_types,name:e.file_data_name,multiple:e.multi_selection,container:e.container,browse_button:n}));a.onready=function(){var e=t.Runtime.getInfo(this.ruid);t.extend(r.features,{chunks:e.can("slice_blob"),multipart:e.can("send_multipart"),multi_selection:e.can("select_multiple")}),i++,c.push(this),s()},a.onchange=function(){r.addFile(this.files)},a.bind("mouseenter mouseleave mousedown mouseup",function(r){v||(e.browse_button_hover&&("mouseenter"===r.type?t.addClass(n,e.browse_button_hover):"mouseleave"===r.type&&t.removeClass(n,e.browse_button_hover)),e.browse_button_active&&("mousedown"===r.type?t.addClass(n,e.browse_button_active):"mouseup"===r.type&&t.removeClass(n,e.browse_button_active)))}),a.bind("mousedown",function(){r.trigger("Browse")}),a.bind("error runtimeerror",function(){a=null,s()}),a.init()})}),e.drop_element&&o.each(e.drop_element,function(e){s.push(function(n){var s=new t.FileDrop(o.extend({},u,{drop_zone:e}));s.onready=function(){var e=t.Runtime.getInfo(this.ruid);t.extend(r.features,{chunks:e.can("slice_blob"),multipart:e.can("send_multipart"),dragdrop:e.can("drag_and_drop")}),i++,h.push(this),n()},s.ondrop=function(){r.addFile(this.files)},s.bind("error runtimeerror",function(){s=null,n()}),s.init()})}),t.inSeries(s,function(){typeof n=="function"&&n(i)})}function T(e,r,i){var s=new t.Image;try{s.onload=function(){if(r.width>this.width&&r.height>this.height&&r.quality===n&&r.preserve_headers&&!r.crop)return this.destroy(),i(e);s.downsize(r.width,r.height,r.crop,r.preserve_headers)},s.onresize=function(){i(this.getAsBlob(e.type,r.quality)),this.destroy()},s.onerror=function(){i(e)},s.load(e)}catch(o){i(e)}}function N(e,n,r){function f(e,t,n){var r=a[e];switch(e){case"max_file_size":e==="max_file_size"&&(a.max_file_size=a.filters.max_file_size=t);break;case"chunk_size":if(t=o.parseSize(t))a[e]=t,a.send_file_name=!0;break;case"multipart":a[e]=t,t||(a.send_file_name=!0);break;case"unique_names":a[e]=t,t&&(a.send_file_name=!0);break;case"filters":o.typeOf(t)==="array"&&(t={mime_types:t}),n?o.extend(a.filters,t):a.filters=t,t.mime_types&&(a.filters.mime_types.regexp=function(e){var t=[];return o.each(e,function(e){o.each(e.extensions.split(/,/),function(e){/^\s*\*\s*$/.test(e)?t.push("\\.*"):t.push("\\."+e.replace(new RegExp("["+"/^$.*+?|()[]{}\\".replace(/./g,"\\$&")+"]","g"),"\\$&"))})}),new RegExp("("+t.join("|")+")$","i")}(a.filters.mime_types));break;case"resize":n?o.extend(a.resize,t,{enabled:!0}):a.resize=t;break;case"prevent_duplicates":a.prevent_duplicates=a.filters.prevent_duplicates=!!t;break;case"container":case"browse_button":case"drop_element":t="container"===e?o.get(t):o.getAll(t);case"runtimes":case"multi_selection":case"flash_swf_url":case"silverlight_xap_url":a[e]=t,n||(u=!0);break;default:a[e]=t}n||i.trigger("OptionChanged",e,t,r)}var i=this,u=!1;typeof e=="object"?o.each(e,function(e,t){f(t,e,r)}):f(e,n,r),r?(a.required_features=s(o.extend({},a)),l=s(o.extend({},a,{required_features:!0}))):u&&(i.trigger("Destroy"),x.call(i,a,function(e){e?(i.runtime=t.Runtime.getInfo(w()).type,i.trigger("Init",{runtime:i.runtime}),i.trigger("PostInit")):i.trigger("Error",{code:o.INIT_ERROR,message:o.translate("Init error.")})}))}function C(e,t){if(e.settings.unique_names){var n=t.name.match(/\.([^.]+)$/),r="part";n&&(r=n[1]),t.target_name=t.id+"."+r}}function k(e,n){function h(){u-->0?r(p,1e3):(n.loaded=f,e.trigger("Error",{code:o.HTTP_ERROR,message:o.translate("HTTP Error."),file:n,response:m.responseText,status:m.status,responseHeaders:m.getAllResponseHeaders()}))}function p(){var d,v,g={},y;if(n.status!==o.UPLOADING||e.state===o.STOPPED)return;e.settings.send_file_name&&(g.name=n.target_name||n.name),s&&a.chunks&&c.size>s?(y=Math.min(s,c.size-f),d=c.slice(f,f+y)):(y=c.size,d=c),s&&a.chunks&&(e.settings.send_chunk_number?(g.chunk=Math.ceil(f/s),g.chunks=Math.ceil(c.size/s)):(g.offset=f,g.total=c.size)),m=new t.XMLHttpRequest,m.upload&&(m.upload.onprogress=function(t){n.loaded=Math.min(n.size,f+t.loaded),e.trigger("UploadProgress",n)}),m.onload=function(){if(m.status>=400){h();return}u=e.settings.max_retries,y<c.size?(d.destroy(),f+=y,n.loaded=Math.min(f,c.size),e.trigger("ChunkUploaded",n,{offset:n.loaded,total:c.size,response:m.responseText,status:m.status,responseHeaders:m.getAllResponseHeaders()}),t.Env.browser==="Android Browser"&&e.trigger("UploadProgress",n)):n.loaded=n.size,d=v=null,!f||f>=c.size?(n.size!=n.origSize&&(c.destroy(),c=null),e.trigger("UploadProgress",n),n.status=o.DONE,e.trigger("FileUploaded",n,{response:m.responseText,status:m.status,responseHeaders:m.getAllResponseHeaders()})):r(p,1)},m.onerror=function(){h()},m.onloadend=function(){this.destroy(),m=null},e.settings.multipart&&a.multipart?(m.open("post",i,!0),o.each(e.settings.headers,function(e,t){m.setRequestHeader(t,e)}),v=new t.FormData,o.each(o.extend(g,e.settings.multipart_params),function(e,t){v.append(t,e)}),v.append(e.settings.file_data_name,d),m.send(v,{runtime_order:e.settings.runtimes,required_caps:e.settings.required_features,preferred_caps:l,swf_url:e.settings.flash_swf_url,xap_url:e.settings.silverlight_xap_url})):(i=o.buildUrl(e.settings.url,o.extend(g,e.settings.multipart_params)),m.open("post",i,!0),m.setRequestHeader("Content-Type","application/octet-stream"),o.each(e.settings.headers,function(e,t){m.setRequestHeader(t,e)}),m.send(d,{runtime_order:e.settings.runtimes,required_caps:e.settings.required_features,preferred_caps:l,swf_url:e.settings.flash_swf_url,xap_url:e.settings.silverlight_xap_url}))}var i=e.settings.url,s=e.settings.chunk_size,u=e.settings.max_retries,a=e.features,f=0,c;n.loaded&&(f=n.loaded=s?s*Math.floor(n.loaded/s):0),c=n.getSource(),e.settings.resize.enabled&&E(c,"send_binary_string")&&!!~t.inArray(c.type,["image/jpeg","image/png"])?T.call(this,c,e.settings.resize,function(e){c=e,n.size=e.size,p()}):p()}function L(e,t){y(t)}function A(e){if(e.state==o.STARTED)p=+(new Date);else if(e.state==o.STOPPED)for(var t=e.files.length-1;t>=0;t--)e.files[t].status==o.UPLOADING&&(e.files[t].status=o.QUEUED,b())}function O(){m&&m.abort()}function M(e){b(),r(function(){g.call(e)},1)}function _(e,t){t.code===o.INIT_ERROR?e.destroy():t.code===o.HTTP_ERROR&&(t.file.status=o.FAILED,y(t.file),e.state==o.STARTED&&(e.trigger("CancelUpload"),r(function(){g.call(e)},1)))}function D(e){e.stop(),o.each(f,function(e){e.destroy()}),f=[],c.length&&(o.each(c,function(e){e.destroy()}),c=[]),h.length&&(o.each(h,function(e){e.destroy()}),h=[]),l={},v=!1,p=m=null,d.reset()}var u=o.guid(),a,f=[],l={},c=[],h=[],p,d,v=!1,m;a={runtimes:t.Runtime.order,max_retries:0,chunk_size:0,multipart:!0,multi_selection:!0,file_data_name:"file",flash_swf_url:"js/Moxie.swf",silverlight_xap_url:"js/Moxie.xap",filters:{mime_types:[],prevent_duplicates:!1,max_file_size:0},resize:{enabled:!1,preserve_headers:!0,crop:!1},send_file_name:!0,send_chunk_number:!0},N.call(this,e,null,!0),d=new o.QueueProgress,o.extend(this,{id:u,uid:u,state:o.STOPPED,features:{},runtime:null,files:f,settings:a,total:d,init:function(){var e=this,n,r,i;r=e.getOption("preinit"),typeof r=="function"?r(e):o.each(r,function(t,n){e.bind(n,t)}),S.call(e),o.each(["container","browse_button","drop_element"],function(t){if(e.getOption(t)===null)return i={code:o.INIT_ERROR,message:o.translate("'%' specified, but cannot be found.")},!1});if(i)return e.trigger("Error",i);if(!a.browse_button&&!a.drop_element)return e.trigger("Error",{code:o.INIT_ERROR,message:o.translate("You must specify either 'browse_button' or 'drop_element'.")});x.call(e,a,function(n){var r=e.getOption("init");typeof r=="function"?r(e):o.each(r,function(t,n){e.bind(n,t)}),n?(e.runtime=t.Runtime.getInfo(w()).type,e.trigger("Init",{runtime:e.runtime}),e.trigger("PostInit")):e.trigger("Error",{code:o.INIT_ERROR,message:o.translate("Init error.")})})},setOption:function(e,t){N.call(this,e,t,!this.runtime)},getOption:function(e){return e?a[e]:a},refresh:function(){c.length&&o.each(c,function(e){e.trigger("Refresh")}),this.trigger("Refresh")},start:function(){this.state!=o.STARTED&&(this.state=o.STARTED,this.trigger("StateChanged"),g.call(this))},stop:function(){this.state!=o.STOPPED&&(this.state=o.STOPPED,this.trigger("StateChanged"),this.trigger("CancelUpload"))},disableBrowse:function(){v=arguments[0]!==n?arguments[0]:!0,c.length&&o.each(c,function(e){e.disable(v)}),this.trigger("DisableBrowse",v)},getFile:function(e){var t;for(t=f.length-1;t>=0;t--)if(f[t].id===e)return f[t]},addFile:function(e,n){function c(e,n){var r=[];t.each(s.settings.filters,function(t,n){i[n]&&r.push(function(r){i[n].call(s,t,e,function(e){r(!e)})})}),t.inSeries(r,n)}function h(e){var i=t.typeOf(e);if(e instanceof t.File){if(!e.ruid&&!e.isDetached()){if(!l)return!1;e.ruid=l,e.connectRuntime(l)}h(new o.File(e))}else e instanceof t.Blob?(h(e.getSource()),e.destroy()):e instanceof o.File?(n&&(e.name=n),u.push(function(t){c(e,function(n){n||(f.push(e),a.push(e),s.trigger("FileFiltered",e)),r(t,1)})})):t.inArray(i,["file","blob"])!==-1?h(new t.File(null,e)):i==="node"&&t.typeOf(e.files)==="filelist"?t.each(e.files,h):i==="array"&&(n=null,t.each(e,h))}var s=this,u=[],a=[],l;l=w(),h(e),u.length&&t.inSeries(u,function(){a.length&&s.trigger("FilesAdded",a)})},removeFile:function(e){var t=typeof e=="string"?e:e.id;for(var n=f.length-1;n>=0;n--)if(f[n].id===t)return this.splice(n,1)[0]},splice:function(e,t){var r=f.splice(e===n?0:e,t===n?f.length:t),i=!1;return this.state==o.STARTED&&(o.each(r,function(e){if(e.status===o.UPLOADING)return i=!0,!1}),i&&this.stop()),this.trigger("FilesRemoved",r),o.each(r,function(e){e.destroy()}),i&&this.start(),r},dispatchEvent:function(e){var t,n,r;e=e.toLowerCase(),t=this.hasEventListener(e);if(t){t.sort(function(e,t){return t.priority-e.priority}),n=[].slice.call(arguments),n.shift(),n.unshift(this);for(var i=0;i<t.length;i++)if(t[i].fn.apply(t[i].scope,n)===!1)return!1}return!0},bind:function(e,t,n,r){o.Uploader.prototype.bind.call(this,e,t,r,n)},destroy:function(){this.trigger("Destroy"),a=d=null,this.unbindAll()}})},o.Uploader.prototype=t.EventTarget.instance,o.File=function(){function n(n){o.extend(this,{id:o.guid(),name:n.name||n.fileName,type:n.type||"",size:n.size||n.fileSize,origSize:n.size||n.fileSize,loaded:0,percent:0,status:o.QUEUED,lastModifiedDate:n.lastModifiedDate||(new Date).toLocaleString(),getNative:function(){var e=this.getSource().getSource();return t.inArray(t.typeOf(e),["blob","file"])!==-1?e:null},getSource:function(){return e[this.id]?e[this.id]:null},destroy:function(){var t=this.getSource();t&&(t.destroy(),delete e[this.id])}}),e[this.id]=n}var e={};return n}(),o.QueueProgress=function(){var e=this;e.size=0,e.loaded=0,e.uploaded=0,e.failed=0,e.queued=0,e.percent=0,e.bytesPerSec=0,e.reset=function(){e.size=e.loaded=e.uploaded=e.failed=e.queued=e.percent=e.bytesPerSec=0}},e.plupload=o})(window,mOxie);
 /*! qiniu-js v1.0.16-beta | Copyright 2015 by Qiniu */
!function(global){function createCookie(a,b,c){var d=new Date;d.setTime(d.getTime()+24*c*60*60*1e3);var e="; expires="+d.toGMTString();document.cookie=a+"="+b+e+"; path=/"}function readCookie(a){var b=a+"=";var c=document.cookie.split(";");for(var d=0,e=c.length;e>d;d++){var f=c[d];while(" "===f.charAt(0))f=f.substring(1,f.length);if(0===f.indexOf(b))return f.substring(b.length,f.length)}return null}window.localStorage||(window.localStorage={setItem:function(a,b){createCookie(a,b,30)},getItem:function(a){return readCookie(a)},removeItem:function(a){createCookie(a,"",-1)}});function QiniuJsSDK(){var that=this;this.detectIEVersion=function(){var a=4,b=document.createElement("div"),c=b.getElementsByTagName("i");while(b.innerHTML="<!--[if gt IE "+a+"]><i></i><![endif]-->",c[0])a++;return a>4?a:!1};var logger={MUTE:0,FATA:1,ERROR:2,WARN:3,INFO:4,DEBUG:5,TRACE:6,level:0};function log(a,b){var c="[qiniu-js-sdk]["+a+"]";var d=c;for(var e=0;e<b.length;e++)d+="string"==typeof b[e]?" "+b[e]:" "+that.stringifyJSON(b[e]);that.detectIEVersion()?console.log(d):(b.unshift(c),console.log.apply(console,b)),document.getElementById("qiniu-js-sdk-log")&&(document.getElementById("qiniu-js-sdk-log").innerHTML+="<p>"+d+"</p>")}function makeLogFunc(a){var b=a.toLowerCase();logger[b]=function(){if(window.console&&window.console.log&&logger.level>=logger[a]){var c=Array.prototype.slice.call(arguments);log(b,c)}}}for(var property in logger)logger.hasOwnProperty(property)&&"number"==typeof logger[property]&&!logger.hasOwnProperty(property.toLowerCase())&&makeLogFunc(property);var qiniuUploadUrl;qiniuUploadUrl="https:"===window.location.protocol?"https://up.qbox.me":"http://upload.qiniu.com";var qiniuUploadUrls=["http://upload.qiniu.com","http://up.qiniu.com"];var changeUrlTimes=0;this.resetUploadUrl=function(){if("https:"===window.location.protocol)qiniuUploadUrl="https://up.qbox.me";else{var a=changeUrlTimes%qiniuUploadUrls.length;qiniuUploadUrl=qiniuUploadUrls[a],changeUrlTimes++}logger.debug("resetUploadUrl: "+qiniuUploadUrl)},this.resetUploadUrl(),this.isImage=function(a){return a=a.split(/[?#]/)[0],/\.(png|jpg|jpeg|gif|bmp)$/i.test(a)},this.getFileExtension=function(a){var b=a.split(".");var c;return c=1===b.length||""===b[0]&&2===b.length?"":b.pop().toLowerCase()},this.utf8_encode=function(a){if(null===a||"undefined"==typeof a)return"";var b=a+"";var c="",d,e,f=0;d=e=0,f=b.length;for(var g=0;f>g;g++){var h=b.charCodeAt(g);var i=null;if(128>h)e++;else if(h>127&&2048>h)i=String.fromCharCode(h>>6|192,63&h|128);else if(63488&h^!0)i=String.fromCharCode(h>>12|224,h>>6&63|128,63&h|128);else{if(64512&h^!0)throw new RangeError("Unmatched trail surrogate at "+g);var j=b.charCodeAt(++g);if(64512&j^!0)throw new RangeError("Unmatched lead surrogate at "+(g-1));h=((1023&h)<<10)+(1023&j)+65536,i=String.fromCharCode(h>>18|240,h>>12&63|128,h>>6&63|128,63&h|128)}null!==i&&(e>d&&(c+=b.slice(d,e)),c+=i,d=e=g+1)}return e>d&&(c+=b.slice(d,f)),c},this.base64_encode=function(a){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var c,d,e,f,g,h,i,j,k=0,l=0,m="",n=[];if(!a)return a;a=this.utf8_encode(a+"");do c=a.charCodeAt(k++),d=a.charCodeAt(k++),e=a.charCodeAt(k++),j=c<<16|d<<8|e,f=j>>18&63,g=j>>12&63,h=j>>6&63,i=63&j,n[l++]=b.charAt(f)+b.charAt(g)+b.charAt(h)+b.charAt(i);while(k<a.length);switch(m=n.join(""),a.length%3){case 1:m=m.slice(0,-2)+"==";break;case 2:m=m.slice(0,-1)+"="}return m},this.URLSafeBase64Encode=function(a){return a=this.base64_encode(a),a.replace(/\//g,"_").replace(/\+/g,"-")},this.createAjax=function(a){var b={};return b=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP")},this.parseJSON=function(data){if(window.JSON&&window.JSON.parse)return window.JSON.parse(data);var rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;var text=String(data);return rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})),eval("("+text+")")},this.stringifyJSON=function(a){if(window.JSON&&window.JSON.stringify)return window.JSON.stringify(a);switch(typeof a){case"string":return'"'+a.replace(/(["\\])/g,"\\$1")+'"';case"array":return"["+a.map(that.stringifyJSON).join(",")+"]";case"object":if(a instanceof Array){var b=[];var c=a.length;for(var d=0;c>d;d++)b.push(that.stringifyJSON(a[d]));return"["+b.join(",")+"]"}if(null===a)return"null";var e=[];for(var f in a)a.hasOwnProperty(f)&&e.push(that.stringifyJSON(f)+":"+that.stringifyJSON(a[f]));return"{"+e.join(",")+"}";case"number":return a;case!1:return a;case"boolean":return a}},this.trim=function(a){return null===a?"":a.replace(/^\s+|\s+$/g,"")},this.uploader=function(a){var b=function(){var b=that.detectIEVersion();var c,d,e;var f="Safari"===mOxie.Env.browser&&mOxie.Env.version<=5&&"Windows"===mOxie.Env.os&&"7"===mOxie.Env.osVersion||"Safari"===mOxie.Env.browser&&"iOS"===mOxie.Env.os&&"7"===mOxie.Env.osVersion;b&&9>b&&a.chunk_size&&a.runtimes.indexOf("flash")>=0?a.chunk_size=0:f?a.chunk_size=0:(c=20,d=4<<c,e=plupload.parseSize(a.chunk_size),e>d&&(a.chunk_size=d))};var c=function(b){if(a.uptoken)return void(that.token=a.uptoken);{if(!a.uptoken_url)return a.uptoken_func?(logger.debug("get uptoken from uptoken_func"),that.token=a.uptoken_func(b),void logger.debug("get new uptoken: ",that.token)):void logger.error("one of [uptoken, uptoken_url, uptoken_func] settings in options is required!");logger.debug("get uptoken from: ",that.uptoken_url);var c=that.createAjax();if(c.open("GET",that.uptoken_url,!1),c.setRequestHeader("If-Modified-Since","0"),c.send(),200===c.status){var d=that.parseJSON(c.responseText);that.token=d.uptoken,logger.debug("get new uptoken: ",d.uptoken)}else logger.error("get uptoken error: ",c.responseText)}};var d=function(b,c,d){var e="",f=!1;if(!a.save_key)if(f=b.getOption&&b.getOption("unique_names"),f=f||b.settings&&b.settings.unique_names){var g=that.getFileExtension(c.name);e=g?c.id+"."+g:c.id}else e="function"==typeof d?d(b,c):c.name;return e};if(a.log_level&&(logger.level=a.log_level),!a.domain)throw"domain setting in options is required!";if(!a.browse_button)throw"browse_button setting in options is required!";if(!a.uptoken&&!a.uptoken_url&&!a.uptoken_func)throw"one of [uptoken, uptoken_url, uptoken_func] settings in options is required!";logger.debug("init uploader start"),logger.debug("environment: ",mOxie.Env),logger.debug("userAgent: ",navigator.userAgent);var e={};var f=a.init&&a.init.Error;var g=a.init&&a.init.FileUploaded;a.init.Error=function(){},a.init.FileUploaded=function(){},that.uptoken_url=a.uptoken_url,that.token="",that.key_handler="function"==typeof a.init.Key?a.init.Key:"",this.domain=a.domain;var h="";var i={isResumeUpload:!1,resumeFilesize:0,startTime:"",currentTime:""};b(),logger.debug("invoke reset_chunk_size()"),logger.debug("op.chunk_size: ",a.chunk_size),plupload.extend(e,a,{url:qiniuUploadUrl,multipart_params:{token:""}}),logger.debug("option: ",e);var j=new plupload.Uploader(e);logger.debug("new plupload.Uploader(option)"),j.bind("Init",function(b,d){logger.debug("Init event activated"),a.get_new_uptoken||c(null)}),logger.debug("bind Init event"),j.bind("FilesAdded",function(a,b){logger.debug("FilesAdded event activated");var c=a.getOption&&a.getOption("auto_start");c=c||a.settings&&a.settings.auto_start,logger.debug("auto_start: ",c),logger.debug("files: ",b);var d=function(){return"ios"===mOxie.Env.OS.toLowerCase()?!0:!1};if(d())for(var e=0;e<b.length;e++){var f=b[e];var g=that.getFileExtension(f.name);f.name=f.id+"."+g}c&&setTimeout(function(){a.start(),logger.debug("invoke up.start()")},0),a.refresh()}),logger.debug("bind FilesAdded event"),j.bind("BeforeUpload",function(b,e){logger.debug("BeforeUpload event activated"),e.speed=e.speed||0,h="",a.get_new_uptoken&&c(e);var f=function(b,c,e){i.startTime=(new Date).getTime();var f;f=a.save_key?{token:that.token}:{key:d(b,c,e),token:that.token},logger.debug("directUpload multipart_params_obj: ",f);var h=a.x_vars;if(void 0!==h&&"object"==typeof h)for(var j in h)h.hasOwnProperty(j)&&("function"==typeof h[j]?f["x:"+j]=h[j](b,c):"object"!=typeof h[j]&&(f["x:"+j]=h[j]));b.setOption({url:qiniuUploadUrl,multipart:!0,chunk_size:g()?a.max_file_size:void 0,multipart_params:f})};var g=function(){var a=navigator.userAgent.toLowerCase();return(a.match(/MicroMessenger/i)||"QQBrowser"===mOxie.Env.browser||a.match(/V1_AND_SQ/i))&&"android"===mOxie.Env.OS.toLowerCase()?!0:!1};var k=b.getOption&&b.getOption("chunk_size");if(k=k||b.settings&&b.settings.chunk_size,logger.debug("uploader.runtime: ",j.runtime),logger.debug("chunk_size: ",k),"html5"!==j.runtime&&"flash"!==j.runtime||!k)logger.debug("directUpload because uploader.runtime !== 'html5' || uploader.runtime !== 'flash' || !chunk_size"),f(b,e,that.key_handler);else if(e.size<k||g())logger.debug("directUpload because file.size < chunk_size || is_android_weixin_or_qq()"),f(b,e,that.key_handler);else{var l=localStorage.getItem(e.name);var m=k;if(l){l=that.parseJSON(l);var n=(new Date).getTime();var o=l.time||0;var p=864e5;p>n-o&&100!==l.percent&&e.size===l.total?(e.percent=l.percent,e.loaded=l.offset,h=l.ctx,i.isResumeUpload=!0,i.resumeFilesize=l.offset,l.offset+m>e.size&&(m=e.size-l.offset)):localStorage.removeItem(e.name)}i.startTime=(new Date).getTime(),b.setOption({url:qiniuUploadUrl+"/mkblk/"+m,multipart:!1,chunk_size:k,required_features:"chunks",headers:{Authorization:"UpToken "+that.token},multipart_params:{}})}}),logger.debug("bind BeforeUpload event"),j.bind("UploadProgress",function(a,b){logger.trace("UploadProgress event activated"),i.currentTime=(new Date).getTime();var c=i.currentTime-i.startTime;var d=b.loaded||0;i.isResumeUpload&&(d=b.loaded-i.resumeFilesize),b.speed=(d/c*1e3).toFixed(0)||0}),logger.debug("bind UploadProgress event"),j.bind("ChunkUploaded",function(a,b,c){logger.debug("ChunkUploaded event activated"),logger.debug("file: ",b),logger.debug("info: ",c);var d=that.parseJSON(c.response);logger.debug("res: ",d),h=h?h+","+d.ctx:d.ctx;var e=c.total-c.offset;var f=a.getOption&&a.getOption("chunk_size");f=f||a.settings&&a.settings.chunk_size,f>e&&(a.setOption({url:qiniuUploadUrl+"/mkblk/"+e}),logger.debug("up.setOption url: ",qiniuUploadUrl+"/mkblk/"+e)),localStorage.setItem(b.name,that.stringifyJSON({ctx:h,percent:b.percent,total:c.total,offset:c.offset,time:(new Date).getTime()}))}),logger.debug("bind ChunkUploaded event");var k=qiniuUploadUrls.length;var l=function(a){return k-->0?(setTimeout(function(){that.resetUploadUrl(),a.status=plupload.QUEUED,j.stop(),j.start()},0),!0):(k=qiniuUploadUrls.length,!1)};return j.bind("Error",function(a){return function(b,c){logger.error("Error event activated"),logger.error("err: ",c);var d="";var e=c.file;if(e){switch(c.code){case plupload.FAILED:d="\u4e0a\u4f20\u5931\u8d25\u3002\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002";break;case plupload.FILE_SIZE_ERROR:var f=b.getOption&&b.getOption("max_file_size");f=f||b.settings&&b.settings.max_file_size,d="\u6d4f\u89c8\u5668\u6700\u5927\u53ef\u4e0a\u4f20"+f+"\u3002\u66f4\u5927\u6587\u4ef6\u8bf7\u4f7f\u7528\u547d\u4ee4\u884c\u5de5\u5177\u3002";break;case plupload.FILE_EXTENSION_ERROR:d="\u6587\u4ef6\u9a8c\u8bc1\u5931\u8d25\u3002\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002";break;case plupload.HTTP_ERROR:if(""===c.response){if(d=c.message||"\u672a\u77e5\u7f51\u7edc\u9519\u8bef\u3002",!l(e))return;break}var g=that.parseJSON(c.response);var h=g.error;switch(c.status){case 400:d="\u8bf7\u6c42\u62a5\u6587\u683c\u5f0f\u9519\u8bef\u3002";break;case 401:d="\u5ba2\u6237\u7aef\u8ba4\u8bc1\u6388\u6743\u5931\u8d25\u3002\u8bf7\u91cd\u8bd5\u6216\u63d0\u4ea4\u53cd\u9988\u3002";break;case 405:d="\u5ba2\u6237\u7aef\u8bf7\u6c42\u9519\u8bef\u3002\u8bf7\u91cd\u8bd5\u6216\u63d0\u4ea4\u53cd\u9988\u3002";break;case 579:d="\u8d44\u6e90\u4e0a\u4f20\u6210\u529f\uff0c\u4f46\u56de\u8c03\u5931\u8d25\u3002";break;case 599:if(d="\u7f51\u7edc\u8fde\u63a5\u5f02\u5e38\u3002\u8bf7\u91cd\u8bd5\u6216\u63d0\u4ea4\u53cd\u9988\u3002",!l(e))return;break;case 614:d="\u6587\u4ef6\u5df2\u5b58\u5728\u3002";try{g=that.parseJSON(g.error),h=g.error||"file exists"}catch(i){h=g.error||"file exists"}break;case 631:d="\u6307\u5b9a\u7a7a\u95f4\u4e0d\u5b58\u5728\u3002";break;case 701:d="\u4e0a\u4f20\u6570\u636e\u5757\u6821\u9a8c\u51fa\u9519\u3002\u8bf7\u91cd\u8bd5\u6216\u63d0\u4ea4\u53cd\u9988\u3002";break;default:if(d="\u672a\u77e5\u9519\u8bef\u3002",!l(e))return}d=d+"("+c.status+"\uff1a"+h+")";break;case plupload.SECURITY_ERROR:d="\u5b89\u5168\u914d\u7f6e\u9519\u8bef\u3002\u8bf7\u8054\u7cfb\u7f51\u7ad9\u7ba1\u7406\u5458\u3002";break;case plupload.GENERIC_ERROR:d="\u4e0a\u4f20\u5931\u8d25\u3002\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002";break;case plupload.IO_ERROR:d="\u4e0a\u4f20\u5931\u8d25\u3002\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002";break;case plupload.INIT_ERROR:d="\u7f51\u7ad9\u914d\u7f6e\u9519\u8bef\u3002\u8bf7\u8054\u7cfb\u7f51\u7ad9\u7ba1\u7406\u5458\u3002",j.destroy();break;default:if(d=c.message+c.details,!l(e))return}a&&a(b,c,d)}b.refresh()}}(f)),logger.debug("bind Error event"),j.bind("FileUploaded",function(b){return function(c,e,f){logger.debug("FileUploaded event activated"),logger.debug("file: ",e),logger.debug("info: ",f);var g=function(c,d,e){if(a.downtoken_url){var f=that.createAjax();f.open("POST",a.downtoken_url,!0),f.setRequestHeader("Content-type","application/x-www-form-urlencoded"),f.onreadystatechange=function(){if(4===f.readyState)if(200===f.status){var a;try{a=that.parseJSON(f.responseText)}catch(g){throw"invalid json format"}var h={};plupload.extend(h,that.parseJSON(e),a),b&&b(c,d,that.stringifyJSON(h))}else j.trigger("Error",{status:f.status,response:f.responseText,file:d,code:plupload.HTTP_ERROR})},f.send("key="+that.parseJSON(e).key+"&domain="+a.domain)}else b&&b(c,d,e)};var i=that.parseJSON(f.response);if(h=h?h:i.ctx,logger.debug("ctx: ",h),h){var k="";logger.debug("save_key: ",a.save_key),a.save_key||(k=d(c,e,that.key_handler),k=k?"/key/"+that.URLSafeBase64Encode(k):"");var l="/fname/"+that.URLSafeBase64Encode(e.name);logger.debug("op.x_vars: ",a.x_vars);var m=a.x_vars,n="",o="";if(void 0!==m&&"object"==typeof m)for(var p in m)m.hasOwnProperty(p)&&("function"==typeof m[p]?n=that.URLSafeBase64Encode(m[p](c,e)):"object"!=typeof m[p]&&(n=that.URLSafeBase64Encode(m[p])),o+="/x:"+p+"/"+n);var q=qiniuUploadUrl+"/mkfile/"+e.size+k+l+o;var r=that.detectIEVersion();var s;r&&9>=r?(s=new mOxie.XMLHttpRequest,mOxie.Env.swf_url=a.flash_swf_url):s=that.createAjax(),s.open("POST",q,!0),s.setRequestHeader("Content-Type","text/plain;charset=UTF-8"),s.setRequestHeader("Authorization","UpToken "+that.token);var t=function(){if(logger.debug("ajax.readyState: ",s.readyState),4===s.readyState){localStorage.removeItem(e.name);var a;200===s.status?(a=s.responseText,logger.debug("mkfile is success: ",a),g(c,e,a)):(a={status:s.status,response:s.responseText,file:e,code:-200},logger.debug("mkfile is error: ",a),j.trigger("Error",a))}};r&&9>=r?s.bind("readystatechange",t):s.onreadystatechange=t,s.send(h),logger.debug("mkfile: ",q)}else g(c,e,f.response)}}(g)),logger.debug("bind FileUploaded event"),j.init(),logger.debug("invoke uploader.init()"),logger.debug("init uploader end"),j},this.getUrl=function(a){if(!a)return!1;a=encodeURI(a);var b=this.domain;return"/"!==b.slice(b.length-1)&&(b+="/"),b+a},this.imageView2=function(a,b){var c=a.mode||"",d=a.w||"",e=a.h||"",f=a.q||"",g=a.format||"";if(!c)return!1;if(!d&&!e)return!1;var h="imageView2/"+c;return h+=d?"/w/"+d:"",h+=e?"/h/"+e:"",h+=f?"/q/"+f:"",h+=g?"/format/"+g:"",b&&(h=this.getUrl(b)+"?"+h),h},this.imageMogr2=function(a,b){var c=a["auto-orient"]||"",d=a.thumbnail||"",e=a.strip||"",f=a.gravity||"",g=a.crop||"",h=a.quality||"",i=a.rotate||"",j=a.format||"",k=a.blur||"";var l="imageMogr2";return l+=c?"/auto-orient":"",l+=d?"/thumbnail/"+d:"",l+=e?"/strip":"",l+=f?"/gravity/"+f:"",l+=h?"/quality/"+h:"",l+=g?"/crop/"+g:"",l+=i?"/rotate/"+i:"",l+=j?"/format/"+j:"",l+=k?"/blur/"+k:"",b&&(l=this.getUrl(b)+"?"+l),l},this.watermark=function(a,b){var c=a.mode;if(!c)return!1;var d="watermark/"+c;if(1===c){var e=a.image||"";if(!e)return!1;d+=e?"/image/"+this.URLSafeBase64Encode(e):""}else{if(2!==c)return!1;var f=a.text?a.text:"",g=a.font?a.font:"",h=a.fontsize?a.fontsize:"",i=a.fill?a.fill:"";if(!f)return!1;d+=f?"/text/"+this.URLSafeBase64Encode(f):"",d+=g?"/font/"+this.URLSafeBase64Encode(g):"",d+=h?"/fontsize/"+h:"",d+=i?"/fill/"+this.URLSafeBase64Encode(i):""}var j=a.dissolve||"",k=a.gravity||"",l=a.dx||"",m=a.dy||"";return d+=j?"/dissolve/"+j:"",d+=k?"/gravity/"+k:"",d+=l?"/dx/"+l:"",d+=m?"/dy/"+m:"",b&&(d=this.getUrl(b)+"?"+d),d},this.imageInfo=function(a){if(!a)return!1;var b=this.getUrl(a)+"?imageInfo";var c=this.createAjax();var d;var e=this;return c.open("GET",b,!1),c.onreadystatechange=function(){4===c.readyState&&200===c.status&&(d=e.parseJSON(c.responseText))},c.send(),d},this.exif=function(a){if(!a)return!1;var b=this.getUrl(a)+"?exif";var c=this.createAjax();var d;var e=this;return c.open("GET",b,!1),c.onreadystatechange=function(){4===c.readyState&&200===c.status&&(d=e.parseJSON(c.responseText))},c.send(),d},this.get=function(a,b){return b&&a?"exif"===a?this.exif(b):"imageInfo"===a?this.imageInfo(b):!1:!1},this.pipeline=function(a,b){var c="[object Array]"===Object.prototype.toString.call(a);var d,e,f="";if(c){for(var g=0,h=a.length;h>g;g++){if(d=a[g],!d.fop)return!1;switch(d.fop){case"watermark":f+=this.watermark(d)+"|";break;case"imageView2":f+=this.imageView2(d)+"|";break;case"imageMogr2":f+=this.imageMogr2(d)+"|";break;default:e=!0}if(e)return!1}if(b){f=this.getUrl(b)+"?"+f;var i=f.length;"|"===f.slice(i-1)&&(f=f.slice(0,i-1))}return f}return!1}}var Qiniu=new QiniuJsSDK;global.Qiniu=Qiniu,global.QiniuJsSDK=QiniuJsSDK}(window);
//# sourceMappingURL=dist/qiniu.min.map  