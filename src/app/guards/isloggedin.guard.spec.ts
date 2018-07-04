import { TestBed, async, inject } from '@angular/core/testing';

import { IsloggedinGuard } from './isloggedin.guard';

describe('IsloggedinGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsloggedinGuard]
    });
  });

  it('should ...', inject([IsloggedinGuard], (guard: IsloggedinGuard) => {
    expect(guard).toBeTruthy();
  }));
});
