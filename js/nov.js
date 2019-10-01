var nov = {
	def: {
		url: 'https://cmk.iptime.org',
		// url: 'http://localhost',
		hdr: {
			json: 'application/json',
			form: 'application/x-www-form-urlencoded'
		}
	}
};
nov.event = {
	showAddingPopup: function() {
		$('#homeLogo,#addvideo').hide('slide' ,{direction: 'down'}, 100, function() {
			$('#backList').show('slide', 300);
		});
		$('#videoList').hide('slide', {direction: 'right'}, 250, function() {
			$('#videoAdding').show('slide', 250);
		});
	},
	goHome: function() {
		window.top.location.href = '/';
	},
	backList: function() {
		$('#backList').hide('slide' ,{direction: 'down'}, 100, function() {
			$('#homeLogo,#addvideo').show('slide', {}, 300);
		});
		$('#videoAdding').hide('slide', {direction: 'right'}, 250, function() {
			$('#videoList').show('slide', 250);
		});
	}
};
nov.popup = {
	show: function() {
		$('#popup').show(0, function() {
			$('#block-background').show('fade', 150);
		});
	},
	hide: function() {
		$('#block-background').hide('fade', function() {
			$('#popupt').hide();
		});
	},
	blockEvent: function() {
		event.stopPropagation();
	},
	actionBtn: function() {
		var type = event.srcElement.dataset.type;
		if('cls' == type) {
			nov.popup.hide();
			return;
		}
		if('reg' == type) {
			nov.video.add();
			return;
		}
	},
	changeLink: function() {
		// var url = new URL(this.value);
		// var id = url.searchParams.get('v');
		// var previewVideo = document.getElementById('preview-video-link');
		// previewVideo.src = 'https://i.ytimg.com/vi/'+id+'/mqdefault.jpg';
		// previewVideo.width = '320';
		// previewVideo.height = '180';
		var urlString = this.value;
		if(!comutil.valid(urlString)) {
			return;
		}
		if(!comutil.isURL(urlString)) {
			return;
		}
		var url = new URL(urlString);
		var id = url.searchParams.get('v');
		if(!comutil.valid(id)) {
			id = (url.pathname).replace('/','');
		}
		if(!comutil.valid(id)) {
			return;
		}
		nov.video.getInfo(id, function(data) {
			nov.video.info = data;
		});
	}
};
nov.video = {
	info: null,
	getInfo: function(id, callback) {
		var req = new XMLHttpRequest();
		var callurl = 'https://www.googleapis.com/youtube/v3/videos?';
		callurl += 'id='+id;
		callurl += '&key=AIzaSyBjOGx_HuZHAOseQdeIofk65CRpq-XmfC0';
		callurl += '&part=snippet,contentDetails,statistics,status';
		req.open('GET',callurl);
		req.send();
		req.onreadystatechange = function() {
			if(req.readyState == 4) {
				if(req.status == 200) {
					callback(JSON.parse(req.response));
				}
			}
		}
	},
	add: function() {
		var info = nov.video.info;
		if(!info) {
			alert('잘못된 링크입니다.');
			return;
		}
		var item = info.items[0];
		var id = item.id;
		var doc = document;
		var title = item.snippet.title;
		var name = doc.getElementById('video-writer-name').value;
		var pw = doc.getElementById('video-writer-pw').value;
		var req = new XMLHttpRequest();
		req.open('POST', nov.def.url+'/video');
		req.setRequestHeader("Content-Type", nov.def.hdr.form);
		req.send('title='+title+'&video-url='+id+'&writer-nm='+name+'&writer-pw='+pw);
		req.onreadystatechange = function() {
			if(req.readyState == 4) {
				console.log(req.status);
				if(req.status == 201) {
					window.top.location.href = '/';
				}
			}
		}
	},
	getList: function(idx, limit) {
		var req = new XMLHttpRequest();
		req.open('GET', nov.def.url+'/video?idx='+idx+'&limit='+limit);
		req.send();
		req.onreadystatechange = function() {
			if(req.readyState == 4 && req.status == 200) {
				var content = "";
				var data = JSON.parse(req.response);
				var size = data.length;
				for(var i=0; i<size; i++) {
					var row = data[i];
					content += '<div class="screamwrap-row" onclick="window.open(\'https://www.youtube.com/watch?v='+row.video_url+'\')">';
					content += '<img src="https://i.ytimg.com/vi/'+row.video_url+'/default.jpg" width="120" height="90"/>';
					content += '<span>'+row.title+'</span>';
					content += '</div>';
				}
				if(10 == size) {
					window.addEventListener('scroll', scrollEvent);
					$('#more-space').html('<span title="영상 더 가져오기" style="font-size: large;color: #353535;font-weight: bold;cursor: pointer;position: absolute;left: calc(50% - 30px);" onclick="test('+idx+');"></span>');
				}
				var main = document.getElementById('videoList');
				$(main).append(content);
			}
		};
	}
};
nov.video.getList(0, 10);
// document.getElementById('homeLogo').addEventListener('click', nov.event.goHome);
document.getElementById('addvideo').addEventListener('click', nov.popup.show);
document.getElementById('backList').addEventListener('click', nov.event.backList);
document.getElementById('block-background').addEventListener('click', nov.popup.hide);


document.getElementById('popup').addEventListener('click', nov.popup.blockEvent);
document.getElementById('popup-btns').addEventListener('click', nov.popup.actionBtn);
function scrollEvent() {
	var scrollpercent = (document.body.scrollTop + document.documentElement.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
	// console.log(scrollpercent);
	if(0.9 <= scrollpercent) {
		$('#more-space > span').trigger('click');
		this.event.stopPropagation();
		window.removeEventListener('scroll', scrollEvent);
	}
}
function test(tt) {
	// $("#more-space > span").text("");
	nov.video.getList((tt + 10), 10);
	
}
window.addEventListener('scroll', scrollEvent);


comutil = {
	valid: function(s) {
		if('' == s || null == s || undefined == s) {
			return false;
		}
		return true;
	},
	isURL: function(sURL) {
		var e = /^http[s]?\:\/\//i;
		return e.test(sURL);
	}
};
document.getElementById('video-link').addEventListener('change', nov.popup.changeLink);

// var url = new URL('https://www.youtube.com/watch?v=dT3vovTYjhE');
// var url = new URL('https://www.youtube.com/watch');
// console.log(url);
// console.log(url.searchParams.get('v'));
// var q = new XMLHttpRequest();
// q.open('GET', 'https://youtube.com/get_video_info?video_id=dT3vovTYjhE');
// q.setRequestHeader("Content-Type", nov.def.header.json);
// q.send();
// q.onreadystatechange = function() {
// 	if(q.readyState == 4 && q.status == 200) {
// 		var tt = q.response;
// 		debugger;
// 	}
// }