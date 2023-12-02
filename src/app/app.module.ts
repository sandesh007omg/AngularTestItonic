import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SongListComponent } from './components/song-list/song-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SongsComponent } from './components/songs/songs.component';
import { SongFormComponent } from './components/song-form/song-form.component';
import { SongDetailsComponent } from './components/song-details/song-details.component';
import { UnsavedDataDialogComponent } from './components/unsaved-data-dialog/unsaved-data-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    SongListComponent,
    SongsComponent,
    SongFormComponent,
    SongDetailsComponent,
    UnsavedDataDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
