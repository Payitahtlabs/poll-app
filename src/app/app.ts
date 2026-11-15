import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateSurveyDialog } from './components/create-survey-dialog/create-survey-dialog';
import { Header } from './components/header/header';

@Component({
  imports: [RouterOutlet, Header, CreateSurveyDialog],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
