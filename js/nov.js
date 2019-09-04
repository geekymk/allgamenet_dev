var nov = {
	def: {
		apiurl: 'https://cmk.iptime.org',
		header: {
			json: "application/json; charset=utf-8"
		}
	},
	ajax: {
		getRequest: function() {
			return (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Msxml2.XMLHTTP")); 
		}
	},
	event: {
		showAddingPopup: function() {
			$('#homeLogo').hide('slide',{},100,function(){
				$('#backList').show('slide', {}, 300);
			});
			$('#videoList').hide('slide',{},100,function(){
				$('#videoAdding').show('slide', {}, 300);
			});
		},
		goHome: function() {
			window.top.location.href = '/';
		},
		backList: function() {
			$('#backList').hide('slide',{},100,function(){
				$('#homeLogo').show('slide', {}, 300);
			});
			$('#videoAdding').hide('slide',{},100,function(){
				$('#videoList').show('slide', {}, 300);
			});
		}
	},
	video: {
		getList: function(idx, limit, ca) {
			var req = nov.ajax.getRequest();
			req.open('GET', nov.def.apiurl+'/video?idx='+idx+'&limit='+limit+'&ca='+ca);
			req.setRequestHeader("Content-Type", nov.def.header.json);
			req.send();
			req.onreadystatechange = function() {
				if(req.readyState == 4 && req.status == 200) {					
					var content = "";
					var data = JSON.parse(req.response);
					var size = data.size;
					for(var i=0; i<size; i++) {
						var row = data.list[i];
						content += '<div class="screamwrap-row">';
						content += '<div class="screamwrap-row-title">'+row.id+'</div>';
						content += '<div class="screamwrap-row-content">'+row.writer_nm+'</div>';
						content += '</div>';
					}
					var main = document.getElementById('videoList');
					$(main).html(content);
					$(main).show('slide', {}, 300);
				}
			};
		}
	}
};
nov.video.getList(0, 5, 'ABCD');
// document.getElementById('homeLogo').addEventListener('click', nov.event.goHome);
document.getElementById('addvideo').addEventListener('click', nov.event.showAddingPopup);
document.getElementById('backList').addEventListener('click', nov.event.backList);
