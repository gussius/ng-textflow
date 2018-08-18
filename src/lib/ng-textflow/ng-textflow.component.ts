import {
  Component,
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
export class NgTextflowComponent {
  @ViewChild('viewContainer', { read: ViewContainerRef}) viewContainer: ViewContainerRef;
  @Input() nodeStyles: any = {};
  @Input() firstOnTop: boolean = true;
  @Input() showPageNumbers: boolean;
  @Input() isOverlaid: boolean;
  
  // Content change handling.
  private _content: string;
  get content(): string { return this._content; }
  @Input() set content(text: string) {
    this._content = text;
    // Clear the nodes out of the NodeComponent[] array.
    this.nodeService.clearNodes();
    this.viewContainer.clear();
    this.nodeService.createFlow(this.content, this.viewContainer, this.nodeStyles, this.showPageNumbers, this.isOverlaid);    
  }

  constructor(private nodeService: CreateFlowService) {
    nodeService.firstOnTop = this.firstOnTop;
  } 

}
