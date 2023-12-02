import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { DataApiService } from 'src/app/service/data-api.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongListComponent {
  @Input()
  songLists: any = [];

  @Output()
  onSongViewDetailClicked: EventEmitter<string> = new EventEmitter<string>();

  constructor(private dataApiService: DataApiService, private router: Router) {
    this.dataApiService.fetchSongs().subscribe((res) => {
      this.songLists = res;
    });
  }

  /**
   * Combine List of singers in the form of
   * eg.
   * [A] -> A
   * [A,B] -> A and B
   * [A,B,B] -> A, B and C
   * [A,B,C,D] -> A, B , C and D
   * [A,B,C,D,E,F] -> A, B, C, D, E and 1 Others
   * [A,B,C,D,E,F,G] -> A, B, C, D, E and 2 Others
   * @param valueArray
   * @returns
   */
  combineSingerList(valueArray: Array<any>) {
    return valueArray.toString();
  }

  /**
   * Emit song id to parent
   *
   * @param song - Selected song
   */
  viewDetail(song: any) {
    this.onSongViewDetailClicked.emit(song.uri);
    this.router.navigate(['/details', song?.uri]);
  }
  viewEdit(song: any) {
    this.router.navigate(['/edit', song?.uri]);
  }

  /**
   * Open form with the prefilled data and allow to update the content
   */
  editSongs() {
    // Place your logic
  }
}
