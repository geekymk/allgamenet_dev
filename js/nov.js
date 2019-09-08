var nov = {
	def: {
		url: 'https://cmk.iptime.org',
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
		var url = new URL(this.value);
		var id = url.searchParams.get('v');
		var previewVideo = document.getElementById('preview-video-link');
		previewVideo.src = 'https://i.ytimg.com/vi/'+id+'/mqdefault.jpg';
		previewVideo.width = '320';
		previewVideo.height = '180';
	}
};
nov.video = {
	add: function() {
		var doc = document;
		var title = doc.getElementById('video-title').value;
		var url = doc.getElementById('video-link').value;
		var name = doc.getElementById('video-writer-name').value;
		var pw = doc.getElementById('video-writer-pw').value;
		var req = new XMLHttpRequest();
		req.open('POST', nov.def.url+'/video');
		req.setRequestHeader("Content-Type", nov.def.hdr.form);
		req.send('title='+title+'&video-url='+url+'&writer-nm='+name+'&writer-pw='+pw);
		req.onreadystatechange = function() {
			if(req.readyState == 4) {
				console.log(req.status);
				if(req.status == 201) {
					window.top.location.href = '/';
				}
			}
		}
	},
	getList: function(idx, limit, ca) {
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
					content += '<div class="screamwrap-row">';
					content += '<div class="screamwrap-row-title">'+row.id+'</div>';
					content += '<div class="screamwrap-row-content">'+row.writer_nm+'</div>';
					content += '</div>';
				}
				var main = document.getElementById('videoList');
				$(main).html(content);
			}
		};
	}
};
nov.video.getList(0, 5, 'ABCD');
// document.getElementById('homeLogo').addEventListener('click', nov.event.goHome);
document.getElementById('addvideo').addEventListener('click', nov.popup.show);
document.getElementById('backList').addEventListener('click', nov.event.backList);
document.getElementById('block-background').addEventListener('click', nov.popup.hide);


document.getElementById('popup').addEventListener('click', nov.popup.blockEvent);
document.getElementById('popup-btns').addEventListener('click', nov.popup.actionBtn);
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