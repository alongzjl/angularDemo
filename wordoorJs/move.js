/*保存所有的拖拽元素*/
var courseSortList = ''; 
// 存一个坐标数组
var pos = []; 
var indexArr = [];
function courseDragSort(id){ 
	 shade();
	 var html = '<div id="seriesCourseSort">';
	 $.ajax({
	 	url:seriesDetailsUrl,
	 	data:{ 
	 		seriesId:id
	 	},    
	 	type:'post',
	 	success:function(data){
	 		if(data.code == 200){
	 			data.result.resources.forEach(function(item,index){
	 				html += '<div class="oneCourseSort" sort='+item.sort+' courseId='+item.detail.id+'><div style="background:url('+item.detail.cover+') no-repeat top left;background-size:100% 100%;"></div><p>'+item.detail.title+'</p></div> '
	 			})     
	 			html += '<div style="clear:both;"></div></div><div class="dialogDelete-buts" id="seriesCourseSortBtn">	'+				
				    	'<span class="pop_btns pop-btnsDeep pop_btns-small pop_circle pop_delete">确定</span>'+
				    	'<span class="pop_btns pop-btnsShallow pop_btns-small pop_circle pop_cancel">取消</span></div>';
				$(html).appendTo($('.worDoorShade'));  

				$('#seriesCourseSortBtn').delegate('.pop_cancel','click',function(){
					$('.worDoorShade').remove();   
				})  
				$('#seriesCourseSortBtn').delegate('.pop-btnsDeep','click',function(){
					var arrPost = [];
					var domArr = $('#seriesCourseSort .oneCourseSort');
					domArr.each(function(index,item){
						var newObj = {};
						newObj.materialId = $(domArr[$(item).get(0).index]).attr('courseId');
						//newObj.sort = $(domArr[$(item).get(0).index]).attr('sort');
						newObj.sort = parseInt(index+1); 
						arrPost.push(newObj);    
					})  
					var dataPostSort = JSON.stringify(arrPost);
					$.ajax({
						url:resequencingseriesUrl,
						type:'post',  
						data:{
							materialSortContent:dataPostSort,
							seriesId:id
						},
						success:function(dataSort){
							if(dataSort.code ==200){
								$('.worDoorShade').remove();
							}    
						}
					}) 
					$('.worDoorShade').remove();    
				}) 

				var box = document.getElementById('seriesCourseSort');
				pos = [];  
				// 拿到所有的照片
				courseSortList = box.getElementsByClassName('oneCourseSort');       
				for(var i = 0; i < courseSortList.length; i++){
					var newObj = {};
					newObj.left = courseSortList[i].offsetLeft;
					newObj.top = courseSortList[i].offsetTop;
					courseSortList[i].index = i;
					pos.push(newObj);  
				}  
				$('#seriesCourseSort').css({height:$('#seriesCourseSort').height()});  
				// 布局转换，由于坐标已经在上面存了，所以两个循环合并为这一个
				for(var i = 0; i < courseSortList.length; i++){
					// 加定位     
					courseSortList[i].style.position = "absolute";
					courseSortList[i].style.left = pos[i].left + "px";
					courseSortList[i].style.top = pos[i].top + "px";
					// 去margin
					courseSortList[i].style.margin = "0";
					// 加拖拽
					setDrag(courseSortList[i]);
				}   
	 		} 
	 	}
	 })
 
} 

// 拖拽函数
var zIndex = 0;
function setDrag(dom){
	dom.onmousedown = function (e){
		var evt = e || window.event;
		var l = evt.offsetX;
		var t = evt.offsetY;
		var nearestImg = null;
		// 提升dom块的层级
		dom.style.zIndex = ++zIndex;
		document.onmousemove = function (e){
			var evt = e || window.event;
			var toLeft = evt.clientX - l;
			var toTop = evt.clientY - t;
			
			dom.style.left = toLeft + "px";
			dom.style.top = toTop + "px";
			nearestImg = findNearest(dom);
			if(nearestImg){ 
				nearestImg.style.border = "1px dashed black";
			}
		}
		document.onmouseup = function (){
			document.onmousemove = null;
			document.onmouseup = null;
			var outnearestImg = outfindNearest(dom);
			if(nearestImg){
				// 交换位置
				
				// 使用运动函数交换
				move(dom, {left: pos[nearestImg.index].left, top : pos[nearestImg.index].top});
				move(nearestImg, {left : pos[dom.index].left, top : pos[dom.index].top});
				// 交换下标
				var temp = dom.index;
				dom.index = nearestImg.index;
				nearestImg.index = temp;
				
				// 把border取消
				nearestImg.style.border = "none";
				//如果没有碰撞就与最近的交换
			} else if(outnearestImg){ 
				move(dom, {left: pos[outnearestImg.index].left, top : pos[outnearestImg.index].top});
				move(outnearestImg, {left : pos[dom.index].left, top : pos[dom.index].top});
				// 交换下标
				var temp = dom.index;
				dom.index = outnearestImg.index;
				outnearestImg.index = temp;
				
				// 用运动回到原来的位置
				//move(dom, {left : pos[dom.index].left, top : pos[dom.index].top});
			}
		}  
		return false;
	}
}

