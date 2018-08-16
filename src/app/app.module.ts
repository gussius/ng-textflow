import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgTextflowModule } from 'src/lib/public_api';

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
