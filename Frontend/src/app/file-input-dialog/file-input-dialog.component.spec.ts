import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputDialogComponent } from './file-input-dialog.component';

describe('FileInputDialogComponent', () => {
  let component: FileInputDialogComponent;
  let fixture: ComponentFixture<FileInputDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileInputDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
