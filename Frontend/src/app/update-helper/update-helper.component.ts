import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { NgFor, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import axios from 'axios';

interface Helper {
  name: string;
  email: string;
  profilePic: string;
  gender: string;
  phone: string;
  languages: string[];
  service: string;
  organization: string;
  vechileType: string;
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
    MatSidenavModule
  ],
  templateUrl: './update-helper.component.html',
  styleUrl: './update-helper.component.scss'
})

export class UpdateHelperComponent {

  inputOptions = {
    services: [
      'Nurse',
      'Driver',
      'Cook',
      'maid'
    ],
    orgs: [
      'string helpers',
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
  firstFormGroup = new FormGroup({});

  selected: 'helperDetails' | 'helperDocuments' = 'helperDetails';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const helperID = this.route.snapshot.paramMap.get('helperID') as string
    this.getUser(helperID);
  }

  private getUser = async (helperID: string) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/${helperID}`)
      this.helper = response.data

      this.firstFormGroup.addControl('name', new FormControl(this.helper.name, [Validators.required]));
      this.firstFormGroup.addControl('email',
        new FormControl(this.helper.email, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ])
      );
      this.firstFormGroup.addControl('service', new FormControl(this.helper.service, [Validators.required]));
      this.firstFormGroup.addControl('profilePic', new FormControl(this.helper.profilePic));
      this.firstFormGroup.addControl('gender', new FormControl(this.helper.gender, [Validators.required]));
      this.firstFormGroup.addControl('phone', new FormControl(this.helper.phone, [Validators.required]));
      this.firstFormGroup.addControl('languages', new FormControl(this.helper.languages, [Validators.required]));
      this.firstFormGroup.addControl('organization', new FormControl(this.helper.organization, [Validators.required]));
      this.firstFormGroup.addControl('vechileType', new FormControl(this.helper.vechileType, [Validators.required]));
      this.firstFormGroup.addControl('kycDocx', new FormControl(this.helper.kycDocx, [Validators.required]));

    } catch (error) {
      console.log(error);
    }
  }

  imageBorder = 'dashed'

  formSubmitted = false


  updateHelper() {
    this.formSubmitted = true
    console.log(this.firstFormGroup.value);
  }

  get(key: string) {
    return this.firstFormGroup.get(key)
  }

  imageName = ''
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.imageBorder = 'hidden'
    if (file && file.type.startsWith('image/')) {
      this.imageName = file.name
      const reader = new FileReader();
      reader.onload = () => {
        // this.firstFormGroup.get('profilePic')?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file)
    }
  }

  get selectedLanguages() {
    
    return this.firstFormGroup.get('languages')?.value || [];
  }
}
