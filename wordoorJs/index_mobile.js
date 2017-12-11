var myapp = angular.module('mobileApp',[]);
myapp.controller('index_mobile',['$scope',function($scope){
	$scope.index_home = Language.index_home;
	$scope.index_popon = Language.index_popon;
	$scope.index_story = Language.index_story;
	$scope.index_video = Language.index_video;
	$scope.login = Language.login;
	$scope.chinese = Language.chinese;
	$scope.english = Language.english;
	$scope.popon_intro_title = Language.popon_intro_title;
	$scope.popon_intro_detail = Language.popon_intro_detail;
	$scope.Download_iphone = Language.Download_iphone;
	$scope.for_ios = Language.for_ios;
	$scope.Download_android = Language.Download_android;
	$scope.for_android = Language.for_android;
	$scope.popon_app = Language.popon_app;
	$scope.popon_app_short_intro = Language.popon_app_short_intro;
	$scope.help_offer = Language.help_offer;
	$scope.help_offer_detail = Language.help_offer_detail;
	$scope.Instantly_match = Language.Instantly_match;
	$scope.Instantly_match_detail = Language.Instantly_match_detail;
	$scope.effective_content = Language.effective_content;
	$scope.effective_content_detail = Language.effective_content_detail;
	$scope.user_story_short_detail = Language.user_story_short_detail;
	$scope.popon_user_1 = Language.popon_user_1;
	$scope.popon_user_1_say = Language.popon_user_1_say;
	$scope.popon_user_2 = Language.popon_user_2;
	$scope.popon_user_2_say = Language.popon_user_2_say;
	$scope.popon_user_3 = Language.popon_user_3;
	$scope.popon_user_3_say = Language.popon_user_3_say;
	$scope.popon_user_4 = Language.popon_user_4;
	$scope.popon_user_4_say = Language.popon_user_4_say;
	$scope.popon_user_5 = Language.popon_user_5;
	$scope.popon_user_5_say = Language.popon_user_5_say;
	$scope.popon_user_6 = Language.popon_user_6;
	$scope.popon_user_6_say = Language.popon_user_6_say;
	$scope.popon_world_can_understand = Language.popon_world_can_understand;
	$scope.popon_be_a_chatpal = Language.popon_be_a_chatpal;
	$scope.popon_be_a_chatpal_detail = Language.popon_be_a_chatpal_detail;
	$scope.popon_be_a_tutor = Language.popon_be_a_tutor;
	$scope.popon_be_a_tutor_detail = Language.popon_be_a_tutor_detail;
	$scope.system_copyright = Language.system_copyright;
	$scope.chooseLanguage = function(lang){
		window.localStorage.setItem('lang',lang);
		window.location.reload();
	}
}])

