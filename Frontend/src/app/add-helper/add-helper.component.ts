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
import { FileInputDialogComponent } from '../file-input-dialog/file-input-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmployeeIdDialogComponent } from '../employee-id-dialog/employee-id-dialog.component';

import { ApiService } from '../api.service';

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
  ],
})
export class AddHelperComponent implements OnInit {
  constructor(private dialog: MatDialog, private router: Router,
    private api: ApiService, private fb: FormBuilder) { }


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
    ],
    languages: [
      'English',
      'Telugu',
      'Hindi',
    ],
    vehicleTypes: [
      'Auto',
      'Bike',
      'Car'
    ]
  };

  filteredServices: string[] = []

  filterServices(s: string) {
    this.filteredServices = this.inputOptions.services.filter((service) => {
      return service.toLowerCase().includes(s.toLowerCase());
    })
  }

  employeeID_QR: string = ''
  employeeID: Number | null = null

  helperData = {}

  currDate = Date.now()

  imageName = ''

  firstFormGroup!: FormGroup;

  ngOnInit(): void {
    this.filteredServices = this.inputOptions.services;

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
      kycDocx: ['', Validators.required]
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


  validate(event: KeyboardEvent): void {
    if (this.firstFormGroup.value.phone?.length == 10) return;
    const isDigit = /^[0-9]$/.test(event.key);
    if (!isDigit) {
      event.preventDefault();
    }
  }

  secondFormGroup = this.fb.group({
    additionalDocx: [[]]
  })

  imageBorder = 'dashed'
  isLinear = true;

  formSubmitted = false

  handleSubmitForm1() {
    this.formSubmitted = true
  }
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.imageBorder = 'hidden'
    if (file && file.type.startsWith('image/')) {
      this.imageName = file.name
      const reader = new FileReader();
      reader.onload = () => {
        this.firstFormGroup.get('profilePic')?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file)
    }
  }
  
  removeProfilePic() {
    this.firstFormGroup.get('profilePic')?.reset();
    this.imageBorder = 'dashed'
  }
  removeKycDocx() {
    this.firstFormGroup.get('kycDocx')?.setValue('');
    this.kycDocName = ''
  }

  /// Getter
  get selectedLanguages() {
    return this.firstFormGroup.get('languages')?.value || [];
  }

  get(key: string) {
    return this.firstFormGroup.get(key)
  }

  selectAndDeselectAllLanguages() {
    console.log(this.selectedLanguages.length, this.inputOptions.languages.length);
    console.log(this.selectedLanguages);

    const result: string[] = this.selectedLanguages.length - 1 === this.inputOptions.languages.length ? [] : this.inputOptions.languages
    this.firstFormGroup.get('languages')?.setValue(result)
    console.log(result);
    console.log(this.firstFormGroup.get('languages'));

  }

  /// Dialogs 

  kycDocName = ''

  openKycDocxDialog(): void {
    const dialogRef = this.dialog.open(FileInputDialogComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.kycDocName = result?.file?.name
        this.firstFormGroup.get('kycDocx')?.setValue(this.kycDocName);
      }
    });
  }
  additionalDocName = ''

  openAdditionalDocxDialog(): void {
    const dialogRef = this.dialog.open(FileInputDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.additionalDocName = result?.file?.name
        this.secondFormGroup.get('additionalDocx')?.setValue(result);
      }
    });
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
        data: this.helperData
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
    try {
      this.api.createHelper(this.firstFormGroup.value).subscribe((response) => {
        if (response.helper) {

          this.helperData = response.helper
          this.employeeID_QR = response.data.qr
          this.employeeID = response.data.id
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


// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { MatStepperModule } from '@angular/material/stepper';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-add-helper',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatStepperModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//   ],
//   templateUrl: './add-helper.component.html',
// })
// export class AddHelperComponent implements OnInit {
//   isLinear = true;
//   firstFormGroup!: FormGroup;
//   secondFormGroup!: FormGroup;

//   constructor(private _formBuilder: FormBuilder) { }

//   ngOnInit(): void {
//     this.firstFormGroup = this._formBuilder.group({
//       firstCtrl: ['', Validators.required],
//     });

//     this.secondFormGroup = this._formBuilder.group({
//       secondCtrl: ['', Validators.required],
//     });
//   }
// }
