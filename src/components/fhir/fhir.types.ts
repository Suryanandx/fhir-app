// types.ts
export interface Questionnaire {
    title: string;
    item: QuestionItem[];
  }
  
  export interface QuestionItem {
    linkId: string;
    text: string;
    type: string;
    item?: QuestionItem[];
    answerOption?: AnswerOption[];
    parentLinkId?: string;
    repeats?: boolean;
  }
  
  export interface AnswerOption {
    valueCoding: {
      code: string;
      display: string;
    };
  }
  
  export interface Answers {
    [key: string]: any; // Replace 'any' with a more specific type based on what your answers look like
  }
  