import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// Module components
import { NgTextflowComponent } from './ng-textflow.component';
import { NodeComponent } from '../ng-textflow/node.component';

// Services
import { CreateFlowService } from './create-flow.service';

@NgModule({
  imports: [CommonModule],
  providers: [CreateFlowService],
  declarations: [NgTextflowComponent, NodeComponent],
  entryComponents: [NodeComponent],
  exports: [NgTextflowComponent]
})
export class NgTextflowModule {

  // public static forRoot(): ModuleWithProviders {

  //   return {
  //     ngModule: NgTextflowModule,
  //     providers: [ CreateFlowService ]
  //   }
  // }

 }
