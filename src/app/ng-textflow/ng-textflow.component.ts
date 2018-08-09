import {
  Component,
  OnInit,
  ViewChild, 
  ViewContainerRef,
  Input} from '@angular/core';
import { CreateFlowService } from './create-flow.service';

@Component({
  selector: 'ng-textflow',
  template: `
    <ng-container #viewContainer></ng-container>
  `
})
// A basic component that uses the CreateFlowService to generate and display the nodes
// based on the content provided in these inputs.
export class NgTextflowComponent implements OnInit {
  @ViewChild('viewContainer', { read: ViewContainerRef}) viewContainer: ViewContainerRef;
  @Input() nodeStyles: any = {};
  @Input() content: string;
  @Input() firstOnTop: boolean = true;
  @Input() showPageNumbers: boolean;
  @Input() isOverlaid: boolean;

  constructor(private nodeService: CreateFlowService) {
    nodeService.firstOnTop = this.firstOnTop;
  } 


  hello(name: string): Number {
    return 2;
  }
  
  ngOnInit() {
    this.nodeService.createFlow(this.content, this.viewContainer, this.nodeStyles, this.showPageNumbers, this.isOverlaid);
  }
}
