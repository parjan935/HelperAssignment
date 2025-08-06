import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeIdDialogComponent } from './employee-id-dialog.component';

describe('EmployeeIdDialogComponent', () => {
  let component: EmployeeIdDialogComponent;
  let fixture: ComponentFixture<EmployeeIdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeIdDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeIdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
