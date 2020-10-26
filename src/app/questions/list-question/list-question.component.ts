import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuestionService } from '../question.service';
import { Question } from '../question.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.css']
})
export class ListQuestionComponent implements OnInit, OnDestroy {

  questionSubs: Subscription;
  questions: Question[] = [];

  constructor(private questionService: QuestionService,private router: Router) { }

  ngOnInit(): void {
    this.questionSubs = this.questionService.allQuestions().subscribe(questions => {
      console.log(questions)
      this.questions = questions;
    });
  }

  onDelete(id) {
    this.questionService.deleteQuestion(id);
  }

  onEdit(questionId) {
    this.router.navigate(['/edit', questionId]);
  }

  ngOnDestroy() {
    if(this.questionSubs){
      this.questionSubs.unsubscribe();
    }
  }

}
