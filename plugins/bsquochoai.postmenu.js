(function( $ ) {
	/*cần chèn trước:
		<script src='https://bsquochoai-webservice.herokuapp.com/bsquochoaifiles/plugins/jquery.scrollTo.min.js'/>
		<script src='https://bsquochoai-webservice.herokuapp.com/bsquochoaifiles/plugins/jquery.sticky-kit.min.js'></script>
		<link rel="stylesheet" type="text/css" href="https://bsquochoai-webservice.herokuapp.com/bsquochoaifiles/plugins/css/tooltipster.css" />
		<link rel="stylesheet" type="text/css" href="https://bsquochoai-webservice.herokuapp.com/bsquochoaifiles/plugins/css/tooltipster-noir.css" />
		<script src='https://bsquochoai-webservice.herokuapp.com/bsquochoaifiles/plugins/jquery.tooltipster.min.js'></script>
		https://github.com/flesler/jquery.scrollTo
		https://github.com/leafo/sticky-kit
		http://iamceege.github.io/tooltipster
	*/
	 $.fn.postmenu = function( options ){
        var _this       = this;
		  _this.settings = $.extend({
				menu : "",
				submenu: "",
				content: "",
				parent: "",
				addClassToParrent: "",
				addClassToContent: "",
				addClass: "",
				isSticky: 1,
				menuCss: {"list-style-type": "upper-roman", "cursor": "pointer", "font-weight": "bold"},
				submenuCss: {"list-style-type": "decimal", "cursor": "pointer"},
				hoverEffect: 'color: #FF7D02 ;text-shadow: #BDB5A9 0px 1px;',
				submenuHienthitext1hang: 1
		  }, options);
		  /*
		  		menu : h4, .li là cái để mình lấy làm menu
				submenu: là cái để mình tìm bên dưới menu và add vào submenu cho nó {parent: "{this}+div ol", tag: "li"}
				content: .post-body Nơi mình tìm kiếm menu
				parent: cha mẹ của nơi chứa menu, để mình cho nó sticky-kit, và add z-index cho nó lên top
				addClassToParrent: "",
				addClassToContent: "",
				addClass: thêm class vào menu hiện tại, class mặc định là bsquochoai-menu-container
				isSticky: 1 || 0 mặc định là 1, sẽ sticky cái parent này vào body
		  */
		  if(_this.settings.content != ""){
				content = $(_this.settings.content)
				if(content.attr("postmenu") == "1"){
					return false;
				}
				if(_this.settings.menu != ""){
					//ADD CLASS
					content.addClass(_this.settings.addClassToContent)
					$(parent).addClass(_this.settings.addClassToParrent)
					_this.append('<ul class="bsquochoai-scrollto-menu-container"></ul>')
					_this.addClass(_this.settings.addClass)
					ulmenu = $(".bsquochoai-scrollto-menu-container")
					_this.append('<style>.bsquochoai-scrollto-menu-container .bsquochoai-scrollto-menu:hover, .bsquochoai-scrollto-submenu:hover{'+_this.settings.hoverEffect+'}</style>')
					//LOOP xung quanh các menu selector từ content
					menu = content.find(_this.settings.menu)
					counterMenu = 0
					counterSubmenu = 0
					menu.each(function(){
						thisele = $(this)
						scrolltoclass ="bsquochoai-scrollto-"+counterMenu
						thisele.addClass(scrolltoclass)
						ulmenu.append('<li data-scrollto=".'+scrolltoclass+'" class="bsquochoai-scrollto bsquochoai-scrollto-menu bsquochoai-scrollto-menu-'+counterMenu+'">'+thisele.text().trim()+'</li>')
						//Xử lý submenu của menu này
						submenu = $(_this.settings.submenu.parent.replace(/{this}/g, "."+scrolltoclass))
						if( submenu.length >0 && thisele.data("scrollto-nosubmenu") == undefined){
							$('.bsquochoai-scrollto-menu-'+counterMenu).after('<ul class="bsquochoai-scrollto-menu-'+counterMenu+'-submenu"></ul>'); //Chèn submenu cho menu hiện tại
							//Chỉ loop thằng match đầu tiên của submenu.parent
							chentruocsubmenuCount = 1
							$.each($(submenu[0]).children(), function(){
								if($(this).prop("tagName").toLowerCase() == _this.settings.submenu.tag.toLowerCase()){
									thisSubEle = $(this)
									scrolltoclassSub ="bsquochoai-scrollto-submenu-"+counterSubmenu
									thisSubEle.addClass(scrolltoclassSub)
									chentruoc = "", submenutitle = ""
									if(_this.settings.submenuHienthitext1hang){
										chentruoc = chentruocsubmenuCount + ". "
										chentruocsubmenuCount++
										submenutitle = thisSubEle.text().trim()
									}
									$('.bsquochoai-scrollto-menu-'+counterMenu+'-submenu').append('<li data-scrollto=".'+scrolltoclassSub+'" class="bsquochoai-scrollto bsquochoai-scrollto-submenu" title="'+submenutitle+'">'+chentruoc+submenutitle+'</li>')
									counterSubmenu++
								}
							})
						}
						counterMenu++
					})
					//Effect cho các li trong menu
					ulmenu.find(".bsquochoai-scrollto-menu").css(_this.settings.menuCss)
					$(".bsquochoai-scrollto-submenu").css(_this.settings.submenuCss)
					if(_this.settings.submenuHienthitext1hang){
						$(".bsquochoai-scrollto-submenu").css({"overflow": "hidden","text-overflow": "ellipsis","white-space": "nowrap"})
						.tooltipster({maxWidth: 400})
						
					}
					_this.on("click", ".bsquochoai-scrollto", function(){
						scrollto = $(this).data("scrollto")
						//console.log(scrollto)
						$.scrollTo($(scrollto), 800)
					})
					if(_this.settings.isSticky){
						if(_this.settings.parent != ""){
							$(_this.settings.parent).stick_in_parent({parent: $("body")})
							.css({"z-index": 9})
						}
					}
					content.attr("postmenu", "1")
			  }
		  }
		  
	}
}( jQuery ));