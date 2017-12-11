var urlPost = document.location.origin; 
var createUrl = urlPost +'/wordoor_uaas_api/v1/sessions/create';
var validateUserUrl = urlPost +'/wordoor_uaas_api/v1/organization/validateUser';
var H5_editor_login_url = 'http://192.168.1.82:9080/';

var myapp = angular.module('login',[]);
myapp.controller('wordoorLogin',['$scope',function($scope){
	$scope.phone_login = Language.phone_login; 
	$scope.mobile_login = Language.mobile_login;
	$scope.enter_phone = Language.enter_phone;
	$scope.enter_mobile = Language.enter_mobile;
	$scope.forget_password = Language.forget_password;
	$scope.enter_password = Language.enter_password;
	$scope.sing_in = Language.sing_in;
	$scope.system_copyright = Language.system_copyright;
	$scope.arrCountries = [{"id":"86","country":Language.China},{"id":"886","country":Language.Taiwan},{"id":"670","country":Language.DEMOCRATIC_REPUBLIC_OF_TIMORLESTE},{"id":"236","country":Language.Central_African_Republic},{"id":"45","country":Language.Denmark},{"id":"380","country":Language.Ukraine},{"id":"998","country":Language.Uzbekistan},{"id":"256","country":Language.Uganda},{"id":"598","country":Language.Uruguay},{"id":"235","country":Language.Chad},{"id":"967","country":Language.Yemen},{"id":"374","country":Language.Armenia},{"id":"972","country":Language.Israel},{"id":"964","country":Language.Iraq},{"id":"98","country":Language.Iran},{"id":"501","country":Language.Belize},{"id":"238","country":Language.Cape_Verde},{"id":"7","country":Language.Russia},{"id":"359","country":Language.Bulgaria},{"id":"385","country":Language.Croatia},{"id":"1671","country":Language.Guam},{"id":"220","country":Language.The_Gambia},{"id":"354","country":Language.Iceland},{"id":"224","country":Language.Guinea},{"id":"245","country":Language.Guinea_Bissau},{"id":"423","country":Language.Liechtenstein},{"id":"242","country":Language.The_Republic_of_Congo },{"id":"243","country":Language.Democratic_Republic_of_the_Congo},{"id":"218","country":Language.Libya},{"id":"231","country":Language.Liberia},{"id":"1","country":Language.Canada},{"id":"233","country":Language.Ghana},{"id":"241","country":Language.Gabon},{"id":"36","country":Language.Hungary},{"id":"27","country":Language.South_Africa},{"id":"267","country":Language.Botswana},{"id":"974","country":Language.Qatar },{"id":"250","country":Language.Rwanda},{"id":"352","country":Language.Luxembourg},{"id":"62","country":Language.Indonesia},{"id":"91,918,919","country":Language.India},{"id":"502","country":Language.Guatemala},{"id":"593","country":Language.Ecuador},{"id":"291","country":Language.Eritrea},{"id":"963","country":Language.Syria},{"id":"53","country":Language.Cuba},{"id":"996","country":Language.Kyrgyzstan},{"id":"253","country":Language.Djibouti},{"id":"57","country":Language.Colombia},{"id":"506","country":Language.Costa_Rica},{"id":"237","country":Language.Cameroon},{"id":"688","country":Language.Tuvalu},{"id":"993","country":Language.Turkmenistan },{"id":"90","country":Language.Turkey},{"id":"1758","country":Language.Saint_Lucia},{"id":"1869","country":Language.Saint_Kitts_and_Nevis},{"id":"239","country":Language.Sao_Tome_and_Principe},{"id":"1784","country":Language.Saint_Vincent_and_the_Grenadines},{"id":"508","country":Language.Saint_Pierre_and_Miquelon},{"id":"290","country":Language.Saint_Helena},{"id":"378","country":Language.San_Marino},{"id":"592","country":Language.Guyana},{"id":"255","country":Language.Tanzania},{"id":"20","country":Language.Egypt},{"id":"251","country":Language.Ethiopia},{"id":"686","country":Language.Kiribati},{"id":"992","country":Language.Tajikistan},{"id":"221","country":Language.Senegal},{"id":"381","country":Language.Serbia_and_Montenegro},{"id":"232","country":Language.Sierra_Leone},{"id":"357","country":Language.Cyprus},{"id":"248","country":Language.Seychelles},{"id":"52","country":Language.Mexico},{"id":"228","country":Language.Togo},{"id":"1767","country":Language.Dominica},{"id":"43","country":Language.Austria},{"id":"58","country":Language.Venezuela},{"id":"880","country":Language.Bangladesh},{"id":"244","country":Language.Angola},{"id":"1264","country":Language.Anguilla},{"id":"376","country":Language.Andorra},{"id":"691","country":Language.Federated_States_of_Micronesia},{"id":"505","country":Language.Nicaragua},{"id":"234","country":Language.Nigeria},{"id":"227","country":Language.Niger},{"id":"977","country":Language.Nepal  },{"id":"970","country":Language.Palestine},{"id":"1242","country":Language.The_Bahamas},{"id":"92","country":Language.Pakistan},{"id":"1246","country":Language.Barbados},{"id":"675","country":Language.Papua_New_Guinea},{"id":"595","country":Language.Paraguay},{"id":"507","country":Language.Panama},{"id":"973","country":Language.Bahrain},{"id":"55","country":Language.Brazil},{"id":"226","country":Language.Burkina_Faso},{"id":"257","country":Language.Burundi},{"id":"30","country":Language.Greece},{"id":"680","country":Language.Palau},{"id":"682","country":Language.Cook_Islands},{"id":"1345","country":Language.Cayman_Islands},{"id":"49","country":Language.Germany},{"id":"39","country":Language.Italy},{"id":"677","country":Language.Solomon_Islands},{"id":"690","country":Language.Tokelau},{"id":"371","country":Language.Latvia},{"id":"47","country":Language.Norway},{"id":"420","country":Language.Czech_Republic},{"id":"373","country":Language.Moldova},{"id":"212","country":Language.Morocco},{"id":"377","country":Language.Monaco},{"id":"673","country":Language.Brunei_Darussalam},{"id":"679","country":Language.Fiji},{"id":"268","country":Language.The_Kingdom_of_Swaziland},{"id":"421","country":Language.Slovakia},{"id":"386","country":Language.Slovenia},{"id":"94","country":Language.Sri_Lanka},{"id":"65","country":Language.Singapore },{"id":"687","country":Language.New_Caledonia},{"id":"64","country":Language.New_Zealand},{"id":"81","country":Language.Japan},{"id":"56","country":Language.Chile},{"id":"850","country":Language.Korea_North},{"id":"855","country":Language.Cambodia},{"id":"1473","country":Language.Grenada},{"id":"299","country":Language.Greenland},{"id":"995","country":Language.Georgia},{"id":"32","country":Language.Belgium},{"id":"222","country":Language.Mauritania},{"id":"230","country":Language.Mauritius},{"id":"676","country":Language.Tonga},{"id":"966","country":Language.Saudi_Arabia},{"id":"33","country":Language.France},{"id":"594","country":Language.French_Guiana},{"id":"689","country":Language.French_Polynesia},{"id":"596","country":Language.french_west_indies},{"id":"298","country":Language.Faroe_Islands},{"id":"48","country":Language.Poland},{"id":"17,871,939","country":Language.The_Commonwealth_of_Puerto_Rico},{"id":"387","country":Language.Bosnia_and_Herzegovina },{"id":"66","country":Language.Thailand},{"id":"263","country":Language.Zimbabwe},{"id":"504","country":Language.Honduras},{"id":"509","country":Language.Haiti},{"id":"61","country":Language.Australia},{"id":"853","country":Language.Macao},{"id":"353","country":Language.Ireland},{"id":"372","country":Language.Estonia},{"id":"1876","country":Language.Jamaica},{"id":"1649","country":Language.Turks_and_Caicos_Islands},{"id":"1868","country":Language.Trinidad_and_Tobago},{"id":"591","country":Language.Bolivia},{"id":"674","country":Language.Nauru},{"id":"46","country":Language.Sweden},{"id":"41","country":Language.Switzerland},{"id":"590","country":Language.Guadeloupe},{"id":"681","country":Language.Wallis_et_Futuna},{"id":"678","country":Language.Vanuatu},{"id":"262","country":Language.Reunion},{"id":"375","country":Language.Belarus},{"id":"1441","country":Language.Bermuda},{"id":"350","country":Language.Gibraltar},{"id":"500","country":Language.Falkland},{"id":"965","country":Language.Kuwait},{"id":"269","country":Language.Comoros},{"id":"225","country":Language.Cote_d_Ivoire},{"id":"51","country":Language.Peru},{"id":"216","country":Language.Tunisia},{"id":"370","country":Language.Lithuania},{"id":"252","country":Language.Somalia},{"id":"962","country":Language.Jordan},{"id":"264","country":Language.Namibia},{"id":"683","country":Language.Island_of_Niue},{"id":"95","country":Language.Burma},{"id":"40","country":Language.Romania},{"id":"1","country":Language.United_States_of_America},{"id":"1340","country":Language.Virgin_Islands},{"id":"1684","country":Language.American_Samoa},{"id":"856","country":Language.Laos},{"id":"254","country":Language.Kenya},{"id":"358","country":Language.Finland},{"id":"249","country":Language.Sudan},{"id":"597","country":Language.Suriname},{"id":"44","country":Language.United_Kingdom},{"id":"1284","country":Language.British_Virgin_Islands},{"id":"31","country":Language.Netherlands},{"id":"599","country":Language.Netherlands_Antilles},{"id":"258","country":Language.Mozambique},{"id":"266","country":Language.Lesotho},{"id":"63","country":Language.Philippines},{"id":"503","country":Language.El_Salvador},{"id":"685","country":Language.Samoa},{"id":"351","country":Language.Portugal},{"id":"976","country":Language.Mongolia},{"id":"34","country":Language.Spain},{"id":"229","country":Language.Benin},{"id":"260","country":Language.Zambia},{"id":"240","country":Language.Equatorial_Guinea},{"id":"84","country":Language.Vietnam},{"id":"994","country":Language.Azerbaijan},{"id":"93","country":Language.Afghanistan},{"id":"213","country":Language.Algeria},{"id":"355","country":Language.Albania},{"id":"971","country":Language.United_Arab_Emirates},{"id":"968","country":Language.Oman},{"id":"54","country":Language.Argentina},{"id":"297","country":Language.Aruba},{"id":"82","country":Language.Korea_South},{"id":"852","country":Language.Hong_Kong_SAR},{"id":"389","country":Language.Macedonia},{"id":"960","country":Language.Maldives},{"id":"265","country":Language.Malawi},{"id":"60","country":Language.Malaysia},{"id":"692","country":Language.Marshall_Islands},{"id":"356","country":Language.Malta},{"id":"261","country":Language.Madagascar},{"id":"223","country":Language.Mali},{"id":"961","country":Language.Lebanon},{"id":"382","country":Language.The_Republic_of_Montenegro}];
}]) 

