import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-textvisualizer',
  templateUrl: './textvisualizer.component.html',
  styleUrls: ['./textvisualizer.component.scss']
})
export class TextvisualizerComponent implements OnInit {

  constructor() { }

  @Input() decodedText: string;

  ngOnInit() {
  }

}
