import { Component, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.css']
})
export class ChapterComponent implements OnInit {
  lesson: any;
  chapter: any;
  buttons = [1, 4];

  /*
  1) Dynamic population for buttons
  2) Depending on user's progress, button is disabled until previous courses are finished
  3) bubbles for the following
    - Grammar
    - Vocab Recap (with section for premium's extra vocab and video of pronunciation)
    - Flash cards (premium)
    - Dialogue Conversation
    - Writing practice for Pashto
  */

  constructor(private tutorialService: TutorialService) { }

  ngOnInit(): void {
  }

  setLesson(myLesson :any ): void {
    this.tutorialService.setLesson(myLesson);
  }
}
