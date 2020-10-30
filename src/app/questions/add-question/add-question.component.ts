import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { FormArray, FormBuilder, FormGroup, FormControl,
  ValidatorFn,
  Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  editQuestion: any;
  id: string;

  constructor(private cdRef:ChangeDetectorRef,private fb: FormBuilder, private questionService: QuestionService,private router: Router,private route: ActivatedRoute) {
    this.myForm = this.fb.group({
      question: ['',Validators.required],
      questionType: ['',Validators.required],
      paragraph: ['', Validators.required],
      options: this.fb.array([]),
      other: [false],
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

  onRadioButtonChange(val) {
    this.options.value.forEach((data, index)=>{
      if((val.option == this.options.value[index].option) && (val.valid == this.options.value[index].valid)){
        const myForm = (<FormArray>(<FormGroup>this.myForm).get('options')).at(index);
        if(val.option) {
          myForm.patchValue({
            option: this.options.value[index].option,
            valid: this.options.value[index].option
          })
        }

      } else {
        const myForm = (<FormArray>(<FormGroup>this.myForm).get('options')).at(index);
        myForm.patchValue({
          option: this.options.value[index].option,
          valid: undefined
        })

      }
    })
  }

  onSubmit() {
    console.log(this.myForm)
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
    this.myForm.reset();
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
      this.clearFormArray(updatedOptionsArr);
    }
    if(value == 2) {
      const updatedOptionsArr = this.updatedOptions();
      this.clearFormArray(updatedOptionsArr);
      this.myForm.controls['paragraph'].setValue(' ');
      this.createEmpFormGroup(3).map(val => {
        this.updatedOptions().push(val);
      });
    }
    if(value == 3) {
      const updatedOptionsArr = this.updatedOptions();
      this.clearFormArray(updatedOptionsArr);
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

}
