import { Component, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  chapters = [1, 4, 7]

  /*
  1) Replace with Jesus' buttons
  */

  constructor(private tutorialService: TutorialService) { }

  ngOnInit(): void {
  }

  setChapter(myChapter: any ): void {
    this.tutorialService.setChapter(myChapter);
  }

}
