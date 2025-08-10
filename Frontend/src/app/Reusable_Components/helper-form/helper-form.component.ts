import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileInputDialogComponent } from '../../file-input-dialog/file-input-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FileInputComponentComponent } from '../file-input-component/file-input-component.component';

@Component({
  selector: 'app-helper-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    NgIf,
    MatIcon,
    NgFor,
    RouterLink,
    CommonModule,
    FileInputComponentComponent],
  templateUrl: './helper-form.component.html',
  styleUrl: './helper-form.component.scss'
})
export class HelperFormComponent {

  @Input() usedFor!: string
  @Input() firstFormGroup!: FormGroup
  @Output() formValid = new EventEmitter<void>()

  constructor(private dialog: MatDialog) { }

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

  imageBorder = 'dashed'
  formSubmitted = false
  filteredServices: string[] = this.inputOptions.services

  filterServices(s: string) {
    this.filteredServices = this.inputOptions.services.filter((service) => {
      return service.toLowerCase().includes(s.toLowerCase());
    })
  }

  get(key: string) {
    return this.firstFormGroup?.get(key)
  }
  get selectedLanguages() {
    return this.firstFormGroup?.get('languages')?.value || [];
  }


  validate(event: KeyboardEvent): void {
    if (this.firstFormGroup?.value.phone?.length == 10) return;
    const isDigit = /^[0-9]$/.test(event.key);
    if (!isDigit) {
      event.preventDefault();
    }
  }

  removeProfilePic() {
    this.firstFormGroup?.get('profilePic')?.reset();
    this.imageBorder = 'dashed'
  }
  handleSubmitForm1() {
    this.formSubmitted = true

    if (this.firstFormGroup.valid) {
      this.formValid.emit();
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.imageBorder = 'hidden'
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.firstFormGroup?.get('profilePic')?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file)
    }
  }

  selectAndDeselectAllLanguages() {
    const result: string[] = this.selectedLanguages.length - 1 === this.inputOptions.languages.length ? [] : this.inputOptions.languages
    this.firstFormGroup?.get('languages')?.setValue(result)
  }

  onFileChange(file: any) {
    this.firstFormGroup?.get('kycDocx')?.setValue(file.file)
  }

  removeSelectedFile() {
    this.firstFormGroup?.get('kycDocx')?.setValue(null)
  }

}
