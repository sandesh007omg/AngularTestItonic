import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-unsaved-data-dialog',
  template: `
    <h1 mat-dialog-title>Unsaved Data Detected</h1>
    <mat-dialog-content>
      <p>Do you want to load the previously unsaved data?</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="dialogRef.close(true)">Yes</button>
      <button mat-button (click)="dialogRef.close(false)">No</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./unsaved-data-dialog.component.scss'],
})
export class UnsavedDataDialogComponent {
  constructor(public dialogRef: MatDialogRef<UnsavedDataDialogComponent>) {}
}
