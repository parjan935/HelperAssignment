import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputComponentComponent } from './file-input-component.component';

describe('FileInputComponentComponent', () => {
  let component: FileInputComponentComponent;
  let fixture: ComponentFixture<FileInputComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileInputComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileInputComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
