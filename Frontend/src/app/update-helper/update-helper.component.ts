import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
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
  vehicleNo?: string;
  kycDocx: { base64File: string, mimeType: string, fileName: string } | File;
  additionalDocx: { base64File: string, mimeType: string, fileName: string } | File;
  employeeID: number;
  employeeId_QR: string;
  dateJoined: Date;
}

@Component({
  selector: 'app-update-helper',
  standalone: true,
  templateUrl: './update-helper.component.html',
  styleUrl: './update-helper.component.scss',
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
export class UpdateHelperComponent implements OnInit {

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private router: Router,
    private api: ApiService, private fb: FormBuilder) { }

  helper!: Helper
  currDate = Date.now()
  firstFormGroup!: FormGroup;
  loadingHelper = false
  helperID: string = ''

  opened = 'helperDetails'

  ngOnInit(): void {
    this.loadingHelper = true
    this.helperID = this.route.snapshot.paramMap.get('helperID') as string
    this.getHelper(this.helperID);
  }

  getHelper(id: string) {
    try {
      this.api.getHelperByID(id).subscribe((response) => {
        this.helper = response
        this.populateHelperData()
      })
    } catch (error) {
      console.log(error);
    }
  }

  populateHelperData() {
    this.firstFormGroup = this.fb.group({
      name: [this.helper?.name, Validators.required],
      email: [this.helper?.email, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]],
      service: [this.helper.service, Validators.required],
      profilePic: [this.helper.profilePic as string],
      gender: [this.helper.gender, Validators.required],
      phone: [this.helper.phone, Validators.required],
      languages: [this.helper.languages, Validators.required],
      organization: [this.helper.organization, Validators.required],
      vehicleType: [this.helper.vehicleType, Validators.required],
      vehicleNo: [this.helper.vehicleNo],
      kycDocx: [this.helper.kycDocx, Validators.required],
      additionalDocx: [this.helper.additionalDocx]
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

    this.loadingHelper = false
  }


  get(key: string) {
    return this.firstFormGroup?.get(key)
  }


  additionalDocChanged = false

  onFileChange(file: any) {
    this.additionalDocChanged = true
    this.get('additionalDocx')?.reset()
    this.get('additionalDocx')?.setValue(file?.file)
  }
  removeSelectedFile() {
    this.get('additionalDocx')?.setValue(null)
  }

  goToHome() {
    if (confirm('Are you sure you want to go back? All progress will be lost.')) {
      this.router.navigate(['/'])
    }
  }


  updateHelper = async () => {
    try {
      if (this.firstFormGroup.get('kycDocx')?.value?.base64File) this.firstFormGroup.removeControl('kycDocx');
      if (!this.additionalDocChanged) this.firstFormGroup.removeControl('additionalDocx');
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
      this.api.updateHelper(formData, this.helperID).subscribe((response) => {
        alert('Helper update successfull')
        this.router.navigate(['/'])
      })
    } catch (error) {
      console.log(error);
    }
  }

}