$('.emailLogin').on('click',function(){
	$(this).addClass('CheckMark');
	$('.mobileLogin').removeClass('CheckMark');
	$('.emailLoginInp').css({display:'block'});
	$('.mobileLoginInp').css({display:'none'});
	keyDown(emailPostFunc);
})
$('.mobileLogin').on('click',function(){
	$(this).addClass('CheckMark');
	$('.emailLogin').removeClass('CheckMark');
	$('.mobileLoginInp').css({display:'block'});
	$('.emailLoginInp').css({display:'none'});
	keyDown(mobilePostFunc);
})
keyDown(emailPostFunc);
showUserMobile();
showUserEmail();
$('.loginButEmail').on('click',function(){
	H5_login_in_email(); 
})
$('.loginButMobile').on('click',function(){
	H5_login_in_mobile();
})
function H5_login_in_email(){
	var email = $('.userNameEmail').val();
	var emailPass = $('.userPasswordEmail').val();
	if(!(/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(email))){
		$('.errorEmail').html(Language.E_mail_is_incorrect);
		return 
	}else if(emailPass == ''){
		$('.errorEmail').html(''); 
		$('.errorPasswordEmail').html(Language.Password_cannot_be_empty);
		return
	}else{
		$('.errorEmail').html('');
		$.ajax({
			url:H5_editor_login_url+'/api/user/login',  
			type:'post', 
			data:{
				emailOrPhone:email,
				password:emailPass
			},
			success:function(data){
				 localStorage.setItem('wordoor_access_token', data.data);
				 emailPostFunc(email,emailPass);
			} 
		})  
	}
}
function emailPostFunc(email,emailPass){
	$.ajax({
			url:createUrl, 
			type:'post', 
			data:{
				acc:email,
				pwd:emailPass
			},
			success:function(data, textStatus,xhr){
				if(data.code == 200){
					var token = xhr.getResponseHeader('A-Token-Header');
					var userId = data.result.acct.id;
					var avatar = data.result.acct.avatar;
					var userName = data.result.acct.name;
					saveUserEmail(email,emailPass); 
					$.ajax({
						url:validateUserUrl,
						data:{
							user:userId
						}, 
						type:'post',
						beforeSend:function(request){
							 request.setRequestHeader("A-Token-Header", token);
						},
						success:function(dataUser){
							if(dataUser.code == 200){ 
								var dataSave = {userId:userId,userName:userName,avatar:avatar,token:token,orgId:dataUser.result.orgId,language:dataUser.result.language,roleId:dataUser.result.roleId}
								localStorage.setItem('userInformation',JSON.stringify(dataSave));
								if(dataUser.result.roleId == 1){
									window.location.href = './indexSystem.html';
								}else if(dataUser.result.roleId == 2){
									window.location.href = './indexEdit.html';
								}else if(dataUser.result.roleId == 3){
									window.location.href = './indexVerify.html';
								}
							}else {
								$('.errorPasswordEmail').html(dataUser.codemsg);
							}
						}
					}) 
					 
				}else{
					$('.errorPasswordEmail').html(data.codemsg);
				} 
			}
		})
 }
