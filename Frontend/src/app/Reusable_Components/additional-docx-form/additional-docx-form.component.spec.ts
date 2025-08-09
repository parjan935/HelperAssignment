import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDocxFormComponent } from './additional-docx-form.component';

describe('AdditionalDocxFormComponent', () => {
  let component: AdditionalDocxFormComponent;
  let fixture: ComponentFixture<AdditionalDocxFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalDocxFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdditionalDocxFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
