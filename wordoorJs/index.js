var myapp = angular.module('worDoor',[]);
myapp.controller('worDoorIndex',['$scope',function($scope){
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

}])

 $(function () {
 			$('.index .chinaLanguage').on('click',function(){
 				localStorage.setItem('lang','Chinese');
 				window.location.reload();
 			})
 			$('.index .enLanguage').on('click',function(){
 				localStorage.setItem('lang','English');
 				window.location.reload();
 			})

            $('.index .languages').find('span').on('click', function () {
                $('.selectValue').html($(this).html());
                $('.index .languages').hide();

            });
            $('.index .selectLanguage').on('mousemove', function () {
                $('.index .languages').show();
            }).on('mouseout', function () {
                $('.index .languages').hide();
            });
            $('.videoPlay').on('click', function () {
                //var myVideo = $('#mvideo')[0];
                //  myVideo.play();
                //$('#mvideo').find('source').attr('autoplay','autoplay');
                var video = '<div class="videoAllWrap"><div class="videoWrap fixedCenter"><video controls="controls" loop="loop" autoplay="autoplay" width="100%"   id="mvideo"><source src="http://7xk8ky.com1.z0.glb.clouddn.com/popon_old.mp4"  type="video/mp4"></video></div><div class="videoClose"><img src="./images/index/close.png"></div></div>'

                $('<div class="zhezhao"></div>').appendTo($('body')).css({
                    'left': 0,
                    'top': 0,
                    'width': '100%',
                    'height': $(document).height(),
                    'background-color': 'rgba(0, 0, 0, 0.7)',
                    'z-index': 100,
                    'position': 'absolute'
                });
                $(video).appendTo($('body'));

                var myVideo = $('#mvideo')[0];
                // myVideo.play();
                $('.videoClose').on('click', function () {
                    $('.videoAllWrap').remove();
                    $('.zhezhao').remove();
                });


            });
            $('.mobileDesc-li').on('mouseover', function () {


                var index = $(this).index() + 1;
                var name = './images/index/firstIcon/feature' + index + '_h.png';

                $('.mobileDesc-li').each(function (i, elem) {
                    var name1 = './images/index/firstIcon/feature' + (i + 1) + '.png';
                    $(this).css('background-image', 'url(' + name1 + ')');
                });
                $('.mobliePic-bg').find('img').attr('src', './images/index/app' + index + '.png');
                $(this).css('background-image', 'url(' + name + ')');


            }).on('mouseout', function () {
                $('.mobliePic-bg').find('img').attr('src', './images/index/app' + 1 + '.png');

                var index = $(this).index() + 1;
                var name = './images/index/firstIcon/feature' + index + '.png';
                $(this).css('background-image', 'url(' + name + ')');
                $('.mobileDesc-li').eq(0).css('background-image', 'url(./images/index/firstIcon/feature1_h.png)');
            })


            if ($('html').attr('lang') == 'zh-CN') {
                $('.chinaLanguage').css({color: '#244456', 'font-weight': 'bold'});
            } else if ($('html').attr('lang') == 'en') {
                $('.enLanguage').css({color: '#244456', 'font-weight': 'bold'});
            }
            videoImg();
            function videoImg() {
                var w = 1432;
                var mixWidth = 1123;
                var disW = 300;

                if ($(window).width() < mixWidth) {
                    $('#video').css({
                        left: $(window).width() - w + disW,
                        position: 'relative'

                    });
                } else {
                    $('#video').css({
                        left: 0,
                        position: 'relative'

                    });
                }
            }

            window.addEventListener("orientationchange", function () {

                setTimeout(function () {
                    videoImg();
                }, 500);
            }, false);
            $(window).on('resize', function () {
                setTimeout(function () {
                    videoImg();
                }, 500);

            })

             var num = $('#appDisplay').find('.appDisplayLi').length;
            $('.appList').each(function () {
                $(this).find('span').on('touchend', function (ev) {
                    var index = -$(this).index() / num;
                    $('#appDisplay').css({
                        'transform': 'translateX(' + (index * 100 + '%') + ')',
                        'transition': '0.5s', '-webkit-transform': 'translateX(' + (index * 100 + '%') + ')',
                        '-webkit-transition': '0.5s',
                    });
                    return false;
                });
            });
            calculate();
            touchchange();
            function calculate() {
                var $appDisplayLi = $('#appDisplay').find('.appDisplayLi');
                $('#appDisplay').css({width: $appDisplayLi.length * 100 + '%'});
                $appDisplayLi.css({width: (1 / $appDisplayLi.length) * 100 + '%'});
            }

            function touchchange() {
                var $appDisplayLi = $('#appDisplay').find('.appDisplayLi');
                var x = 0;
                var index = 0;
                var dis = 0;
                var scale = 0;
                var y = 0;
                var w = 0;
                var turn = false;
                var disY = 0;
                var oriappDisplayLi = $('#appDisplay')[0];
                var move = 0;
                $appDisplayLi.on('touchstart', function (ev) {
                    w = document.documentElement.clientWidth;
                    oriappDisplayLi.style.WebkitTransition = "none";
                    turn = false;
                    var touchPos = ev.originalEvent.changedTouches[0];
                    x = touchPos.pageX;
                    y = touchPos.pageY;
                    index = $(this).index();

                });
                $appDisplayLi.on('touchmove', function (ev) {
                    var touchPos = ev.originalEvent.changedTouches[0];
                    dis = touchPos.pageX - x;
                    //  scale = 1-Math.abs(dis)/w;
                    scale = 1;

                    disY = touchPos.pageY - y;
                    console.log(Math.abs(disY))
                    if (Math.abs(disY) <= 2) {

                        turn = true;

                    }

                    if (turn) {

                        move = dis * scale + (-index) * w;

                        oriappDisplayLi.style.WebkitTransform = 'translate(' + move + "px" + ',0)'
                        return false;
                    }


                }).on('touchend', function (ev) {
                    if (turn) {
                        if (dis > 0) {

                            index = index - 1 >= 0 ? index - 1 : index;
                        } else {
                            index = index + 1 >= 3 ? index : index + 1;
                        }
                        var moveEnd = (-index) * w;
                        //  var end = -(index)/num*100+'%';
                        // $('#appDisplay').css({'-webkit-transform':'translate('+end+',0)', '-webkit-transition':'0.5s'});
                        oriappDisplayLi.style.WebkitTransition = "0.5s";
                        oriappDisplayLi.style.WebkitTransform = 'translate(' + moveEnd + "px" + ',0)';
                        //    debugger;
                        // $(oriappDisplayLi).velocity({translateX:[moveEnd,move]},{duration:500});
                        // $('#appDisplay').velocity({'WebkitTransform':'translate(500px,0)'},{duration:500});
                    }

                });
            }
 });

 if (typeof Float32Array !== 'function') {
            //return

        } else {
            var scene = new THREE.Scene();

            var camera = new THREE.PerspectiveCamera(75, 1.875, 0.1, 1000);
            var renderer = new THREE.WebGLRenderer();

            /*
             In addition to creating the renderer instance, we also need to set the size at which we want it to render our app.
             It's a good idea to use the width and height of the area we want to fill with our game
             - in this case, the width and height of the browser window. For performance intensive games, you can also give setSize smaller values,
             like window.innerWidth/2 and window.innerHeight/2, for half the resolution.
             This does not mean that the game will only fill half the window, but rather look a bit blurry and scaled up.

             Last but not least, we add the renderer element to our HTML document.
             This is a <canvas> element the renderer uses to display the scene to us.
             */
            var setWidth = 2124;
            var setHeight = 1087;
            renderer.setSize(setWidth, setHeight);
//document.body.appendChild(renderer.domElement);
//renderer.domElement.height = 400;

//renderer.domElement.style.transform='rotate(180deg)';

            renderer.domElement.width = setWidth;
            renderer.domElement.height = setHeight;


            var $div = $('<div id="earthWrap"></div>').append(renderer.domElement);

            $('.index').append($div);

            /* Create Lights: PointLight / SpotLight etc.*/
            /*
             var spotLight = new THREE.SpotLight(0xfffffa);
             spotLight.position.set(100, 100, 100);
             spotLight.castShadow = true; //If set to true light will cast dynamic shadows. Warning: This is expensive and requires tweaking to get shadows looking right.
             spotLight.shadowMapWidth = 1024;
             spotLight.shadowMapHeight = 1024;
             spotLight.shadowCameraNear = 500;
             spotLight.shadowCameraFar = 4000;
             spotLight.shadowCameraFov = 300;
             scene.add(spotLight);
             */
            /* Create Material */
            function Mat() {
                var material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color("#09c0ce"),  //Diffuse color of the material
                    emissive: new THREE.Color("#09c0ce"), //Emissive(light) color of the material, essentially a solid color unaffected by other lighting. Default is black.
                    specular: new THREE.Color("#09c0ce"), /*Specular color of the material, i.e., how shiny the material is and the color of its shine.
                     Setting this the same color as the diffuse value (times some intensity) makes the material more metallic-looking;
                     setting this to some gray makes the material look more plastic. Default is dark gray.*/
                    shininess: 1,                                  //How shiny the specular highlight is; a higher value gives a sharper highlight. Default is 30.
                    shading: THREE.FlatShading,                  //How the triangles of a curved surface are rendered: THREE.SmoothShading, THREE.FlatShading, THREE.NoShading
                    wireframe: 1,                                  //THREE.Math.randInt(0,1)
                    transparent: 1,
                    opacity: 0.5,                               //THREE.Math.randFloat(0,1)
                    backgroundColor: '#ffffff',

                });
                return material;
            }

            /* Create Geometry */

            var geometry = new THREE.SphereGeometry(50, 20, 20, 0, Math.PI * 2, 0, Math.PI);
//SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)

            /* Create Earth Sphere*/
            var earth = new THREE.Mesh(geometry, Mat());


            scene.add(earth);

            camera.position.z = 90;


            earth.rotation.x = 0.3;
            function render() {
                requestAnimationFrame(render);
//  earth.rotation.x += 0.01;
                earth.rotation.y += 0.01;

                renderer.render(scene, camera);
            }

            renderer.setClearColor(0xffffff, 0.5);
            render();
        }

        var arr = [
            {countryGood: "안녕하세요.", countryLanguage: '한곡어'},
            {countryGood: "こんにちは", countryLanguage: '日本語'},
            {countryGood: "Hello", countryLanguage: 'English'},
            {countryGood: "你好", countryLanguage: '汉语'},
            {countryGood: " Bonjour ", countryLanguage: ' French'},
            {countryGood: "Hola", countryLanguage: 'Spanish'}

        ]
        tip();
        setInterval(tip, 1500);
        function tip() {
            $('.prompCircle').remove();
            var left = 86 + Math.floor(Math.random() * 738);
            var top1 = 26 + Math.floor(Math.random() * 95);

            var random = Math.floor(Math.random() * arr.length);

            $('<div class="prompCircle"><p class="countryGood">' + arr[random]["countryGood"] + '</p><span class="countryLanguage">' + arr[random]["countryLanguage"] + '</span></div>').appendTo($('#earthWrap')).css({
                'left': left, 'top': top1
            });

            //	$('.prompCircle').velocity({width: [ "114px", [ 250, 10 ] ], height:["126px",[ 250, 10 ]],opacity:1});

        }