function H5_login_in_mobile(){
	var mobile = $('.userNameMobile').val();
	var mobilePass = $('.userPasswordMobile').val();
	var cc = $('.mobileLoginInp select').val();  
	if(!(/^(1[34578]\d{9})|((([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?)$/.test(mobile))){  
		$('.errorMobile').html(Language.Phone_number_is_incorrect);
		return   
	}else if(mobilePass == ''){  
		$('.errorMobile').html(''); 
		$('.errorPassword').html(Language.Password_cannot_be_empty);
		return
	}else{
		$('.errorMobile').html('');  
		$.ajax({
			url:H5_editor_login_url+'/api/user/login',  
			type:'post', 
			data:{
				emailOrPhone:mobile,
				password:mobilePass
			},
			success:function(data){
				 localStorage.setItem('wordoor_access_token', data.data);
				 mobilePostFunc(mobile,mobilePass,cc);
			} 
		})   
	} 
}
function mobilePostFunc(mobile,mobilePass,cc){
	$.ajax({ 
			url:createUrl,  
			type:'post', 
			data:{ 
				cc:cc,  
				acc:mobile,
				pwd:mobilePass
			},
			success:function(data, textStatus,xhr){
				if(data.code == 200){
					var token = xhr.getResponseHeader('A-Token-Header');
					var userId = data.result.acct.id;
					var avatar = data.result.acct.avatar;
					var userName = data.result.acct.name;
					saveUserMobile(mobile,mobilePass);
					$.ajax({
						url:validateUserUrl,
						data:{
							user:userId
						},
						type:'post',
						beforeSend:function(request){
							 request.setRequestHeader("A-Token-Header", token);
						},
						success:function(dataUser){
							if(dataUser.code == 200){
								var dataSave = {userId:userId,userName:userName,avatar:avatar,token:token,orgId:dataUser.result.orgId,language:dataUser.result.language,roleId:dataUser.result.roleId}
								localStorage.setItem('userInformation',JSON.stringify(dataSave));
								if(dataUser.result.roleId == 1){
									window.location.href = './indexSystem.html';
								}else if(dataUser.result.roleId == 2){
									window.location.href = './indexEdit.html';
								}else if(dataUser.result.roleId == 3){
									window.location.href = './indexVerify.html';
								}
							}else {
								$('.errorPassword').html(dataUser.codemsg);
							}
						}  
					})   
					  
				}else {
					$('.errorPassword').html(data.codemsg);
				}
			}
		})
}
function showUserEmail(){
	var acchtml = '';
	var mobileLocalStorageContent = localStorage.getItem('userEmail');
	if(mobileLocalStorageContent){
		mobileLocalStorageContent = JSON.parse(mobileLocalStorageContent);
		$('.userNameEmail').val(mobileLocalStorageContent[0].acc);
		$('.userPasswordEmail').val(mobileLocalStorageContent[0].pwd);
		mobileLocalStorageContent.forEach(function(item,index){
				acchtml += '<li pwd="'+item.pwd+'">'+item.acc +'</li>';
		})
		$('.showUserEmail').html(acchtml);
		$('.userNameEmail').on('click',function(e){
			$('.showUserEmail').show();
			e.stopPropagation();
		})
		$('.userPasswordEmail').on('click',function(e){
			$('.showUserEmailPwd').show();
			e.stopPropagation();
		})
		$('.showUserEmail li').hover(function(){
			$(this).css({color:'#fff',backgroundColor:'rgba(9, 192, 206, 0.9)'})
		},function(){
			$(this).css({color:'#cdcdcd',backgroundColor:'#f9f9f9'})
		}).on('click',function(){
			$('.userNameEmail').val($(this).html());
			$('.userPasswordEmail').val($(this).attr('pwd'));
			$('.showUserEmail').hide();
		})
		
		$(document).on('click',function(){
			$('.showUserEmail').hide();
			$('.showUserEmailPwd').hide();
		})
	}
}
function showUserMobile(){
	var acchtml = '';
	var mobileLocalStorageContent = localStorage.getItem('userMobile');
	if(mobileLocalStorageContent){
		mobileLocalStorageContent = JSON.parse(mobileLocalStorageContent);
		$('.userNameMobile').val(mobileLocalStorageContent[0].acc);
		$('.userPasswordMobile').val(mobileLocalStorageContent[0].pwd);
		mobileLocalStorageContent.forEach(function(item,index){
				acchtml += '<li pwd="'+item.pwd+'">'+item.acc +'</li>';
		})
		$('.showUserMobile').html(acchtml);
		$('.userNameMobile').on('click',function(e){
			$('.showUserMobile').show();
			e.stopPropagation();
		})
		$('.userPasswordMobile').on('click',function(e){
			$('.showUserMobilePwd').show();
			e.stopPropagation();
		})
		$('.showUserMobile li').hover(function(){
			$(this).css({color:'#fff',backgroundColor:'rgba(9, 192, 206, 0.9)'})
		},function(){
			$(this).css({color:'#cdcdcd',backgroundColor:'#f9f9f9'})
		}).on('click',function(){
			$('.userNameMobile').val($(this).html());
			$('.userPasswordMobile').val($(this).attr('pwd'));
			$('.showUserMobile').hide();
		})
		
		$(document).on('click',function(){
			$('.showUserMobile').hide();
			$('.showUserMobilePwd').hide();
		})
	}
}


function saveUserEmail(email,emailPass){
	var isIn = false;
	var arr = [{
				acc:email,
				pwd:emailPass
			}]
	var secondObj = {
				acc:email,
				pwd:emailPass
			}
	var old = localStorage.getItem('userEmail');
	if(!old){
		var arrFirst = JSON.stringify(arr);
		localStorage.setItem('userEmail',arrFirst);
	}else{
		old = JSON.parse(old);
		old.forEach(function(item,index){
			if(item.acc == email){
				isIn = true;
				return false
			}
		})
		if(!isIn){
			old.unshift(secondObj);
			old = JSON.stringify(old);
			localStorage.setItem('userEmail',old);
		}
		
	}
	
	
}
function saveUserMobile(mobile,mobilePass){
	var isIn = false;
	var arr = [{
				acc:mobile,
				pwd:mobilePass
			}]
	var secondObj = {
				acc:mobile,
				pwd:mobilePass
			}
	var old = localStorage.getItem('userMobile');
	if(old == undefined){
		var arrFirst = JSON.stringify(arr);
		localStorage.setItem('userMobile',arrFirst);
	}else{
		old = JSON.parse(old);
		old.forEach(function(item,index){
			if(item.acc == mobile){
				isIn = true;
				return false
			}
		})
		if(!isIn){
			old.unshift(secondObj);
			old = JSON.stringify(old);
			localStorage.setItem('userMobile',old);
		}
		
	}
	
	
}

function keyDown(fn){ 
	document.onkeydown = function(event){
		var keycode = 0;
		 	//IE浏览器
		 if(CheckBrowserIsIE()){
		 	 keycode = event.keyCode;
		 }else{
		 	//火狐浏览器
		 	keycode = event.which;
		 }
		 if (keycode == 13 ) //回车键是13
		 {
		  fn();
		 }
	}
	 
}

function CheckBrowserIsIE(){
	 var result = false;
	 var browser = navigator.appName;
	 if(browser == "Microsoft Internet Explorer"){
	  	result = true;
	 }
	 return result;
}
