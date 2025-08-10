import { Component, Inject, inject, Input, NgModule, OnChanges, SimpleChanges, ChangeDetectionStrategy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule, NgIf } from "@angular/common";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { FormsModule } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { EmployeeIdDialogComponent } from '../employee-id-dialog/employee-id-dialog.component';
import { MatCardModule } from '@angular/material/card'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../api.service';

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
  kycDocx: { base64File: string, mimeType: string, fileName: string };
  additionalDocx: { base64File: string, mimeType: string, fileName: string };
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
    MatNativeDateModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './helpers.component.html',
  styleUrl: './helpers.component.scss'
})


export class HelpersComponent {

  inputOptions = {
    services: [
      'Nurse',
      'Driver',
      'Cook',
      'Maid'
    ],
    orgs: [
      'Springs helpers',
      'ASBL'
    ]
  }
  openFilter = false;

  @ViewChild('popupRef') popupRef!: ElementRef;

  togglePopup(event: MouseEvent) {
    event.stopPropagation(); 
    this.openFilter = !this.openFilter;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.popupRef?.nativeElement.contains(event.target);
    if (!clickedInside && this.openFilter) {
      this.openFilter = false;
    }
  }


  constructor(private dialog: MatDialog, private api: ApiService) { }
  private _snackBar = inject(MatSnackBar);

  loadingHelpers = false

  helpers: Helper[] = []
  filteredHelpers: Helper[] = []
  selectedHelper = this.helpers?.[0]

  ngOnInit() {
    this.getHelpers();
  }

  /// Get Helpers
  getHelpers = async () => {
    this.loadingHelpers = true
    try {
      this.api.getHelpers().subscribe((response) => {
        this.helpers = response
        this.filteredHelpers = this.helpers
        this.selectedHelper = this.filteredHelpers?.[0]
      })

    } catch (error) {
      console.log(error);
    }
    this.loadingHelpers = false
  }

  ///// Filtering & Sorting
  sortFilter: string = 'name';
  selectedDate: Date | null = null
  serviceFilter: string[] = []
  organizationFilter: string[] = []
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

  handleSearchChange() {
    this.filterHelpers()
  }

  applyFilter() {
    this.filterHelpers()
  }

  resetFilter() {
    this.serviceFilter = []
    this.organizationFilter = []
    this.filterHelpers()
  }

  selectOrDeselectAll(field: string) {
    if (field == 'service') {
      if (this.serviceFilter.length - 1 === this.inputOptions.services.length) this.serviceFilter = []
      else this.serviceFilter = this.inputOptions.services
    }
    else {
      if (this.organizationFilter.length - 1 === this.inputOptions.orgs.length) this.organizationFilter = []
      else this.organizationFilter = this.inputOptions.orgs
    }
  }

  async filterHelpers() {
    this.loadingHelpers = true
    this.selectedDate = null
    this.sortFilter = 'name'
    const filter = { services: this.serviceFilter, orgs: this.organizationFilter, searchVal: this.searchVal }
    try {
      this.api.getHelpersByFilter(filter).subscribe((response) => {
        this.helpers = response
        this.filteredHelpers = this.helpers
        this.selectedHelper = this.filteredHelpers?.[0]
      })
    } catch (error) {
      console.log(error);
    }
    this.openFilter = false
    this.loadingHelpers = false
  }

  sortHelpersBy(key: 'name' | 'employeeID') {
    console.log(key);
    this.sortFilter = key;
    this.filteredHelpers = this.filteredHelpers.sort((a, b) => {
      const valA = a[key]?.toString().toLowerCase() || '';
      const valB = b[key]?.toString().toLowerCase() || '';
      return valA.localeCompare(valB);
    });
  }

  /// Delete Helper
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
      this.api.deleteHelper(this.selectedHelper._id as string).subscribe((response) => { })
    } catch (error) {
      console.log(error);
    }
  }

  /// Snackbars
  openSnackBar(message: string) {
    this._snackBar.openFromComponent(CustomSnackBarComponent,
      { data: message, duration: 3000, verticalPosition: 'bottom', horizontalPosition: 'end', panelClass: ['no-default-style'] });
  }

  /// Dialogs
  openEmployeeIdDialog() {
    const data = this.selectedHelper
    this.dialog.open(EmployeeIdDialogComponent, { data })
  }

  viewKycDocx() {
    const { base64File, mimeType, fileName } = this.selectedHelper.kycDocx
    const file = { base64File, mimeType, fileName }
    const blob = this.base64ToBlob(file.base64File, file.mimeType);
    const url = URL.createObjectURL(blob);
    window.open(url);
  }

  base64ToBlob(base64: string, mime: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
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
