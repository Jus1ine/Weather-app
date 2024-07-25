import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WeatherService } from './weather.service'; // Import the WeatherService

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,          // Add FormsModule to imports array
    HttpClientModule
  ],
  providers: [WeatherService], // Add WeatherService to providers
  bootstrap: [AppComponent]
})
export class AppModule { }
