import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongListComponent } from './components/song-list/song-list.component';
import { SongFormComponent } from './components/song-form/song-form.component';
import { SongDetailsComponent } from './components/song-details/song-details.component';

const routes: Routes = [
  { path: 'songs', component: SongListComponent },
  { path: 'edit/:id', component: SongFormComponent },
  { path: 'create', component: SongFormComponent },
  { path: 'details/:id', component: SongDetailsComponent },
  { path: '', redirectTo: '/songs', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
