function mySelection(_custom){
	var _default = {
		_allOpen: false
	}
	_custom = $.extend(_default, _custom );
	//console.log(_custom);
	if($(_custom._this).hasClass("selected") && _custom._allOpen === true){
		return true;
	}
	if(_custom._allOpen === true){
		$(_custom._parent[0]).find(".selected").removeClass("selected");
	}else{
		$(_custom._this).parent().find(".selected").removeClass("selected");
	}
	$(_custom._this).addClass("selected");
}
function pageArrow(_this, jqPagination){
	var pageCoutner = 0, newPageCoutner = 0;	
	jqPagination.each(function(){
		pageCoutner++;
		if($(this).hasClass("selected")){
			jqPagination.removeClass("selected");
			if(_this[0].title == 'left'){
				$(this).prev().addClass("selected");
			}else{
				$(this).next().addClass("selected");
			}
			return false;
		}
	});
	if(_this[0].title === 'left'){
		newPageCoutner = pageCoutner - 1;
	}else{
		newPageCoutner = pageCoutner + 1;
	}
	$(".jq-current-page").text(newPageCoutner);
}
var showMe = function (option) {
	var defaults = {
		type: 'cus-success',
		message: 'Hey this is default notification'
	};
	var notifyBar = ('.notifybar');
	if ($(notifyBar).length) {
		$(notifyBar).remove();
	}
	var options = $.extend(defaults, option);
	var notify = '<div style="display:none;" class="notifybar ' + options.type + '">' + options.message + '</div>';
	var notifyBar = ('.notifybar');
	$("body").prepend(notify);
	$(notifyBar).slideDown(500);
	$(notifyBar).delay(5000).slideUp();
};

function hideModal(modalShow, overlay){
	$(modalShow).hide();
	$(overlay).hide();
}