import { Component, OnInit } from '@angular/core';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/shell/shell.js';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  htmlModeData = `
<!-- Default panel -->
<div class="panel panel-default">
<div class="panel-heading">
<h5 class="panel-title">
Panel Title
<span class="text-semibold">Default</span>
<small>Full featured toolbar</small>
</h5>

<ul class="panel-heading-icons">
<li><a href="#" data-panel="collapse"><i class="icon-arrow-down2"></i></a></li>
<li><a href="#" data-panel="reload"><i class="icon-reload"></i></a></li>
<li><a href="#" data-panel="move"><i class="icon-move"></i></a></li>
<li><a href="#" data-panel="close"><i class="icon-close"></i></a></li>
</ul>
</div>

<div class="panel-body">
Panel body
</div>
</div>
<!-- /default panel -->
`;

jsModeData = `
/**
* In fact, you're looking at ACE right now. Go ahead and play with it!
*
* We are currently showing off the JavaScript mode. ACE has support for 45
* language modes and 24 color themes!
*/

function add(x, y) {
var resultString = "Hello, ACE! The result of your math is: ";
var result = x + y;
return resultString + result;
}

var addResult = add(3, 2);
console.log(addResult);
`;

  codeMirrorData1 = `
<!-- Create a simple CodeMirror instance -->
<link rel="stylesheet" href="lib/codemirror.css">
<script src="lib/codemirror.js"></script>
<script>
var editor = CodeMirror.fromTextArea(myTextarea, {
  lineNumbers: true
});
</script>
`;

  codeMirrorData2 = `
#!/bin/bash

# clone the repository
git clone http://github.com/garden/tree

# generate HTTPS credentials
cd tree
openssl genrsa -aes256 -out https.key 1024
`;


}
