import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';



export interface Helper {
  employeeID: number;
  name: string;
  email: string;
  profilePic: string; 
  gender: string;
  phone: string;
  languages: string[]; 
  service: string; 
  organization: string;
  vehicleType: string; 
  kycDocx: string; 
  employeeId_QR: string; 
  dateJoined: string; 
}


@Component({
  selector: 'app-employee-id-dialog',
  standalone: true,
  imports: [MatIcon,CommonModule,NgIf],
  templateUrl: './employee-id-dialog.component.html',
  styleUrl: './employee-id-dialog.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EmployeeIdDialogComponent {
  constructor(private dialog: MatDialogRef<EmployeeIdDialogComponent>) { }

  readonly helper = inject<Helper>(MAT_DIALOG_DATA);

  ngOnInit() {
    console.log(this.helper);
  }

  downloadID() {
    window.print()
  }

  closeDialog() {
    this.dialog.close(true);
  }
}
