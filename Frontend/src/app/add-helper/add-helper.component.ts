import { Component } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import axios from 'axios';


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
export class AddHelperComponent {

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

  currDate=Date.now()

  imageName = ''

  firstFormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    profilePic: new FormControl(''),
    gender: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    languages: new FormControl([], [Validators.required]),
    service: new FormControl('', [Validators.required]),
    organization: new FormControl('', [Validators.required]),
    vehicleType: new FormControl('', [Validators.required]),
    kycDocx: new FormControl('', [Validators.required])
  });

  secondFormGroup = new FormGroup({
    additionalDocx: new FormControl({}),
  });

  imageBorder = 'dashed'
  isLinear = true;

  formSubmitted = false

  handleSubmitForm1() {
    this.formSubmitted = true
  }

  get(key: string) {
    return this.firstFormGroup.get(key)
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

  get selectedLanguages() {
    return this.firstFormGroup.get('languages')?.value || [];
  }

  constructor(private dialog: MatDialog, private router: Router) { }

  kycDocName = ''

  openKycDocxDialog(): void {
    const dialogRef = this.dialog.open(FileInputDialogComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if (result !== undefined) {
        this.kycDocName = result?.file?.name
        // this.firstFormGroup.get('kycDocx')?.setValue(result);
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

  addHelper = async () => {
    console.log(this.firstFormGroup.value);
    try {
      const response = await axios.post('http://localhost:4000/api/', this.firstFormGroup.value)
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    this.router.navigate(['/'])
  }
}