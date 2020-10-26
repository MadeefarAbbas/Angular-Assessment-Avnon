export interface Question {
  id: Date;
	isRequired: boolean;
  options: Array<{option: string, valid: boolean}>;
  paragraph: string;
  question: string;
  questionType: string;
}
