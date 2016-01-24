(function( $ ) {
	 $.fn.bsgithub = function( options ){
        var _this       = this;
		  _this.settings = $.extend({
				title : "Title",
				org: "",
				repo: ""
		  }, options);
		  _this.append("<h1>"+_this.settings.title+"</h1>")
		  _this.append("<div></div>")
		  $icons = {
			zip: "http://icons.iconarchive.com/icons/zerode/plump/24/Folder-Archive-zip-icon.png",
			pdf: "https://cdn4.iconfinder.com/data/icons/CS5/32/ACP_PDF%202_file_document.png",
			ocx: "http://findicons.com/icon/download/590627/word/32/png",
			doc: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/MS_word_DOC_icon.svg/46px-MS_word_DOC_icon.svg.png",
			rar: "http://www.file-extensions.org/imgs/extension-icon/103800/part2.rar-split-multi-volume-rar-compressed-file-archive-part-2.gif",
			image: "https://cdn2.iconfinder.com/data/icons/ios7-inspired-mac-icon-set/16/preview_16.png",
			txt: "http://icons.iconarchive.com/icons/saki/nuoveXT-2/24/Mimetypes-txt-icon.png"
		  }
		  $image = ["jpg", "png", "peg", "bmp"]
		  allRepo = []
		  if(_this.settings.repo.indexOf(",") != -1){
				allRepo = _this.settings.repo.split(",")
		  } else {
				allRepo.push(_this.settings.repo)
		  }
		  $application = [
				{client_id: "a93ba02563fa85245e46", client_secret: "dfc0a8e548ef7c833c157d2a73e5b2f93fa0f132"},
				{client_id: "419b7048e38a110fe851", client_secret: "de21ac73f568984ac52eddfa58591b3691b2110e"},
				{client_id: "46e8625959c339da8d14", client_secret: "d205f94ba735d86df1e1542556b10f5d59e35a7b"},
				{client_id: "89cf89712b2d339836e8", client_secret: "b4502db0ea6ae2937f5798c92d6206b0d4c2d4cb"},
				{client_id: "148755d880c1a277649b", client_secret: "25790f55054a7f5b8aca4e26a413dd84b40c59ac"},
				{client_id: "994ac7b689d5ca2cf123", client_secret: "b55a003bfd1c97c91352dc27ae5c757a28ddabaf"},
				{client_id: "8e3f9dd2c37044937d93", client_secret: "f1b2cfa94382a83f59d869961d28cd292b2e4fbf"},
				{client_id: "dfe79f988c718e64642c", client_secret: "31f21f856fad711af0579251e0fb68ab3c8acc19"},
				{client_id: "c37935e00603c960563e", client_secret: "1c2931df460080c38c21235c8af388c83ba0bef0"}
		  ]
		  $application =  $application[Math.floor(Math.random()*$application.length)];
		  $client_id = $application.client_id
		  $client_secret = $application.client_secret
		  currentRepo = 0
		  ajaxGetFiles()
		  function ajaxGetFiles(){
				if(currentRepo >= allRepo.length){
					//window.thisfancytree.sort()
					currentRepo = 0
					allRepo = []
					return ;
				}
				thisRepo = allRepo[currentRepo].trim()
				$.ajax({
					url: 'https://api.github.com/repos/'+_this.settings.org+'/'+thisRepo+'/contents/?client_id='+$client_id+"&client_secret="+$client_secret,
					mydata: {repo: thisRepo, client_id: $client_id, client_secret: $client_secret},
					success: function(re){
						$client_id = this.mydata.client_id
						$client_secret = this.mydata.client_secret
						folder = {client_id : $client_id, client_secret : $client_secret} //Add data to folder
						data = getData(re, this.mydata.repo, folder)
						if(currentRepo == 0){
								window.thisfancytree = _this.find("div").fancytree({
								source:data,
								click: function(ev, ta){
									thisnode = ta.node
									console.log(thisnode.data)
									if(thisnode.data.download != undefined){
										currentime = new Date()
										if(thisnode.data.lastimedownload == undefined ){
											SaveToDisk(thisnode.data.download)
											toastr["success"]("Đang chuẩn bị tải: "+thisnode.title)
										} else {
											lastimedownloadV = Number(thisnode.data.lastimedownload)
											if(currentime.getTime() - lastimedownloadV < 10000) {
												toastr["error"]("Đang chuẩn bị tải: "+thisnode.title)
											} else {
												SaveToDisk(thisnode.data.download)
												toastr["success"]("Đang chuẩn bị tải: "+thisnode.title)
											}
										}
										thisnode.data.lastimedownload = currentime.getTime()
									}
									else {
										//Click folder
										if ( thisnode.data.added == 1){
											if(thisnode.isExpanded()){
												thisnode.setExpanded(false)
											} else {
												thisnode.setExpanded()
											}
											return;
										}
										thisRepo = thisnode.data.repo.trim()
										$.ajax({
											url: 'https://api.github.com/repos/'+_this.settings.org+'/'+thisRepo+'/contents/'+thisnode.data.path+'?client_id='+thisnode.data.client_id+"&client_secret="+thisnode.data.client_secret,
											mydata: {client_id: thisnode.data.client_id, client_secret:thisnode.data.client_secret},
											success: function(re){
												data = getData(re, thisRepo, {client_id: this.mydata.client_id, client_secret: this.mydata.client_secret})
												thisnode.addChildren(data);
												thisnode.setExpanded()
												thisnode.data.added = 1
											}
										})
										//thisnode.setTitle(thisnode.title + ", " + new Date());
									}
								}
							})
						} else {// currentRepo != 0
							thisRepo = allRepo[currentRepo].trim()
							$.ajax({
									url: 'https://api.github.com/repos/'+_this.settings.org+'/'+thisRepo+'/contents/?client_id='+$client_id+"&client_secret="+$client_secret,
									success: function(re){
										data = getData(re, thisRepo, folder)
										window.thisfancytree.fancytree("getRootNode").addChildren(data);
									}
								})
						}
						currentRepo++
						ajaxGetFiles()
					}
			  })
		  }
		  //	FUNCTION -------------------------------
		  function getData(re, thisRepo, folder){
				data = []
				$.each(re, function(k,v){
					if(	v.type!="file"	){
						data.push(
							{title: v.name, path: v.path, repo: thisRepo, client_id: folder.client_id, client_secret: folder.client_secret, folder:true}
					  )
				  } else {
						extension = v.name.substring(v.name.length-3)
						if($image.indexOf(extension) != -1){extension = "image"}
						if(extension == "cmd"){return;}
						data.push(
							{title: v.name, path: v.path, icon:$icons[extension], download: v.download_url}
					  )
				  }
				})
				return data;
		  }
		  function SaveToDisk(fileURL, fileName) {
				 // for non-IE
				 if (!window.ActiveXObject) {
					  var save = document.createElement('a');
					  save.href = fileURL;
					  save.target = '_blank';
					  save.download = fileName || 'unknown';

					  var event = document.createEvent('Event');
					  event.initEvent('click', true, true);
					  save.dispatchEvent(event);
					  (window.URL || window.webkitURL).revokeObjectURL(save.href);
				 }

				 // for IE
				 else if ( !! window.ActiveXObject && document.execCommand)     {
					  var _window = window.open(fileURL, '_blank');
					  _window.document.close();
					  _window.document.execCommand('SaveAs', true, fileName || fileURL)
					  _window.close();
				 }
			}
	}
}( jQuery ));