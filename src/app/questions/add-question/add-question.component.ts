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
  otherCheckBoxChecked = false;
  isValidFormSubmitted = null;
  isEdit = false;
  editQuestion: any;
  id: string;

  constructor(private cdRef:ChangeDetectorRef,private fb: FormBuilder, private questionService: QuestionService,private router: Router,private route: ActivatedRoute) {
    this.myForm = this.fb.group({
      paragraphQuestion: this.fb.group({
        questionTitle: ['',[Validators.required]],
        paragraph: ['',[Validators.required]],
        isRequired: [false]
      }),
      radioButtonQuestion: this.fb.group({
        questionTitle: ['',[Validators.required]],
        options: this.fb.array([
          this.fb.group({
            option: ['',Validators.required],
            valid: [undefined]
          }),
          this.fb.group({
            option: ['',Validators.required],
            valid: [undefined]
          }),

          this.fb.group({
            option: ['',Validators.required],
            valid: [undefined]
          })
        ]),
        other: false,
        isRequired: [false]
      }),
      checkboxQuestion: this.fb.group({
        questionTitle: ['',[Validators.required]],
        options: this.fb.array([
          this.fb.group({
            option: ['',Validators.required],
            valid: [false]
          }),
          this.fb.group({
            option: ['',Validators.required],
            valid: [false]
          }),
          this.fb.group({
            option: ['',Validators.required],
            valid: [false]
          })
        ]),
        other: false,
        isRequired: [false]
      })
    });
  }

  ngOnInit() {
    console.log(this.myForm)
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
      // const editOptionsLen = this.editQuestion.options
      // .filter(val => {
      //   if(val.option == 'other') {
      //     return this.onOtherOption();
      //   }
      //   return val;
      // }).length;
      // this.myForm = this.fb.group({
      //   question: ['',Validators.required],
      //   questionType: ['',Validators.required],
      //   paragraph: [''],
      //   options: this.fb.array(this.createEmpFormGroup(editOptionsLen)),
      //   isRequired: [false]
      // });
      // this.selectedValue = this.editQuestion.questionType;
      // this.myForm.patchValue({
      //   question: this.editQuestion.question,
      //   questionType: this.editQuestion.questionType,
      //   paragraph: this.editQuestion.paragraph,
      //   options: this.editQuestion.options.filter(val => {
      //     if(val.option == 'other') {
      //       return this.onOtherOption();
      //     }
      //     return val;
      //   }),
      //   isRequired: this.editQuestion.isRequired
      // });

      // this.myForm.setControl('options', this.fb.array(this.editQuestion.options));
    }
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }


  onRadioButtonChange(val) {
    console.log(val)
    this.radiobuttonOptions.value.forEach((data, index)=>{
      if((val.option == this.radiobuttonOptions.value[index].option) && (val.valid == this.radiobuttonOptions.value[index].valid)){
        const myForm = (<FormArray>(<FormGroup>this.myForm.get('radioButtonQuestion')).get('options')).at(index);
        if(val.option) {
          myForm.patchValue({
            option: this.radiobuttonOptions.value[index].option,
            valid: this.radiobuttonOptions.value[index].option
          })
        }

      } else {
        const myForm = (<FormArray>(<FormGroup>this.myForm.get('radioButtonQuestion')).get('options')).at(index);
        myForm.patchValue({
          option: this.radiobuttonOptions.value[index].option,
          valid: undefined
        })

        console.log('not')
      }
    })
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


  get checkboxOptions() {
    return (<FormArray>(<FormGroup>this.myForm.get('checkboxQuestion')).get('options'));
  }

  get radiobuttonOptions() {
    return (<FormArray>(<FormGroup>this.myForm.get('radioButtonQuestion')).get('options'));
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
    this.router.navigateByUrl('/add-question');
    this.myForm.reset();
  }

  onPreview() {
    this.router.navigate(['preview-questions']);
  }

  addCheckBoxOption() {
    this.checkboxOptions.push(
      this.fb.group({
        option: ["",Validators.required],
        valid: [false]
      })
    );
  }

  addRadioButtonOption() {
    this.radiobuttonOptions.push(
      this.fb.group({
        option: ["",Validators.required],
        valid: [undefined]
      })
    )
  }

}
