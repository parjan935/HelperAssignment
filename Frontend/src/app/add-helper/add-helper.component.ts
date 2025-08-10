import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmployeeIdDialogComponent } from '../employee-id-dialog/employee-id-dialog.component';

import { ApiService } from '../api.service';
import { HelperFormComponent } from '../Reusable_Components/helper-form/helper-form.component';
import { FileInputComponentComponent } from '../Reusable_Components/file-input-component/file-input-component.component';

@Component({
  selector: 'app-add-helper',
  standalone: true,
  templateUrl: './add-helper.component.html',
  styleUrl: './add-helper.component.scss',
  imports: [
    RouterLink,
    RouterOutlet,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    NgIf,
    MatIcon,
    NgFor,
    RouterLink,
    CommonModule,
    HelperFormComponent,
    FileInputComponentComponent
  ],
})
export class AddHelperComponent implements OnInit {

  constructor(private dialog: MatDialog, private router: Router,
    private api: ApiService, private fb: FormBuilder) { }

  newHelperData = {}
  currDate = Date.now()
  firstFormGroup!: FormGroup;

  ngOnInit(): void {
    this.firstFormGroup = this.fb.group({
      name: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]],
      profilePic: [''],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
      languages: [[], Validators.required],
      service: ['', Validators.required],
      organization: ['', Validators.required],
      vehicleType: ['', Validators.required],
      vehicleNo: [''],
      kycDocx: [null, Validators.required],
      additionalDocx: [null]
    });

    this.firstFormGroup.get('vehicleType')?.valueChanges.subscribe(value => {
      const vehicleNoControl = this.firstFormGroup.get('vehicleNo');

      if (value && value !== 'None') {
        vehicleNoControl?.setValidators([Validators.required]);
      } else {
        vehicleNoControl?.clearValidators();
      }
      vehicleNoControl?.updateValueAndValidity();
    });
  }

  get(key: string) {
    return this.firstFormGroup?.get(key)
  }


  onFileChange(file: any) {
    this.get('additionalDocx')?.setValue(file?.file)
    console.log(this.get('additionalDocx')?.value);

  }
  removeSelectedFile() {
    this.get('additionalDocx')?.setValue(null)
  }

  openVerifiedDialog() {
    const dialogRef = this.dialog.open(VerifiedDialog)
    dialogRef.afterClosed().subscribe(() => {
      this.openEmployeeIdDialog()
    })
  }

  openEmployeeIdDialog(): void {
    const dialogRef = this.dialog.open(EmployeeIdDialogComponent,
      {
        data: this.newHelperData
      })
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/'])
    });
  }

  isFormGroupEmpty(formGroup: FormGroup): boolean {
    return Object.values(formGroup.controls).every(control => {
      if (control.disabled) return true;

      const value = control.value;
      return value === '' || value === null || value === undefined ||
        (Array.isArray(value) && value.length === 0);
    });
  }

  goToHome() {
    if (this.isFormGroupEmpty(this.firstFormGroup)) {
      this.router.navigate(['/'])
    }
    else {
      if (confirm('You have unsaved changes.\nAre you sure you want to go back? All progress will be lost.')) {
        this.router.navigate(['/'])
      }
    }
  }

  addHelper = async () => {

    const formData = new FormData();
    Object.entries(this.firstFormGroup.value).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'string') {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    })

    try {
      this.api.createHelper(formData).subscribe((response) => {
        if (response.helper) {

          this.newHelperData = response.helper
          this.openVerifiedDialog()
        }
        else {
          console.log(response);
        }
      })
    } catch (error) {
      console.log("error - ", error);
    }
  }

}


@Component({
  selector: "verified-dialog",
  template: `
  <div style="text-align: center;"> 
    <video src="../../assets/verified.mp4" style="width: 300px; height: 300px;" autoplay muted playsinline></video>
    <p>Tester successfully added!</p>
  </div>
  `
})

class VerifiedDialog {
  constructor(private dialog: MatDialogRef<VerifiedDialog>) { }
  ngOnInit() {
    setTimeout(() => {
      this.dialog.close()
    }, 3000)
  }
}

