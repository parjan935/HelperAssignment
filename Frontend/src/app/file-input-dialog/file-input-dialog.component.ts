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
  pdfUrl: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type === 'application/pdf') {
        this.pdfFile = file;
        this.pdfUrl = URL.createObjectURL(file);
        console.log('PDF file selected:', this.pdfFile.name);
        console.log('PDF file Url:', this.pdfUrl);
      } else {
        console.warn('Please upload a valid PDF file.');
      }
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  saveData(): void {
    if(!this.pdfFile || !this.pdfUrl || !this.fileType){
      return;
    }
    const result = {
      fileType: this.fileType,
      file: this.pdfFile,
      fileUrl: this.pdfUrl
    }
    this.dialogRef.close(result);
  }
}