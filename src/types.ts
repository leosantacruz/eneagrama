export interface Question {
  number: number;
  question: string;
}

export interface Answer {
  questionNumber: number;
  answer: boolean;
}

export interface TestProgress {
  answers: Answer[];
  currentQuestion: number;
}

export interface TypeResult {
  type: number;
  count: number;
}