import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular 11 Crud';
}
/*
How to add a new variable:
MongoDB- add a row with the type and data
Backend:
  Model- create class variable, update constructor, create getters and setters, update toString
  Controller- update "save" function parameters
Frontend: 
  tutorial.model.ts- update variables
  questions.component.ts- use variables in local file off of the Tutorial object
*/