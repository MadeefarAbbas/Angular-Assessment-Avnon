import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  questions = [];
  private updatedQuestions: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor() { }

  allQuestions() {
    return this.updatedQuestions.asObservable();
  }

  addNewQuestion(question) {
    const newQuestion = {...question, id: this.makeid(7)};
    this.questions.push(newQuestion);
    const updatedQuestions = [...this.questions];
    this.updatedQuestions.next(updatedQuestions);
  }

  deleteQuestion(id) {
    const index = this.questions.findIndex(x => x.id == id);
    this.questions.splice(index,1);
    this.updatedQuestions.next([...this.questions]);
  }

  getQuestion(id): any {
    const index = this.questions.findIndex(x => x.id == id);
    const question = this.questions[index];
    return question;
  }

  updateQuestion(question,id) {
    const index = this.questions.findIndex(x => x.id == id);
    const ques = this.questions[index];
    const existingQuestion = {...ques};
    const updatedExistingQuestion = {...existingQuestion, ...question}
    this.questions[index] = updatedExistingQuestion;

    this.updatedQuestions.next([...this.questions])
  }

  makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
}
