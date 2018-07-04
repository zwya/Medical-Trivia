export class Question {
  question: string;
  answers: string[];
  imageid: string;
  id?: string;

  constructor(question: string, answers: string[], imageid: string, id?: string) {
    this.question = question;
    this.answers = answers;
    this.imageid = imageid;
    this.id = id;
  }
}
