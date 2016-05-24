(function($){
  $.fn.oneClickEdit = function(options,success){
    return this.each(function(){
      // we need to preserve white space on text areas
      $.valHooks.textarea = {
        get: function(elem) {
          return elem.value.replace(/\r?\n/g, "\r\n");
        }
      };
      //set a border to avoid shifting
      $(this).css({'border':'1px solid transparent'});
      var inputType = $(this).data('input');
      var prev_el = $(this);
      var prev_val = $(this).text();
      var styles = {};
      var id = $(this).data('id');
      var field = $(this).data('field');
      var getStyles = ['padding','margin','font','background-color','color','display','width','height','resize'];
      var className = $(this).attr('class');
      var idName = $(this).attr('id');
      for(var i = 0;i < getStyles.length;i++){
        var k = getStyles[i];
        var v = $(this).css(getStyles[i]);
        styles[k] = v;
      }
      var origStyles = styles;
      delete styles['background-color'];
      // add a border on hoover for user feedback
      $(this).on('mouseenter',function(){
        $(this).css({'border':'1px solid lightgray','border-radius': '2px','box-sizing': 'border-box'});
      });
      $(this).on('mouseleave',function(){
        $(this).css({'border':'1px solid transparent','border-radius': '2px','box-sizing': 'border-box'});
      });

      // replace element on click with textarea or input
      $(this).on('click',function(){
        styleString = 'border-color:transparent;background-color:#fff;width:'+styles["width"]+'px;height:'+styles["height"]+';';
        for(var k in styles){
          styleString += k +':'+styles[k]+';';
        }
        if(typeof inputType === 'undefined' || inputType == 'textarea'){
          var newElement = '<textarea id="'+idName+'" class="'+className+'" style="'+styleString+'">'+prev_val+'</textarea>';
        }else if(inputType == 'input'){
          var newElement = '<input id="'+idName+'" class="'+className+'" style="'+styleString+'" value="'+prev_val+'">';
        }
        $(this).replaceWith(newElement);
        $('#'+idName).focus();
        //clearing the value and resetting it moves cursor to end of input cross browser solution
        $('#'+idName).val('');
        $('#'+idName).val(prev_val);

        // add event listener to new element
        $('#'+idName).on('blur',function(){
          var newVal = $(this).val().trim();
          // do we allow for blank values
          if(newVal == ''){
            if(typeof options.allowNull === 'undefined' || options.allowNull == false){
              newVal = prev_val;
            }
          }
          //make sure the value has changed before running anything
          if(newVal != prev_val){
            //check for custom callback
            if(typeof options.onblur !== 'undefined' && options.onblur != ''){
              var callback = options.onblur;
              callback();
            }else{
              // ajax call with success function
              var data = {id:id,field:field,value:newVal};
              // check to see if custom data attributes are being posted
              if(typeof options.data !== 'undefined'){
                Object.assign(data,options.data);
              }
              $.ajax({url:options.url,type:'POST',data:data,success:success});
            }
          }


          // replace with previous element populated with new value
          $(prev_el).attr('style','');
          $(prev_el).text(newVal);
          $(this).replaceWith(prev_el);
          $('#'+idName).css(origStyles);
          $('#'+idName).css('height','auto');
          $('#'+idName).css('white-space','pre-wrap');
          $('#'+idName).oneClickEdit = null;
          $('#'+idName).removeData();
          $('#'+idName).oneClickEdit(options,success);
        });
      });
    });
  };

}(jQuery));
