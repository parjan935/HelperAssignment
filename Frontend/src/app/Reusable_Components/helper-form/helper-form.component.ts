import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileInputDialogComponent } from '../../file-input-dialog/file-input-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-helper-form',
  standalone: true,
  imports: [],
  templateUrl: './helper-form.component.html',
  styleUrl: './helper-form.component.scss'
})
export class HelperFormComponent {
  constructor(private dialog: MatDialog) { }

  @Input() firstFormGroup: FormGroup | null = null

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
  kycDocName = ''
  imageBorder = 'dashed'
  formSubmitted = false
  filteredServices: string[] = []

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
  removeKycDocx() {
    this.firstFormGroup?.get('kycDocx')?.setValue('');
    this.kycDocName = ''
  }

  handleSubmitForm1() {
    this.formSubmitted = true
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

  openKycDocxDialog(): void {
    const dialogRef = this.dialog.open(FileInputDialogComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.kycDocName = result?.file?.name
        // this.firstFormGroup?.get('kycDocx')?.setValue(result?.file);
      }
    });
  }

}
