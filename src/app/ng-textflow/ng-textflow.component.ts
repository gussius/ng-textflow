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
  `,
  styles: [`
    p {
      color: lightgrey;
    }
  `]
})
export class NgTextflowComponent implements OnInit {
  @ViewChild('viewContainer', { read: ViewContainerRef}) viewContainer: ViewContainerRef;
  @Input() nodeStyles: any = {};
  @Input() content: string;
  @Input() firstOnTop: boolean = true;

  constructor(private nodeService: CreateFlowService) {
    nodeService.firstOnTop = this.firstOnTop;
  } 
  
  ngOnInit() {
    setTimeout(() => this.nodeService.createFlow(this.content, this.viewContainer, this.nodeStyles));
  }
}
