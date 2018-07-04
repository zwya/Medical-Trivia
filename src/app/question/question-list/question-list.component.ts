import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { QuestionService } from '../question.service';
import { ImageService } from '../../image.service';
import { Question } from '../question.model';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit {
  currentImageData: any = './assets/images/jackie-chan.jpg';
  private pageNumber: number;
  private limit: number;
  private hasMorePages: boolean;
  question: Question;

  constructor(private questionService: QuestionService, private imageService: ImageService, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit() {
    this.pageNumber = 1;
    this.limit = 1;
    this.getQuestion();
  }

  getQuestion() {
    this.questionService.getQuestion(this.pageNumber, this.limit).subscribe(
      data => {
        this.hasMorePages = data.has_more;
        if(data.question) {
          this.question = new Question(data.question.question, data.question.answers, data.question.image, data.question._id);
          this.imageService.getImage(data.question.image)
          .subscribe(
            data => {
              this.currentImageData = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;charset=utf-8;base64,' + data['data']);
            }
          );
        }
        else {
          this.question = null;
          this.currentImageData = './assets/images/jackie-chan.jpg';;
        }
      }
    );
  }

  nextPage() {
    this.pageNumber++;
    this.getQuestion();
  }

  previousPage() {
    this.pageNumber--;
    this.getQuestion();
  }

  editQuestion() {
    if(this.question) {
      this.router.navigateByUrl('/question/form/' + this.question.id);
    }
  }

  deleteQuestion() {
    if(this.question) {
      this.questionService.deleteQuestion(this.question.id).subscribe(
        data => {
          console.log(data);
          if(this.pageNumber == 1) {
            this.getQuestion();
          }
          else{
            this.pageNumber--;
            this.getQuestion();
          }
        }
      );
    }
  }
}
