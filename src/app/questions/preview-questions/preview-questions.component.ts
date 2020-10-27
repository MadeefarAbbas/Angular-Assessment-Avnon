import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuestionService } from '../question.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview-questions',
  templateUrl: './preview-questions.component.html',
  styleUrls: ['./preview-questions.component.css']
})
export class PreviewQuestionsComponent implements OnInit, OnDestroy {


  questionSubs: Subscription;
  questions: any[] = [];

  constructor(private questionService: QuestionService,private router: Router) { }

  ngOnInit(): void {
    this.questionSubs = this.questionService.allQuestions().subscribe(questions => {
      console.log(questions)
      this.questions = questions;
    });
  }

  onAdd() {
    this.router.navigate(['add-question'])
  }

  ngOnDestroy() {
    if(this.questionSubs){
      this.questionSubs.unsubscribe();
    }
  }

}
