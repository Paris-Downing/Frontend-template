import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';
import { CommonModule } from '@angular/common';  
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate(2000, style({opacity: 1}))
      ]) 
    ])
  ]
})
export class QuestionsComponent implements OnInit {
  currentQuestion: number = 0;
  tutorials?: Tutorial[] = [];
  questionText?: string;
  answerText?: string = '';
  currentQuestionType?: number = 1;
  textbox1?: string = '';
  sampleString: string = '$co#mo es$tas#, mi a$mi#go?';
  alertType: string = "alert-success";  //success, warning, danger
  alertMessage: string = "That's correct!";
  showAlert: boolean = false;
  incorrectQuestions: number[] = [];
  isLoaded: boolean = false;
  textboxLocked: boolean = false;
  endOfLesson: boolean = false;

  escapedCharacters = [' ', ',', '.', '?'];

  /*
  TO-DO!!!
  1) Add variable to act as a checkpoint for the queue
  2) Accept multiple correct answers
  3) Questions and answers w/ Arabic script
  4) fix side overline
  5) Should I make each word look-able up-able?
  */

  constructor(private tutorialService: TutorialService) { }

  ngOnInit(): void {
    this.parseTones();
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    this.tutorialService.get(1)
      .subscribe(
        data => {
          this.tutorials = data;
          this.isLoaded = true;
          this.nextQuestion();
          // console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  //formats the text so pitch can be marked
  //returns answer text without $ and #
  parseTones(): string {
    let myReturn = this.sampleString.replace(/\$/gi,"");
    myReturn = this.sampleString.replace(/\#/gi,"");


    // $co#mo
    // <o></o><u>co</u><o>mo</u>
    // <span style='text-decoration: overline;'>
    this.sampleString = this.sampleString.replace(/\$/gi,"</u><span>"); //start of high pitch
    this.sampleString = this.sampleString.replace(/\#/gi,"</span><u>"); //start of low pitch
    this.escapedCharacters.forEach((escChar) => {
      var re = new RegExp(`\\${escChar}`,"gi");
      this.sampleString = this.sampleString.replace(re, `</u>${escChar}<u>`)
    }) 
    this.sampleString = "<u>" + this.sampleString + "</u>";
    return myReturn; 
  }

  checkAnswer(): number {
    //1) Removes punctuation
    let modifiedSentence1 = this.answerText?.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g,"");
    let modifiedSentence2 = this.textbox1?.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g,"");

    //2) Removes capitalization
    modifiedSentence1 = modifiedSentence1?.toLowerCase();
    modifiedSentence2 = modifiedSentence2?.toLowerCase();

    if((modifiedSentence1 === undefined) || (modifiedSentence2 === undefined))
      return 100;

    //3) Removes extra spacing
    const sentence1 = modifiedSentence1.replace(/  +/g, ' ');
    const sentence2 = modifiedSentence2.replace(/  +/g, ' ');

    //4) Accepts 1 missing letter, 1 extra letter, 1 incorrect letter 
    return this.checkSentence(sentence1, sentence2, 1); 
  }

  checkSentence(sentence1: string, sentence2: string, mistakesAllowed: number): number {
    if(sentence1.length === sentence2.length)
    {
      if(sentence1 === sentence2) { 
        // console.log("ERROR TYPE 1"); //both sentences are the same
        return 0; 
      } else {
        for(let i = 0; i < sentence1.length; i++) { 
          if(sentence1.charAt(i) != sentence2.charAt(i)) { 
              mistakesAllowed--; 
              if(mistakesAllowed < 0) { 
                // console.log("ERROR TYPE 2");  //a word had at least 2 wrong letters
                  return 1; 
              }
          }
        }
        // console.log("ERROR TYPE 3"); //a letter was typed wrong/without an accent
        return .5;
      }
    } else if ((sentence1.length + 1 === sentence2.length) || (sentence2.length + 1 === sentence1.length)) {
        for(let i = 0, j = 0; i < sentence1.length || j < sentence2.length; i++, j++) { 
          if(sentence1.charAt(i) != sentence2.charAt(i)) { 
              mistakesAllowed--; 
              if(mistakesAllowed < 0) { 
                  // console.log("ERROR TYPE 4");  //there were too many extra or missing letters
                  return 1; 
              }
              if(sentence1.length + 1 === sentence2.length) {
                j++;
              } else { 
                i++; 
              }
          }
        }
      // console.log("ERROR TYPE 5");
      return .5;  //there was only one missing or extra letter
    } else {
      // console.log("ERROR TYPE 6");  //the words didn't match at all
      return 1;
    }
  }

  verifyAnswer(): void {
    this.textboxLocked = true;
    let amountOfMistakes = this.checkAnswer();
    this.showAlert = true;  //set to false when continue button is pressed
    if (amountOfMistakes >= 1) {
      this.alertType = "alert-danger";
      this.alertMessage = "Incorrect!";
      this.incorrectQuestions.unshift(this.currentQuestion);
    } else if (amountOfMistakes > 0) {
      this.alertType = "alert-warning";
      this.alertMessage = "Correct!"
    } else {
      this.alertType = "alert-success";
      this.alertMessage = "Correct!"
    }
    
    // this.nextQuestion();
  }

  nextQuestion(): void {
    this.textbox1 = '';
    this.textboxLocked = false;
    this.showAlert = false;
    let text = new Tutorial();
    console.log("TUROTIRALSDF:SD:", this.tutorials);
    console.log("PRASHNNN", this.incorrectQuestions);
    console.log("CUURRR", this.currentQuestion);

    //decides what the next question is
    if(this.tutorials !== undefined) {
      // 1. question exists, show it
      if(this.tutorials[this.currentQuestion] !== undefined) 
        text = this.tutorials[this.currentQuestion];

      // 2. if new question doesn't exist, check incorrect question
      else if(this.incorrectQuestions.length > 0) {
        const currQ = this.incorrectQuestions.pop();  
        if(currQ !== undefined)
          text = this.tutorials[currQ];
      }

      // 3. if both new and incorrect question doesn't exist, show end
      else 
        this.endOfLesson = true;


      //sets the questionText, answerText, and questionType for current question
      this.questionText = text.question !== undefined? text.question: '';

      // if(text.answers !== undefined) {
        this.answerText = text.answers;
        // this.checkAnswer(); 
      // }

      // if(text.questionType !== undefined) {
        this.currentQuestionType = text.questionType;
      // }
    }
    //gets the index of the current question
    this.currentQuestion++;
}
    








}
