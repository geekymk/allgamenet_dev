//최초 호출시
//메뉴 action
// selectMenu('home');
var nov = {};
nov.server = 'https://cmk.iptime.org';
nov.mainOpen = function() {
	$('#main').show();
};
nov.mainClose = function() {
	$('#main').hide();
};
nov.popupOpen = function() {
	nov.mainClose();
	$('#video-popup').show();
};
nov.popupClose = function() {
	nov.mainOpen();
	$('#video-popup').hide();
};
var postbtn = document.getElementById('postbtn');
postbtn.addEventListener('click', nov.popupOpen, false);	
var closebtn = document.getElementById('add-video-close-btn');
closebtn.addEventListener('click', nov.popupClose, false);
ajaxCall(nov.server + '/video?idx=0&limit=5&ca=ABCD', '', function(data){
	var html = '';
	var con = JSON.parse(data);
	var list = con.list;
	for(var i=0; i<con.size; i++) {
		html += '<div class="screamwrap-row">';
		html += '<div class="screamwrap-row-title">'+list[i].id+'</div>';
		html += '<div class="screamwrap-row-content">'+list[i].writer_nm+'</div>';
		html += '</div>';
	}
	$('#view_board').html(html);
});
function ajaxCall(){
	var req = null;
	var args = this.ajaxCall.arguments;
	if(window.XMLHttpRequest) {
		req = new XMLHttpRequest();		
	} else if (window.ActiveXObject) {
		req = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(req) {
		req.open('GET', args[0], true);		// request open
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		req.send(args[1]);
		req.onreadystatechange =  function() {	
			if(req.readyState == 4) {					
				if(req.status == 200) {
					args[2](req.responseText, args[3], args[4]);
				}
			}
		};
		
	} else {
		alert("request 실패");
	}	
}
/*
$('.menubar-btn').on('click', function(){
	removeAllSelectMenu();
	$(this).find('.menubar-btn-text,.menubar-btn-icon-svg').addClass('select');
	var menu = this.dataset.menu;
	getMenu(menu);
	//앞단만 존재함
	// history.pushState(null, null, menu);
});
*/
function selectMenu(menu) {
	hidePopup();
	removeAllSelectMenu();
	$('#'+menu+'-svg,#'+menu+'-text').addClass('select');
	getMenu(menu);
}
function removeAllSelectMenu() {
	$('.menubar-btn-text,.menubar-btn-icon-svg').removeClass('select');
}
//숏컷 action
/*
$('.shortcutbar-shortcut-btn').on('click',function(){
	ajax('/'+this.dataset.menu, function(data){
		innerHTML(data, 'popup-content')
		showPopup();
	});
});
*/
//팝업
function showPopup() {
	$('#popup').show('slide',{direction:'down'});
}
function hidePopup() {
	$('#popup').hide('slide',{direction:'down'});
}
$('#popup-close-btn').on('click',hidePopup);
function allMenuHide() {
	$('.menuwrap').hide();
}
function getMenu(menu) {
	allMenuHide();
	if('home' == menu) {
		getDataOfHome(menu, showData);
	}else if('hot' == menu) {
		$('#'+menu).show('fade', 'fast');
	}else if('subscribe' == menu) {
		ajax('/subscribe/list', function(data){
			innerHTML(data, 'subscribe')
			$('#'+menu).show('fade', 'fast');
		});
	}else if('setting' == menu) {
		ajax('/setting/list', function(data){
			innerHTML(data, 'setting')
			$('#'+menu).show('fade', 'fast');
		});
	}
	
}
function getDataOfHome(menu, callback) {
	var data = '<div>데이터</div>';
	innerHTML(data, 'home')
	callback(menu);
}
function showData(menu) {
	$('#'+menu).show('fade', 'fast');
}
function innerHTML(data, divName){
	$("#"+divName+"").empty();
	$("#"+divName+"").html(data).trigger("create");
}
/*
checkCurrentPathName(window.location.pathname);
function checkCurrentPathName(pathName) {
	if('/home' == pathName || '/' == pathName) {
		selectMenu('home');
	}else if('/hot' == pathName) {
		selectMenu('hot');
	}else if('/subscribe' == pathName) {
		selectMenu('subscribe');
	}else if('/setting' == pathName) {
		selectMenu('setting');
	}
}
//history back(pushstate를통한)
$(window).bind('popstate', function (event) {
	checkCurrentPathName(window.location.pathname)
});
//main 스크롤
var storeScrollHeight = 0;
var isWindowScrollDown = false;
$(window).on('scroll', function(e){
	var maxScrollHeight = document.body.scrollHeight - $(this).height();
	var currentScrollHeight = $(this).scrollTop();
	if(storeScrollHeight < currentScrollHeight) {
		isWindowScrollDown = true;
	}else{
		isWindowScrollDown = false;
	}
	if(isWindowScrollDown) {
		if(50 >= currentScrollHeight) {
			$('.searchbar').css('top', '-'+currentScrollHeight+'px');
		}else{
			$('.searchbar').removeAttr('style').hide();
		}
	}else{
		if(50 >= currentScrollHeight) {
			$('.searchbar').show();
		}else if(20 < Math.abs(currentScrollHeight - storeScrollHeight)) {
			$('.searchbar').show();
		}
	}
	storeScrollHeight = currentScrollHeight;
});

function allMenuHide() {
	$('.menuwrap').hide();
}
function getMenu(menu) {
	allMenuHide();
	if('home' == menu) {
		$('#'+menu).show('fade', 'fast');
	}else if('hot' == menu) {
		$('#'+menu).show('fade', 'fast');
	}else if('subscribe' == menu) {
		ajax('/subscribe/list', function(data){
			innerHTML(data, 'subscribe')
			$('#'+menu).show('fade', 'fast');
		});
	}else if('setting' == menu) {
		ajax('/setting/list', function(data){
			innerHTML(data, 'setting')
			$('#'+menu).show('fade', 'fast');
		});
	}
	
}

//ajax
function ajax(){
	var req = null;
	var args = this.ajax.arguments;
	if(window.XMLHttpRequest) {
		req = new XMLHttpRequest();
	}else if(window.ActiveXObject) {
		req = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(req) {
		req.open('GET', args[0], true);
		req.setRequestHeader("type","ajax");
		req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
		req.send();
		req.onreadystatechange = function() {	
			if(req.readyState == 4) {					
				if(req.status == 200) {
					args[1](req.responseText);
				}
			}
		};
	}else {
		console.log("[DEBUG]XHR 생성 실패");
	}	
}
function forward(action) {
	location.href = '/'+action;
}
*/
