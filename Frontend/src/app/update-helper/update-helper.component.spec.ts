import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHelperComponent } from './update-helper.component';

describe('UpdateHelperComponent', () => {
  let component: UpdateHelperComponent;
  let fixture: ComponentFixture<UpdateHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateHelperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
