import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { QuestionService } from '../question/question.service';
import { ImageService } from '../image.service';
import { Question } from '../question/question.model';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.css']
})
export class TriviaComponent implements OnInit {
  currentImageData: any = './assets/images/jackie-chan.jpg';
  question: Question = null;
  answersId: string[] = [];
  answerSelected: boolean = false;
  result: boolean = null;

  constructor(private questionService: QuestionService, private imageService: ImageService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getRandomQuestion();
  }

  getRandomQuestion() {
    this.questionService.getRandomQuestion().subscribe(
      data => {
        var textanswers = [];
        var ids = [];
        data.answers.forEach(function(item) {
          textanswers.push(item.answertext);
          ids.push(item._id);
        });
        this.answerIds = ids;
        this.question = new Question(data.question, textanswers, data.image, data._id);
        this.imageService.getImage(data.image)
        .subscribe(
          data => {
            this.currentImageData = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;charset=utf-8;base64,' + data['data']);
          }
        );
      }
    );
  }

  answerClicked(index) {
    this.questionService.getCorrectAnswer(this.question.id).subscribe(
      data => {
        if(data.data == this.answerIds[index]) {
          this.result = true;
        }
        else {
          this.result = false;
        }
        this.answerSelected = true;
      }
    );
  }

  nextQuestion() {
    this.answerSelected = false;
    this.getRandomQuestion();
  }
}
