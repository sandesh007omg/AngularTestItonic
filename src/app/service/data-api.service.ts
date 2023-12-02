import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { songsCollection } from '../mockData/songs';

@Injectable({
  providedIn: 'root',
})
export class DataApiService {
  // Cache the songs list
  private allSongs = songsCollection;
  private songListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );

  constructor() {}

  /**
   * Get list of songs
   *
   * @returns
   */
  public fetchSongs(): Observable<any> {
    return of(this.allSongs);
  }

  /**
   * Get list of the songs based on song name
   *
   * @param songName
   * @returns
   */
  public getList(): Observable<any> {
    this.allSongs = songsCollection;
    return of(this.allSongs);
  }
  public setSongList(list: any[]): void {
    this.allSongs = list;
    this.songListSubject.next(list);
  }

  public getSongsByName(songName: string): Observable<any> {
    const songs = this.allSongs.filter((song) => song.name.includes(songName));
    return new Observable((observer) => {
      observer.next(songs);
    });
  }

  public addSong(newSong: any): Observable<any> {
    this.allSongs.push(newSong);
    return of(this.allSongs);
  }

  public updateSong(updatedSong: any): Observable<any> {
    const index = this.allSongs.findIndex(
      (song) => song.uri === updatedSong.uri
    );
    if (index !== -1) {
      this.allSongs[index] = updatedSong;
    }
    return of(this.allSongs);
  }
}
