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
  public uploader:FileUploader = new FileUploader({url: "/api/image", itemAlias: 'photo', authTokenHeader: 'authorization', authToken: localStorage.getItem('token') ? localStorage.getItem('token') : ''});
  imageAdded: boolean = false;
  question: Question;
  editMode: boolean = false;
  url: any = './assets/images/jackie-chan.jpg';

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
          var json = JSON.parse(response);
          var questionFormValues = this.questionForm.value;
          if(!this.editMode) {
            this.questionService.addQuestion(new Question(questionFormValues.question, [questionFormValues.a1, questionFormValues.a2, questionFormValues.a3, questionFormValues.a4], json.obj._id)).subscribe(
              data => {
                console.log(data);
                this.router.navigateByUrl('/question');
              }
            );
          }
          else {
            this.questionService.updateQuestion(new Question(questionFormValues.question, [questionFormValues.a1, questionFormValues.a2, questionFormValues.a3, questionFormValues.a4], json.obj._id, this.question.id)).subscribe(
              data => {
                console.log(data);
                this.router.navigateByUrl('/question');
              }
            );
          }
      };

    this.uploader.onErrorItem = (item:any, response:any, status:any, headers: any) => {
      console.log(item, status, response);
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
                  this.url = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;charset=utf-8;base64,' + data['data']);
                }
              );
            }
          );
        }
      }
    );
  }

  onSubmit() {
    this.uploader.uploadAll();
  }

  detectFiles(event) {
    let file = event.target.files[0];
    this.imageAdded = true;
    if (file) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.url = e.target.result;
      }
      reader.readAsDataURL(file);
    }
  }
}
