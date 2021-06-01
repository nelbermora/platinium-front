import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {

  tinymceContent = 'Sample text';

  constructor() { }

  ngOnInit() {
  }

}
