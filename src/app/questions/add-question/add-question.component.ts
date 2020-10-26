import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { FormArray, FormBuilder, FormGroup, FormControl,
  ValidatorFn,
  Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '../question.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddQuestionComponent implements OnInit {
  myForm: FormGroup;
  questionTypes = [];
  selectedValue = '1';
  otherChecked = false;
  isValidFormSubmitted = null;
  isEdit = false;
  editQuestion: Question;
  id: string;

  constructor(private cdRef:ChangeDetectorRef,private fb: FormBuilder, private questionService: QuestionService,private router: Router,private route: ActivatedRoute) {
    this.myForm = this.fb.group({
      question: ['',Validators.required],
      questionType: ['',Validators.required],
      paragraph: [''],
      options: this.fb.array([]),
      isRequired: [false]
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if(params.id) {
        this.id = params.id;
        this.isEdit = true;
        this.editQuestion = this.questionService.getQuestion(params.id);
      } else {
        this.isEdit = false;
      }
    });

    if(this.isEdit) {
      const editOptionsLen = this.editQuestion.options
      .filter(val => {
        if(val.option == 'other') {
          return this.onOtherOption();
        }
        return val;
      }).length;
      this.myForm = this.fb.group({
        question: ['',Validators.required],
        questionType: ['',Validators.required],
        paragraph: [''],
        options: this.fb.array(this.createEmpFormGroup(editOptionsLen)),
        isRequired: [false]
      });
      this.selectedValue = this.editQuestion.questionType;
      this.myForm.patchValue({
        question: this.editQuestion.question,
        questionType: this.editQuestion.questionType,
        paragraph: this.editQuestion.paragraph,
        options: this.editQuestion.options.filter(val => {
          if(val.option == 'other') {
            return this.onOtherOption();
          }
          return val;
        }),
        isRequired: this.editQuestion.isRequired
      });

      // this.myForm.setControl('options', this.fb.array(this.editQuestion.options));
    }

    this.questionTypes = this.getQuestionTypes();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }


  createEmpFormGroup(arrLength) {
    const formGroupArr = [];
    for(let i = 0; i < arrLength; i++) {
      formGroupArr.push(
        this.fb.group({
          option: ['',Validators.required],
          valid: [false]
        })
      )
    }

    return formGroupArr;

  }





  get options() {
    return this.myForm.get("options") as FormArray;
  }

  get question() {
    return this.myForm.get('question');
  }

  get paragraph() {
    return this.myForm.get('paragraph');
  }

  get qType() {
    return this.myForm.get('questionType');
  }

  updatedOptions(): FormArray {
    return this.myForm.get("options") as FormArray;
  }

  onSubmit() {
    this.isValidFormSubmitted = false;
		if (this.myForm.invalid) {
			return;
    }
    this.isValidFormSubmitted = true;
    const question = this.myForm.value;
    if(this.isEdit) {
      this.questionService.updateQuestion(question,this.id);
    } else {
      this.questionService.addNewQuestion(question);
    }
    this.router.navigateByUrl('/questions');
  }

  onPreview() {
    this.router.navigate(['preview-questions']);
  }


  getQuestionTypes() {
    return [
      { id: '1', name: 'Paragraph' },
      { id: '2', name: 'Radio Button' },
      { id: '3', name: 'Checkbox' }
    ];
  }

  onChangeQuestionType(value) {
    if(value == 1) {
      const updatedOptionsArr = this.updatedOptions();
      this.myForm.controls['paragraph'].setValue(null);
      this.clearFormArray(updatedOptionsArr)
      this.removeOtherOption();
      this.otherChecked = false;
    }
    if(value == 2) {
      const updatedOptionsArr = this.updatedOptions();
      this.clearFormArray(updatedOptionsArr)
      this.removeOtherOption();
      this.otherChecked = false;
      this.myForm.controls['paragraph'].setValue(' ');
      this.createEmpFormGroup(3).map(val => {
        this.updatedOptions().push(val);
      })
    }
    if(value == 3) {
      const updatedOptionsArr = this.updatedOptions();
      this.clearFormArray(updatedOptionsArr)
      this.removeOtherOption();
      this.otherChecked = false;
      this.myForm.controls['paragraph'].setValue(' ');
      this.createEmpFormGroup(3).map(val => {
        this.updatedOptions().push(val);
      })
    }
  }

  clearFormArray (formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  addOption() {
    this.options.push(
      this.fb.group({
        option: ["",Validators.required],
        valid: [false]
      })
    );
  }

  onOtherOption() {
    const other = this.options.value.filter(val => val.option == 'other');
    if(other.length > 0) {
     this.removeOtherOption();
    }
    else {
      this.otherChecked = true;
      this.options.push(
        this.fb.group({
          option: ["other"],
          valid: [false]
        })
      );
    }
  }

  removeOtherOption() {
    const indexfromArray = this.findWithAttr(this.options.value,'option','other');
    this.options.controls.splice(indexfromArray, 1);
    this.options.updateValueAndValidity();
  }

  findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
  }

}
