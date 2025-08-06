import { Component, inject, Input, NgModule, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from "@angular/material/icon";
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule, NgIf } from "@angular/common";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import axios from 'axios';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import {MatSnackBar} from '@angular/material/snack-bar';
import { endWith } from 'rxjs';


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
  dateJoined: Date
}


@Component({
  selector: 'app-helpers',
  standalone: true,
  imports: [RouterLink, RouterOutlet
    , MatToolbarModule, MatIcon, MatSidenavModule,
    NgIf, CommonModule, MatButtonModule,
    MatMenuModule, MatLabel, MatFormField,
    FormsModule, MatOption, MatSelect],
  templateUrl: './helpers.component.html',
  styleUrl: './helpers.component.scss'
})
export class HelpersComponent {

  constructor(private dialog: MatDialog) { }

  helpers: Helper[] = []

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

  filteredHelpers = this.helpers

  searchVal: string = '';

  handleSearchChange() {
    console.log(this.searchVal);
    this.sortFilter = ''
    this.filteredHelpers = this.helpers.filter((helper) => {
      return helper?.name.toLocaleLowerCase().includes(this.searchVal.toLocaleLowerCase())
    })
  }

  deleteHelper() {
    const dialogRef = this.dialog.open(DeleteHelperDialog, { data: { name: this.selectedHelper.name, service: this.selectedHelper.service } })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete()
        this.helpers = this.helpers.filter((h) => {
          return h.name != this.selectedHelper.name
        })
        this.filteredHelpers = this.filteredHelpers.filter((h) => {
          return h.name != this.selectedHelper.name
        })

        this.selectedHelper = this.filteredHelpers?.[0]
      }
      this.openSnackBar(`Deleted ${this.selectedHelper.name}`,"X");
    })
  }
  delete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/${this.selectedHelper._id}`)
    } catch (error) {
      console.log(error);
    }
  }

  sortFilter = '';
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

  selectedHelper = this.helpers?.[0]



  private _snackBar = inject(MatSnackBar);


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{duration:3000,verticalPosition:'bottom',horizontalPosition:'end'});
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
