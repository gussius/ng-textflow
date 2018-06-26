import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgTextflowComponent } from '../ng-textflow.component';

describe('NgTextflowComponent', () => {
  let component: NgTextflowComponent;
  let fixture: ComponentFixture<NgTextflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgTextflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgTextflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
