import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataApiService } from 'src/app/service/data-api.service';

@Component({
  selector: 'app-song-details',
  templateUrl: './song-details.component.html',
  styleUrls: ['./song-details.component.scss'],
})
export class SongDetailsComponent {
  songId: string | null = null;
  selectedSong: any = [];
  constructor(
    private dataApiService: DataApiService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.songId = params.get('id');
      if (this.songId) {
        this.loadSongDetails();
      }
    });
  }
  loadSongDetails() {
    this.dataApiService.fetchSongs().subscribe((res) => {
      this.selectedSong = res?.find((song: any) => song.uri === this.songId);
    });
  }
  changeSongToMetal() {
    this.selectedSong.type = 'metal';

    // // FIXME Weird behavior, type get updated in the songs list but it is not reflected in the table
  }
}
