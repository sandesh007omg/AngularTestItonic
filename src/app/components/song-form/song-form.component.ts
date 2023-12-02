import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataApiService } from 'src/app/service/data-api.service';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedDataDialogComponent } from '../unsaved-data-dialog/unsaved-data-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-song-form',
  templateUrl: './song-form.component.html',
  styleUrls: ['./song-form.component.scss'],
})
export class SongFormComponent implements OnInit, OnDestroy {
  songUri: string | any;
  songForm: any;
  isEditPage: boolean = false;
  formChangeSubscription!: Subscription;
  originalFormData: any;

  constructor(
    private dataApiService: DataApiService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.songForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      singerList: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.songUri = params?.id;
      if (this.songUri) {
        this.isEditPage = true;
        this.loadExistingSongData();
      } else {
        this.prefillUnsavedData();
      }
    });
    this.formChangeSubscription = this.songForm.valueChanges.subscribe(() => {
      this.saveFormDataToLocalStorage();
    });
  }
  private prefillUnsavedData() {
    const unsavedData = this.getUnsavedFormData();
    const hasUnsavedData = Object.keys(unsavedData).some(
      (property) => unsavedData?.[property]?.length > 0
    );
    if (hasUnsavedData) {
      this.showUnsavedDataDialog().subscribe((result) => {
        if (result === true) {
          this.songForm.patchValue(unsavedData);
        }
      });
    }
  }
  private getUnsavedFormData(): any {
    const unsavedData = localStorage.getItem('unsavedFormData');
    return unsavedData ? JSON.parse(unsavedData) : null;
  }
  private saveFormDataToLocalStorage() {
    const formData = this.songForm.value;
    localStorage.setItem('unsavedFormData', JSON.stringify(formData));
  }
  private loadExistingSongData() {
    this.dataApiService.fetchSongs().subscribe((songs) => {
      const existingSong = songs.find((song: any) => song.uri === this.songUri);
      if (existingSong) {
        this.originalFormData = { ...existingSong };
        this.songForm.patchValue(existingSong);
      }
    });
  }
  getSongForm() {
    debugger;
    this.markFormControlsAsTouched();
    if (this.songForm.valid) {
      const newSong = this.createSongObject();
      this.saveSong(newSong);
    }
  }
  private markFormControlsAsTouched() {
    Object.keys(this.songForm.controls)?.forEach((controlName) => {
      const control = this.songForm.get(controlName);
      if (control) {
        control.markAsTouched();
      }
    });
  }
  private createSongObject() {
    const formValue = this.songForm.value;
    debugger;
    return {
      uri: this.songUri || 'new-song-' + Date.now(),
      name: formValue.name,
      singerList: this.isEditPage
        ? formValue.singerList
        : formValue.singerList
            .split(',')
            .map((singer: string) => singer.trim()),
      type: formValue.type,
    };
  }
  private saveSong(song: any) {
    const operation = this.songUri
      ? this.dataApiService.updateSong(song)
      : this.dataApiService.addSong(song);

    operation.subscribe(() => {
      this.router.navigate(['/songs']);
      this.resetForm();
    });
  }

  showUnsavedDataDialog() {
    const dialogRef = this.dialog.open(UnsavedDataDialogComponent);
    return dialogRef.afterClosed();
  }
  private resetForm() {
    this.songForm.reset();
    localStorage.setItem('unsavedFormData', JSON.stringify(this.songForm));
  }
  onCancel(): void {
    if (this.isEditPage) {
      this.songForm.patchValue(this.originalFormData);
      return;
    }
    this.resetForm();
  }
  ngOnDestroy() {
    this.formChangeSubscription.unsubscribe();
  }
}
