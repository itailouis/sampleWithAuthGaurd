import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home/home-page/home-page.component';
import { PublicPageComponent } from './home/public-page/public-page.component';
import { AuthGuardGuard } from './utils/auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate:[AuthGuardGuard]

  },
  {
    path: 'public',
    component: PublicPageComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
