// select box plugin
$.fn.mySelectbox = function(options){
	// for fixing bug if selector is called twice
	if($("#select_"+this[0].id).length){
		return false;
	}
	var customSelect = this; // class for find original selectbox to make it custom
	var selectContainer = ".select-container"; // option list container of selectbox
	var selectClick = ".select-click"; // custom selectbox click
	var optionClick = ".option-click"; // click on particular custom option
	var customSelectOuter = ".select-box"; // out most div of custom selectbox
	
	
	var ctrlPressed = false;
	$(document).keydown(function(e){
		if(e.which === 17){
			ctrlPressed = true;
		}
	});
	$(document).keyup(function(e){
		ctrlPressed = false;
	});
	
	// creation of custom selectbox by using ".custom-select" class
	$(customSelect).each(function(){
		if(!($(this)[0].nodeName === 'SELECT')){
			return false;
		}
		var _this = this;
		var _multiple = !(!$(_this).attr("multiple"));
		var _unique = !(!$(_this).attr("data-unique"));
		var _id = $(_this).attr("id");
		//console.log(_multiple+" id is " +_id);
		
		var selectedValue;
		var maxLength = 0;
		var maxText;
		var selectValueDiv = "";
		var _selectedText ="";
		var filterBlock = "";
		var outerDiv = "";
		if(!_unique){
			outerDiv = "<div class='select-container hide'><ul class='filter-stack small'></ul></div>"
			selectValueDiv = "<div class='select-click'></div>";
		}else{
			outerDiv = "<div class='select-container hide'></div>"
			selectValueDiv = "<div class='select-click'><ul class='filter-stack small'></ul></div>";
		}
		
		//console.log(_this.id);
		$(_this).wrap("<div class='select-box' id='select_"+this.id+"' data-id='"+ this.id +"' data-multiple='"+ _multiple +"' data-unique='"+_unique +"' data-state='true'></div>");
		if(_unique){
			$(_this).parent().addClass("unique");
		}
		$(_this).parent().append(outerDiv);
		$(_this).parent().prepend(selectValueDiv);
		selectedValue = $(_this).find("option:first-child").text();
		$(_this).find("option").each(function(){
			
			if($(this).val().length > maxLength){
				maxText = $(this).val();
				maxLength = $(this).val().length;
				//console.log(maxLength);
			}
			
			if($(this).attr("selected")){
				var _hide = "";
				var _selector = "";
				if(_multiple){
					_selectedText += this.text+", ";
					$(_this).parent().find(".filter-stack").append("<li class='mul-del' data-id='"+this.value+"'><span>"+ this.text +"</span><i class='fa fa-close'></i></li>");
					_hide = "hide";
				}
				$(_this).parent().find(selectContainer).append("<div class='option-click selected "+ _hide+"' data-value='"+ this.value +"' selected>"+ this.text +"</div>");
				selectedValue = this.text;
			}else{
				$(_this).parent().find(selectContainer).append("<div class='option-click' title='"+ this.value +"' data-value='"+ this.value +"'>"+ this.text +"</div>");
			}
		});
		if(_multiple && !_unique){
			selectedValue = _selectedText.slice(0,-2)
		}
		if(!_unique){
			$(_this).parent().prepend(function(){
				var newWidth = $(this).find(".select-click").text(maxText).width();
				$(this).find(selectClick).text(selectedValue).attr("title",selectedValue);
				//$(this).find(selectClick).text(selectedValue).width(newWidth).attr("title",selectedValue);
			});
		}
		$(this).hide();
	});
	
	// custom selectbox  click
	$(document).on("click", selectClick, function(){
		//$(selectContainer).hide();
		$(selectContainer).hide();
		$(selectClick).removeClass("open");
		$(this).parent().find(selectContainer).show();
		$(this).parent().find(selectClick).addClass("open");
	});
	
	// custom option click
	var _true;
	$(document).on("click", optionClick, function(noctrl){
		var setValueMethod = "";
		//console.log(noctrl.ctrlKey)
		if(!(noctrl.ctrlKey === true || noctrl.ctrlKey === false )){
			setValueMethod = "true";
		}
		var _multi = $(this).closest(customSelectOuter).attr("data-multiple");
		var _uniq = $(this).closest(customSelectOuter).attr("data-unique");
		var _state = $(this).closest(customSelectOuter).attr("data-state");
					
		var dataValue = $(this).attr("data-value");
		var dataText = $(this).text();
		var dataSelector = $(this).closest(customSelectOuter).attr("data-id");
		//var optionClick = $(this).closest(".filter-stack");
		//console.log("data value :" + dataValue + "data selector :" + dataSelector )
		//$(".select-container").hide();
		var cusIndex;
		$(this).closest(customSelectOuter).find(selectClick).children("span").remove();
		//this code only work for mupltiple selectbox
		if(ctrlPressed && _multi==="true" && _uniq==="false" || setValueMethod === "true"){
			if($(this).hasClass("selected")){
				return false;
			}
			if(_state === 'false'){
				var old_state_selected = $(this).closest(selectContainer).find(".selected");
				var oldDataValue = $(old_state_selected).attr("data-value");
				var oldDataText = $(old_state_selected).text();
				$(this).closest(customSelectOuter).find(".filter-stack").append("<li class='mul-del' data-id='"+oldDataValue+"'><span>"+ oldDataText +"</span><i class='fa fa-close'></i></li>");
				$(old_state_selected).addClass("hide");
			}
			
			cusIndex = $(this).index();
			$(this).toggleClass("selected")
			$(selectClick).removeClass("open");
			$(this).addClass("hide");
			$(this).closest(customSelectOuter).find(".filter-stack").append("<li class='mul-del' data-id='"+dataValue+"'><span>"+ dataText +"</span><i class='fa fa-close'></i></li>");
			if($("#"+dataSelector+" option:nth-child("+cusIndex+")").attr("selected")==="selected"){
				$("#"+dataSelector+" option:nth-child("+cusIndex+")").removeAttr("selected");
			}else{
				$("#"+dataSelector+" option:nth-child("+cusIndex+")").attr("selected", "selected");
			}
			
			//console.log("clicked index "+ cusIndex+ " dataSelector id value " +dataSelector);
			// changing values in origional selectbox
			var _mulSelectedValues="";
			$("#"+dataSelector+" option:selected").each(function(){
				_mulSelectedValues += $(this).text()+", ";
			});
			_mulSelectedValues = _mulSelectedValues.slice(0,-2);
			if(cusIndex && _uniq==="false"){
				//$("#"+dataSelector+" option:nth-child("+cusIndex+")").attr("selected","selected");
					// put value and title in custom selectbox
				$("#select_"+dataSelector).find(selectClick).text(_mulSelectedValues).attr("title",_mulSelectedValues);
			}
			$(this).closest(customSelectOuter).attr("data-state","true");
		}else{
			$(this).closest(customSelectOuter).attr("data-state","false");
			//console.log("ctrl value "+ctrlPressed);
			
			if(_uniq==="true"){
				$(this).addClass("selected hide");
				$(this).closest(customSelectOuter).find(".filter-stack").append("<li class='mul-del' data-id='"+dataValue+"'><span>"+ dataText +"</span><i class='fa fa-close'></i></li>");
			}else{
				$(this).parent().find(optionClick).removeClass("selected hide");
				$(this).parent().find(".filter-stack").empty();
				$(this).addClass("selected")
				$(selectClick).removeClass("open");
				$("#"+dataSelector+" option").removeAttr("selected");
			}
			// changing values in origional selectbox
			cusIndex = $(this).index();
			if(_uniq==="true"){
				cusIndex++;
			}
			
			$("#"+dataSelector+" option:nth-child("+(cusIndex)+")").attr("selected","selected");
			if(cusIndex && _uniq==="false"){
				// put value and title in custom selectbox
				$("#select_"+dataSelector).find(selectClick).text(dataText).attr("title",dataText);;
			}
			if(_multi==="false"){
				$(selectContainer).hide();
			}
		}
	});
	
	// remove filter js
	$(document).on("click", ".mul-del", function(){
		var _this = this;
		var id = $(_this).attr("data-id");
		var selectBoxId = $(_this).closest(customSelectOuter).attr("data-id");
		var selectBoxUnique = $(_this).closest(customSelectOuter).attr("data-unique");
		//console.log(id);
		$(_this).closest(customSelectOuter).find("div[data-value='"+id+"']").removeClass("hide selected").removeAttr("selected");
		$(_this).closest(customSelectOuter).find("option[value='"+id+"']").removeAttr("selected");
		$(_this).remove();
		var _mulSelectedValues="";
		$("#"+selectBoxId+" option:selected").each(function(){
			_mulSelectedValues += $(this).text()+", ";
		});
		_mulSelectedValues = _mulSelectedValues.slice(0,-2);
		// put value and title in custom selectbox
		if(selectBoxUnique==="false"){
			$("#select_"+selectBoxId).find(selectClick).text(_mulSelectedValues).attr("title",_mulSelectedValues);
		}
		var deleteLength = $("#select_"+selectBoxId).find(".mul-del").length;
		if(deleteLength==0){
			$("#select_"+selectBoxId).find(".select-click").append("<span>choose options</span>")
		}else{
			$("#select_"+selectBoxId).find(".select-click").children("span").remove();
		}
		
	});
	// click outside document for hide selectbox container
	$(document).on("click", function(e){
		if(!$(e.target).closest(".select-click, .select-container, .mul-del").length){
			$(selectContainer).hide();
			$(selectClick).removeClass("open");
		}
	});
	
	$("#check").on("click", function(){
		var result = [],i =0;;
		$("select").each(function(){
			result[i] = $(this).val()+"</br>";
			i++;
		});
		$(".result").html(result);
	});
}
$.fn.myGetSetSelectbox = function(action, values){
	var _this = this;
	var newAction;
	if(action === 'setSelected'){
		newAction = 'set';
	}else{
		newAction = 'get';
	}
	if(newAction === 'get'){
		console.log("in")
		$(".result").html($(this).val());
		return false;
	}
	var length = $("#select_"+this[0].id).find(".option-click").length;
	var valueLength = values.length;
	//console.log(length)
	//console.log("#select_"+this[0].id);
	var opt = document.getElementsByClassName("option-click");
	/* javascript for finding option
	for(var i = 0; i < length; i++){
		var selector = "#select_"+this[0].id;
		var classSelector  = $(opt[i])[0].className;
		var main = selector+" ."+classSelector;
		//console.log(values[i]);
		for(var j = 0; j< valueLength; j++){
			if($("#select_"+this[0].id).find(".option-click:nth-child("+(i+1)+")").attr("data-value") === values[j]){
				//console.log($(this))
			}
		}
	}
	*/
	$("#select_"+this[0].id +" .option-click").each(function(){
		for(var j = 0; j< valueLength; j++){
			if($(this).attr("data-value") === values[j]){
				if($(this).hasClass("selected")){
					return true;
				}
				$(this).trigger("click");
				
			}
		}
	})
}
//set values function
function setValues(){
	$("#multiple3").myGetSetSelectbox("setSelected",['AK','CO'])
}
// custom checkbox plugin$.
$.fn.myCheckbox = function(){
	if($(this).parent().find(".checkbox").length){
		return false;
	}
	var checkbox = ".checkbox";
	//var divChecked = "checkbox checked";
	// make all input checkbox into custom checkbox
	$(this).each(function(){
		if(!($(this)[0].type === 'checkbox')){
			return false;
		}
		var dataId = this.id;
		var dataName = $(this).attr("name");
		var dataDisabled = $(this).attr("disabled")?"disabled":" ";
		
		$(this).after("<div class='checkbox "+ dataDisabled +"' data-id='"+ dataId +"' data-name='"+ dataName +"'></div>");
		if($(this).prop("checked")){
			$(this).next().addClass("checked");
		}
	});
	// click on custom checkbox
	$(checkbox).on("click", function(){
		var _this = this;
		if($(_this).hasClass("disabled")){
			return false;
		}
		
		$(_this).toggleClass("checked");
		if($(_this).prev("input").prop("checked") == true){
			$(_this).prev("input").prop("checked", false);
		}else{
			$(_this).prev("input").prop("checked", true);
		}
	});
	
	// click on input checkbox
	$("input[type=checkbox]").on("change", function(){
		var _id = $(this).attr("id");
		//console.log(_id);
		//console.log($(this).prop("checked") + checkbox + "[data-id="+ _id +"]");
		if($(this).prop("checked") == true){
			$(checkbox + "[data-id="+ _id +"]").addClass("checked");
		}else{
			$(checkbox + "[data-id="+ _id +"]").removeClass("checked");
		}
	});
	$("#check").on("click", function(){
		var result = [],i =0;
		$("input[type=checkbox]").each(function(){
			result[i] = $(this).prop("checked")? "true <br>": "false <br>";
			i++;
		});
		$(".result").html(result);
	});
	//custom checkbox click for check/uncheck all
	$(".checkbox[data-name=all]").click(function(){
		var _all=1;
		checkboxChecked(this, _all);
	});
	
	// input checkbox for check all checkbox
	$("input[name=all]").click(function(){
		var _all=1;
		checkboxChecked(this, _all);
	});
	
	// input checkbox 
	$("input[type=checkbox]").on("change", function(){
		if($(this).attr("name") !== 'all'){
			checkboxCheckerForAll($(this));
		}
	});
	
	// custom checkbox : to check whether all child checkbox are checked with parent checkbox
	$(".checkbox").click(function(){
		if($(this).hasClass("disabled")){
			return false;
		}else{
			checkboxCheckerForAll($(this));
		}
	});
	// function for check, parent checkbox with all its childs checkbox
	function checkboxCheckerForAll(_this){
		var _name;
		//console.log(_this);
		if($(_this).is("input")){
			_name = $(_this).attr("name");
		}else{
			_name = $(_this).attr("data-name");
		}
		var _true=0, _false=0;
		var length = $("input[name="+_name+"]").not(":disabled").length, _all;
		$("input[name="+_name+"]").each(function(){
			if($(this).prop("checked") === true && $(this).is(":disabled") === false){
				_true++;
			}
			if($(this).prop("checked") === false && $(this).is(":disabled") === false){
				_false++;
			}
		})
		//console.log("length "+length +" true "+ _true+" false "+ _false+" name " +_name);
		// if length and _true then parent would get check 
		if(length === _true){
			//console.log("true");
			checkboxChecked(".checkbox[data-id="+_name+"]", _all=1,true);
		}else{
			checkboxChecked(".checkbox[data-id="+_name+"]", _all=0,false);
		}
	}
	// _this = click element, _all==1 parent checkbox will check ( all check ), _all=0 single checkbox unchecked, true/false = will reassemble the state of checkbox
	function checkboxChecked(_this,_all,state){
		var id, prop;
		if($(_this).is("input")){
			id = $(_this).attr("id");
		}else{
			id = $(_this).attr("data-id");
		}
		if(state === true){
			prop = true;
		}else if(state === false){
			prop = false;
		}else{
			prop = $("#"+id).prop("checked");
		}
		//console.log("this "+_this+" all "+_all+" state "+ state );
		
		if(_all === 1){
			var inputThis = $(_this).closest("table").find("input[type=checkbox]");
			$(inputThis).each(function(){
				if($(this).is(":disabled")){
					return true;
				}else{
					$(this).prop("checked",prop);
				}
			});
			var checkThis = $(_this).closest("table").find(".checkbox");
			$(checkThis).each(function(){
				if($(this).hasClass("disabled")){
					return true;
				}else{
					if(prop == true){
						$(this).addClass("checked");
					}else{
						$(this).removeClass("checked");
					}
				}
			});
			
		}
		if(_all === 0){
			$("#"+id).prop("checked",prop);
			$(checkbox + "[data-id="+ id +"]").removeClass("checked");
		}
		
	}
}

// category Menu accordian
$.fn.categoryMenu = function(){
	var aHref = $(".jq-title");
	var _allOpen = false;
	aHref.on("click",function(){
		_allOpen = $(this).closest(".category-menu").attr("data-attr");
		_allOpen = typeof(_allOpen)==='string'?true: false;
		if(_allOpen === true){
			$(this).closest(".category-menu").find(".content").slideUp();
		}
		if(!$(this).hasClass("selected")){
			mySelection({_this:this, _selector:aHref, _allOpen:_allOpen, _parent:$(this).closest(".category-menu")});
			$(this).next(".content").slideDown();
		}else{
			$(this).removeClass("selected")
			$(this).next(".content").slideUp();
		}
	});
}