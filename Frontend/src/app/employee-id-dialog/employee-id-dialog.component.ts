import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

interface Data {
  name: string
  id: Number
  service: string
  QrUrl: string
}

@Component({
  selector: 'app-employee-id-dialog',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './employee-id-dialog.component.html',
  styleUrl: './employee-id-dialog.component.scss'
})
export class EmployeeIdDialogComponent {
  constructor(private dialog:MatDialogRef<EmployeeIdDialogComponent>){}

  readonly data=inject<Data>(MAT_DIALOG_DATA);

  closeDialog(){
    this.dialog.close(true);
  }
}
