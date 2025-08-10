import { Component, inject, model, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';



@Component({
  selector: 'app-file-input-dialog',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIcon,
    NgIf
  ],
  templateUrl: './file-input-dialog.component.html',
  styleUrl: './file-input-dialog.component.scss'
})

export class FileInputDialogComponent {

  constructor(private dialogRef: MatDialogRef<FileInputDialogComponent>) { }

  documentTypes = ['Voter ID', 'Aadhar', 'PAN Card', 'Passport']

  fileType = ''
  pdfFile: File | null = null;

  onFileSelected(event: any): void {
    const file = event.target?.files[0]
    if (file.type === 'application/pdf') {
      this.pdfFile = file;
    } else {
      console.warn('Please upload a valid PDF file.');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  showError = false

  saveData(): void {
    if (!this.pdfFile || !this.fileType) {
      this.showError = true
      return;
    }
    const result = {
      fileType: this.fileType,
      file: this.pdfFile,
    }
    this.dialogRef.close(result);
  }
}