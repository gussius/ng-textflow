import { NgTextflowModule } from '../ng-textflow.module';

describe('NgTextflowModule', () => {
  let ngTextflowModule: NgTextflowModule;

  beforeEach(() => {
    ngTextflowModule = new NgTextflowModule();
  });

  it('should create an instance', () => {
    expect(ngTextflowModule).toBeTruthy();
  });
});
