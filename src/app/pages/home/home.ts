import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { SurveyList } from '../../components/survey-list/survey-list';

@Component({
  imports: [Hero, SurveyList],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