function findNearest(dom){
	var max = 99999999; 
	var index = -1; // 用来存放最近的那个块的下标
	for(var i = 0; i < courseSortList.length; i++){
		if(courseSortList[i] == dom){
			continue;
		}    
		if(detectKnock(dom, courseSortList[i])){
			var dis = calcDistance(dom, courseSortList[i]);
			if(dis < max){
				max = dis;
				index = i;
			}
		}
		courseSortList[i].style.border = "none";
	}
	
	if(index == -1){
		return null;
	} else {
		return courseSortList[index];
	}
}
function outfindNearest(dom){ 
	var max = 99999999;
	var index = -1; // 用来存放最近的那个块的下标
	for(var i = 0; i < courseSortList.length; i++){
		if(courseSortList[i] == dom){
			continue;
		}  
		if(!detectKnock(dom, courseSortList[i])){
			var dis = calcDistance(dom, courseSortList[i]);
			if(dis < max){
				max = dis;
				index = i;
			}
		}
		courseSortList[i].style.border = "none";
	}
	  
	if(index == -1){
		return null;
	} else {
		return courseSortList[index];
	}
}
function calcDistance(dom1, dom2){
	// 计算两个块中心点的位置
	var c1Left = dom1.offsetLeft + dom1.offsetWidth / 2;
	var c1Top = dom1.offsetTop + dom1.offsetHeight / 2;
	
	var c2Left = dom2.offsetLeft + dom2.offsetWidth / 2;
	var c2Top = dom2.offsetTop + dom2.offsetHeight / 2;
	
	// 利用勾股定理计算两个中心点的距离
	var a = c2Left - c1Left;
	var b = c2Top - c1Top;
	
	return Math.sqrt(a*a + b*b);
}

// 碰撞检测函数
function detectKnock(dom1, dom2){
	// dom1的四条边 
	var l1 = dom1.offsetLeft;
	var t1 = dom1.offsetTop;
	var r1 = l1 + dom1.offsetWidth;
	var b1 = t1 + dom1.offsetHeight;  
	
	// dom2的四条边
	var l2 = dom2.offsetLeft;
	var t2 = dom2.offsetTop;
	var r2 = l2 + dom2.offsetWidth;
	var b2 = t2 + dom2.offsetHeight;
	
	// 排除所有没碰上的情况
	if(l1 > r2 || t1 > b2 || r1 < l2 || b1 < t2){
		return false;
	}
	
	return true
}


function move(dom, target, fn){
	clearInterval(dom.timer);
	dom.timer = setInterval(function (){
		var isOk = true;
		for(var property in target){
			var iCur = getStyle(dom, property);
			if(property === "opacity"){
				iCur = parseInt(iCur*100);
			} else {
				iCur = parseInt(iCur);
			}
			
			if(iCur !== target[property]){
				isOk = false;
			}
			
			var speed = (target[property] - iCur)/10;
			
			speed = speed > 0? Math.ceil(speed) : Math.floor(speed);
			
			if(property === "opacity"){
				dom.style.opacity = "" + (iCur + speed)/100;
				dom.style.filter = "alpha(opacity=" + (iCur + speed) + ")";
			} else {
				dom.style[property] = iCur + speed + "px";
			}
		}  
		
		if(isOk){
			clearInterval(dom.timer);
			if(fn){
				fn();
			}
		}
	}, 10);
}

function getStyle(dom, property){
	if(dom.currentStyle){
		return dom.currentStyle[property];
	} else {
		return window.getComputedStyle(dom)[property];
	}	
}