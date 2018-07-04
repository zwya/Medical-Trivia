import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { ImageService } from '../../image.service';
import { Question } from '../question.model';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {
  questionForm: FormGroup;
  public uploader:FileUploader = new FileUploader({url: "/api/image", itemAlias: 'photo'});
  currentImageData: any = './assets/images/jackie-chan.jpg';
  currentImageId = null;
  imageAdded: boolean = false;
  question: Question;
  editMode: boolean = false;

  constructor(private imageService: ImageService, private sanitizer: DomSanitizer, private questionService: QuestionService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.questionForm = new FormGroup({
      question: new FormControl('', Validators.required),
      a1: new FormControl('', Validators.required),
      a2: new FormControl('', Validators.required),
      a3: new FormControl('', Validators.required),
      a4: new FormControl('', Validators.required),
      img: new FormControl('')
    });
    this.uploader.onAfterAddingFile = (file)=> {
      file.withCredentials = false;
      if(this.uploader.queue.length == 2) {
        this.uploader.queue[0] = this.uploader.queue[1];
        this.uploader.queue.splice(1,1);
      }
    };

    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
          this.uploader.queue = [];
          this.questionForm.patchValue({
            img: ''
          });
          var json = JSON.parse(response);
          this.currentImageData = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;charset=utf-8;base64,' + json.data);
          this.currentImageId = json.obj._id;
          this.imageAdded = true;
      };

    this.uploader.onErrorItem = (item:any, reponse:any, status:any, headers: any) => {
      console.log(item, status, reponse);
    };

    this.route.params.subscribe(
      params => {
        if(params['id']) {
          this.editMode = true;
          this.questionService.getQuestionById(params['id']).subscribe(
            data => {
              this.questionForm.patchValue({
                question: data.question,
                a1: data.answers[0].answertext,
                a2: data.answers[1].answertext,
                a3: data.answers[2].answertext,
                a4: data.answers[3].answertext
              });
              this.question = new Question(data.question, [data.answers[0].answertext, data.answers[1].answertext, data.answers[2].answertext, data.answers[3].answertext], data.image, data._id);
              this.imageService.getImage(data.image)
              .subscribe(
                data => {
                  this.currentImageData = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;charset=utf-8;base64,' + data.data);
                  this.currentImageId = data.obj._id;
                }
              );
            }
          );
        }
      }
    );
  }

  onSubmit() {
    var questionFormValues = this.questionForm.value;
    if(!this.editMode) {
      this.questionService.addQuestion(new Question(questionFormValues.question, [questionFormValues.a1, questionFormValues.a2, questionFormValues.a3, questionFormValues.a4], this.currentImageId)).subscribe(
        data => {
          console.log(data);
          this.router.navigateByUrl('/question');
        }
      );
    }
    else {
      this.questionService.updateQuestion(new Question(questionFormValues.question, [questionFormValues.a1, questionFormValues.a2, questionFormValues.a3, questionFormValues.a4], this.currentImageId, this.question.id)).subscribe(
        data => {
          console.log(data);
          this.router.navigateByUrl('/question');
        }
      );
    }
  }
}
