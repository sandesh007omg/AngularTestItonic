import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DataApiService } from 'src/app/service/data-api.service';

@Component({
  selector: 'app-song-form',
  templateUrl: './song-form.component.html',
  styleUrls: ['./song-form.component.scss'],
})
export class SongFormComponent implements OnInit {
  songUri: string | any;
  songForm: any = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    singerList: new FormControl([]),
  });

  constructor(
    private dataApiService: DataApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.songUri = params['uri'];
      if (this.songUri) {
        // Fetch existing song data and prefill the form
        this.dataApiService.fetchSongs().subscribe((songs) => {
          const existingSong = songs.find(
            (song: any) => song.uri === this.songUri
          );
          if (existingSong) {
            this.songForm.patchValue(existingSong);
          }
        });
      }
    });
  }

  getSongForm() {
    if (this.songForm.valid) {
      const formValue = this.songForm.value;
      const newSong = {
        uri: this.songUri || 'new-song-' + Date.now(),
        name: formValue.name,
        singerList: formValue.singerList
          .split(',')
          .map((singer: string) => singer.trim()),
        type: formValue.type,
      };

      if (this.songUri) {
        // Update existing song
        this.dataApiService.updateSong(newSong).subscribe(() => {
          this.router.navigate(['/songs']); // Navigate back to the song list page
        });
      } else {
        // Add new song
        this.dataApiService.addSong(newSong).subscribe(() => {
          this.router.navigate(['/songs']); // Navigate back to the song list page
        });
      }
    }
  }
}
