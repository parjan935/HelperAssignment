import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
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
import axios from 'axios';
import { EmployeeIdDialogComponent } from '../employee-id-dialog/employee-id-dialog.component';


@Component({
  selector: 'app-add-helper',
  standalone: true,
  templateUrl: './add-helper.component.html',
  styleUrl: './add-helper.component.scss',
  imports: [RouterLink, RouterOutlet, MatButtonModule,
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

  inputOptions = {
    services: [
      'Nurse',
      'Driver',
      'Cook',
      'maid'
    ],
    orgs: [
      'springs helpers',
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

  currDate = Date.now()

  imageName = ''

  firstFormGroup!: FormGroup;

  ngOnInit(): void {
    this.filteredServices = this.inputOptions.services
    this.firstFormGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      profilePic: new FormControl(''),
      gender: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^[6-9][0-9]{9}$")]),
      languages: new FormControl([], [Validators.required]),
      service: new FormControl('', [Validators.required]),
      organization: new FormControl('', [Validators.required]),
      vehicleType: new FormControl('', [Validators.required]),
      vehicleNo: new FormControl(''),
      kycDocx: new FormControl('', [Validators.required])
    });

    this.firstFormGroup.get('vehicleType')!.valueChanges.subscribe(value => {
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

  secondFormGroup = new FormGroup({
    additionalDocx: new FormControl({}),
  });

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

  /// Getters
  get(key: string) {
    return this.firstFormGroup.get(key)
  }
  get selectedLanguages() {
    return this.firstFormGroup.get('languages')?.value || [];
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
  constructor(private dialog: MatDialog, private router: Router) { }

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
        data: {
          name: this.firstFormGroup.get('name')?.value,
          id: this.employeeID,
          service: this.firstFormGroup.get('service')?.value,
          QrUrl: this.employeeID_QR
        }
      })
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/'])
    });
  }


  addHelper = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/', this.firstFormGroup.value)

      if (response.statusText === "OK") {
        this.employeeID_QR = response.data.qr
        this.employeeID = response.data.id
        this.openVerifiedDialog()
      }
      else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log("error - ", error);
    }
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