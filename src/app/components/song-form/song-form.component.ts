import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.resetLocalStorage();
      }
    });
  }
  private prefillUnsavedData() {
    const unsavedData = getFromLocalStorage(UNSAVED_DATA);
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
  private saveFormDataToLocalStorage() {
    const formData = this.songForm.value;
    setToLocalStorage(UNSAVED_DATA,formData)
  }
  private loadExistingSongData() {
    this.dataApiService.fetchSongs().subscribe((songs) => {
      const existingSong = songs.find((song: any) => song.uri === this.songUri);
      if (existingSong) {
        const filteredData = {
          ...existingSong,
          singerList: existingSong?.singerList.join(','),
        };
        this.originalFormData = { ...filteredData };
        this.songForm.patchValue({ ...filteredData });
      }
    });
  }
  getSongForm() {
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
    const payload = {
      uri: this.songUri || 'new-song-' + Date.now(),
      name: formValue.name,
      singerList: formValue.singerList
        .split(',')
        .map((singer: string) => singer.trim()),
      type: formValue.type,
    };
    return { ...payload };
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
    setToLocalStorage(UNSAVED_DATA,this.songForm)
  }
  onCancel(): void {
    if (this.isEditPage) {
      this.songForm.patchValue(this.originalFormData);
      setToLocalStorage(UNSAVED_DATA,{})
      return;
    }
    this.resetForm();
  }
  private resetLocalStorage() {
    localStorage.removeItem(UNSAVED_DATA);
  }
  ngOnDestroy() {
    this.formChangeSubscription.unsubscribe();
  }
}

export const UNSAVED_DATA = 'UNSAVED_DATA';

export const setToLocalStorage = (param:string,data:any) =>{
  localStorage.setItem(param, JSON.stringify(data));
}
export const getFromLocalStorage =(param:string) =>{
  const result = localStorage.getItem(param);
  return result ? JSON.parse(result) : null;
}
