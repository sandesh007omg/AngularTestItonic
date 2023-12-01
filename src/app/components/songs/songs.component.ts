import { Component } from '@angular/core';
import { DataApiService } from 'src/app/service/data-api.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent {
  songLists: any = [];
  searchText = '';

  selectedSong: any;

  constructor(private dataApiService: DataApiService) {
    this.dataApiService.fetchSongs().subscribe((res) => {
      this.songLists = res;
    });
  }

  /**
   * Search songs based on the song name
   *
   * @param name - Name of the song
   */
  searchSongs(name: string) {
    this.dataApiService.getSongsByName(name).subscribe((res) => {
      this.songLists = res;
    });
  }

  /**
   * Show song detail
   *
   * @param songId
   */
  showDetails(songId: string) {
    this.selectedSong = this.songLists.find((song: any) => song.uri === songId);
  }

  /**
   * Change the selected song into the metal
   */
  changeSongToMetal() {
    this.selectedSong.type = 'metal';

    // FIXME Weird behavior, type get updated in the songs list but it is not reflected in the table
    console.log(this.songLists);
  }
}
