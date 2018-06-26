import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgTextflowModule } from './ng-textflow/ng-textflow.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgTextflowModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
