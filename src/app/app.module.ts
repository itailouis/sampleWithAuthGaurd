import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { fakeBackendProvider } from './_helpers/fake-backend-intercepter.provider';
import { ErrorInterceptor } from './_helpers/error.interceptor';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { PublicPageComponent } from './home/public-page/public-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    PublicPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
