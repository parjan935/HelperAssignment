import { Component, Inject, inject, Input, NgModule, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule, NgIf } from "@angular/common";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import axios from 'axios';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';


import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { EmployeeIdDialogComponent } from '../employee-id-dialog/employee-id-dialog.component';
import { MatCardModule } from '@angular/material/card'


interface Helper {
  _id?: string,
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
  employeeID: number;
  employeeId_QR: string;
  dateJoined: Date;
}


@Component({
  selector: 'app-helpers',
  standalone: true,

  imports: [RouterLink, RouterOutlet
    , MatToolbarModule, MatIcon, MatSidenavModule,
    NgIf, CommonModule, MatButtonModule,
    MatMenuModule, MatLabel, MatFormField,
    FormsModule, MatOption, MatSelect,
    MatFormFieldModule, MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatNativeDateModule, FormsModule],
  templateUrl: './helpers.component.html',
  styleUrl: './helpers.component.scss'
})
export class HelpersComponent {

  inputOptions = {
    services: [
      'Nurse',
      'Driver',
      'Cook',
      'maid'
    ],
    orgs: [
      'Springs helpers',
      'ASBL'
    ]
  }

  constructor(private dialog: MatDialog) { }

  helpers: Helper[] = []
  filteredHelpers: Helper[] = []

  ngOnInit() {
    this.getHelpers();
  }

  getHelpers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/');
      this.helpers = response.data
      this.filteredHelpers = this.helpers
      this.selectedHelper = this.filteredHelpers?.[0]
    } catch (error) {
      console.log(error);
    }
  }

  ///// Filtering & Sorting

  openFilter = false

  sortFilter: string = 'name';
  filterVal = {
    service: '',
    org: ''
  }
  selectedDate: Date | null = null
  searchVal: string = '';

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
    const date1 = new Date(this.selectedDate as Date);
    this.filteredHelpers = this.helpers.filter(h => {
      const date2 = new Date(h.dateJoined);
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    });
    this.selectedHelper = this.filteredHelpers?.[0]
  }

  applyFilter() {
    this.filteredHelpers = this.helpers.filter((h) => {
      return h.service.includes(this.filterVal.service) && h.organization.includes(this.filterVal.org)
    })
    this.openFilter = false
  }

  resetFilter() {
    this.filterVal = {
      service: '',
      org: ''
    }
    this.filteredHelpers = this.helpers
    this.openFilter = false
  }

  handleSearchChange() {
    this.selectedDate = null
    this.filteredHelpers = this.helpers.filter((helper) => {
      return helper?.name.toLocaleLowerCase().includes(this.searchVal.toLocaleLowerCase())
    })
    if (this.sortFilter == 'ID') this.sortByID();
    if (this.sortFilter == 'name') this.sortByName();


    this.selectedHelper = this.filteredHelpers?.[0]
  }

  sortByName() {
    this.sortFilter = 'name'
    this.filteredHelpers = [...this.filteredHelpers].sort((a, b) => {
      const h1 = a['name']?.toString().toLowerCase();
      const h2 = b['name']?.toString().toLowerCase();
      return h1.localeCompare(h2);
    })
  }
  sortByID() {
    this.sortFilter = 'ID'
    this.filteredHelpers = [...this.filteredHelpers].sort((a, b) => {
      const h1 = a['employeeID']?.toString().toLowerCase();
      const h2 = b['employeeID']?.toString().toLowerCase();
      return h1.localeCompare(h2);
    })
  }

  deleteHelper() {
    const dialogRef = this.dialog.open(DeleteHelperDialog, { data: { name: this.selectedHelper.name, service: this.selectedHelper.service } })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete()
        this.helpers = this.helpers.filter((h) => {
          return h._id != this.selectedHelper._id
        })
        this.filteredHelpers = this.filteredHelpers.filter((h) => {
          return h._id != this.selectedHelper._id
        })

        this.openSnackBar(`Deleted ${this.selectedHelper.name}`);

        this.selectedHelper = this.filteredHelpers?.[0]
      }
    })
  }

  delete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/${this.selectedHelper._id}`)
    } catch (error) {
      console.log(error);
    }
  }

  selectedHelper = this.helpers?.[0]

  private _snackBar = inject(MatSnackBar);

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(CustomSnackBarComponent,
      { data: message, duration: 3000, verticalPosition: 'bottom', horizontalPosition: 'end', panelClass: ['no-default-style'] });
  }

  openEmployeeIdDialog() {
    const data = this.selectedHelper
    this.dialog.open(EmployeeIdDialogComponent, { data })
  }

  openKycDocxDialog() {
    /// 
  }

}

@Component({
  selector: 'delete-helper-dialog',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './deleteHelperDialog.html',
  styleUrl: './helpers.component.scss'
})

class DeleteHelperDialog {
  constructor(private dialogRef: MatDialogRef<DeleteHelperDialog>) { }
  readonly data = inject<{ name: string, service: string }>(MAT_DIALOG_DATA)
  delete = false

  closeDialog() {
    this.dialogRef.close()
  }

  deleteAndClose() {
    this.dialogRef.close(true);
  }
}


///////  Custom SnakBar

@Component({
  selector: 'app-custom-snack-bar',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <span class="custom-snackbar">
    <div class="message">
      <mat-icon>warning</mat-icon>
      {{ message }}
    </div>
      <mat-icon class="close">close</mat-icon>
      
    </span>
  `,
  styles: [`
    .custom-snackbar {
      background-color: white;
      color: red;
      display: flex;
      align-items: center;
      justify-content:space-between;
      padding: 8px 16px;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }
    .message{
      display: flex;
      align-items: center;
    }
    .close{
      color:black;
    }
  `],
})
export class CustomSnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public message: string) { }
}
