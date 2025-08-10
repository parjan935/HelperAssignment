import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { NgFor, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import axios from 'axios';
import { FileInputComponentComponent } from '../Reusable_Components/file-input-component/file-input-component.component';

interface Helper {
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
}

@Component({
  selector: 'app-update-helper',
  standalone: true,
  imports: [RouterLink, RouterOutlet, MatButtonModule,
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
    MatSidenavModule,
    MatProgressSpinnerModule,
    FileInputComponentComponent
  ],
  templateUrl: './update-helper.component.html',
  styleUrl: './update-helper.component.scss'
})

export class UpdateHelperComponent {

  helperLoading = false;


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


  helper: Helper = {} as Helper;
  firstFormGroup!: FormGroup
  profilePicUrl = ''

  selected: 'helperDetails' | 'helperDocuments' = 'helperDetails';

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder) { }
  helperID: string = ''
  ngOnInit() {
    this.helperLoading = true;
    this.helperID = this.route.snapshot.paramMap.get('helperID') as string
    this.getUser();
  }

  private getUser = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/${this.helperID}`)
      this.helper = response.data
      this.firstFormGroup = this.fb.group({
        name: [this.helper.name, Validators.required],
        email: [this.helper.email, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ]],
        service: [this.helper.service, Validators.required],
        profilePic: [this.helper.profilePic as string], // no validators
        gender: [this.helper.gender, Validators.required],
        phone: [this.helper.phone, Validators.required],
        languages: [this.helper.languages, Validators.required],
        organization: [this.helper.organization, Validators.required],
        vehicleType: [this.helper.vehicleType, Validators.required],
        kycDocx: [this.helper.kycDocx, Validators.required]
      });
      this.profilePicUrl = this.helper.profilePic

    } catch (error) {
      console.log(error);
    }

    this.helperLoading = false
  }

  imageBorder = 'dashed'

  formSubmitted = false


  updateHelper = async () => {
    this.formSubmitted = true
    try {
      const response = await axios.put(`http://localhost:4000/api/${this.helperID}`, this.firstFormGroup?.value)
      alert('Helper update successfull')
      this.router.navigate(['/'])
    } catch (error) {
      console.log(error);
    }

  }
  get(key: string) {
    return this.firstFormGroup.get(key)
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.imageBorder = 'hidden'
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicUrl = reader.result as string
        this.firstFormGroup.get('profilePic')?.setValue(reader.result as never);
      };
      reader.readAsDataURL(file)
    }
  }

  removeProfilePic() {
    this.firstFormGroup.get('profilePic')?.reset();
    this.profilePicUrl = ''
    this.imageBorder = 'dashed'

  }

  get selectedLanguages() {
    return this.firstFormGroup.get('languages')?.value || [];
  }
}
