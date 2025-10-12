import { TestBed } from '@angular/core/testing';

import { CloudFunctions } from './cloud-functions';

describe('CloudFunctions', () => {
  let service: CloudFunctions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudFunctions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
