import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DataApiService } from 'src/app/service/data-api.service';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedDataDialogComponent } from '../unsaved-data-dialog/unsaved-data-dialog.component';

@Component({
  selector: 'app-song-form',
  templateUrl: './song-form.component.html',
  styleUrls: ['./song-form.component.scss'],
})
export class SongFormComponent implements OnInit {
  songUri: string | any;
  songForm: any;
  isEditPage: boolean = false;

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
      }
    });
  }
  private loadExistingSongData() {
    this.dataApiService.fetchSongs().subscribe((songs) => {
      const existingSong = songs.find((song: any) => song.uri === this.songUri);
      if (existingSong) {
        this.songForm.patchValue(existingSong);
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
    return {
      uri: this.songUri || 'new-song-' + Date.now(),
      name: formValue.name,
      singerList: formValue.singerList
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
    });
  }

  showUnsavedDataDialog() {
    const dialogRef = this.dialog.open(UnsavedDataDialogComponent);
    return dialogRef.afterClosed();
  }
}
