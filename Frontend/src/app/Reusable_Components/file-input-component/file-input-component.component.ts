import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileInputDialogComponent } from '../../file-input-dialog/file-input-dialog.component';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-file-input-component',
  standalone: true,
  imports: [NgIf, MatButtonModule, MatIcon, NgFor],
  templateUrl: './file-input-component.component.html',
  styleUrl: './file-input-component.component.scss'
})
export class FileInputComponentComponent {

  constructor(private dialog: MatDialog) { }

  @Input() type: string = ''
  @Input() files: File[] = []
  @Output() fileSelected = new EventEmitter<File>();
  @Output() removeFile = new EventEmitter<void>();

  DocNames: string[] = []

  ngOnInit() {
    for (let i = 0; i < this.files.length; i++) {
      const fName = this.files[i]?.name
      if (fName) this.DocNames.push(fName)
    }
  }


  opeDocxInputDialog(): void {
    const dialogRef = this.dialog.open(FileInputDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.DocNames.push(result?.file?.name)
        this.fileSelected.emit(result?.file)
      }
    });
  }

  removeKycDocx(index: number) {
    this.DocNames.splice(index, 1)
    this.removeFile.emit()
  }
}
