# One Click Edit #

This is a jQuery plugin that allows for elements to be editable by clicking on them. This
plugin makes an AJAX call to your endpoint.

### What is this repository for? ###

* One Click Edit by Curtis Parham
* Version 0.5

### How do I get set up? ###

* Step 1 Load plugin after you load jQuery

```javascript
<script type="text/javascript" src="/js/one_click_edit.js"></script>
```

* Step 2 Add HTML element

```html
<h3 id="editHeader" data-id="4" data-field="title" data-input="input">Starting Text</h3>
```
..* data-id attribute is the primary key in the database
..* data-field is the column name in the database to be updated
..* data-input can be 'input' for single line fields or 'textarea' for multi-line fields

* Step 3 Add your success function

```javascript
function success(resp){
  //handle your response here
  console.log(resp);
}
```

* Step 4 Instantiate your plugin

```javascript
$('document').ready(function(){
  // create your options object
  var options = {url:'/parsers/updateParser.php'};
  $('#editHeader').oneClickEdit(options,success);
});
```

..* Options
....* data - object of additional information to post to parser file
....* allowNull - boolean to allow for an empty value to be sent. Defaults to False
....* onblur - this option will allow you to send a callback function instead of using the default AJAX call with success       function