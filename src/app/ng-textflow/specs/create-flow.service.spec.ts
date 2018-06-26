import { TestBed, inject } from '@angular/core/testing';

import { CreateFlowService } from '../create-flow.service';

describe('CreateFlowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateFlowService]
    });
  });

  it('should be created', inject([CreateFlowService], (service: CreateFlowService) => {
    expect(service).toBeTruthy();
  }));
});
