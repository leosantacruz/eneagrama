import { Answer } from "./types";

// Map questions to their corresponding types based on ranges
export const getQuestionType = (questionNumber: number): number => {
  if (questionNumber >= 1 && questionNumber <= 20) return 2;
  if (questionNumber >= 21 && questionNumber <= 40) return 3;
  if (questionNumber >= 41 && questionNumber <= 60) return 4;
  if (questionNumber >= 61 && questionNumber <= 80) return 5;
  if (questionNumber >= 81 && questionNumber <= 100) return 6;
  if (questionNumber >= 101 && questionNumber <= 120) return 7;
  if (questionNumber >= 121 && questionNumber <= 140) return 8;
  if (questionNumber >= 141 && questionNumber <= 160) return 9;
  if (questionNumber >= 161 && questionNumber <= 180) return 1;
  return 0; // This should never happen with valid question numbers
};

export const calculateResults = (answers: Answer[]): number[] => {
  const typeCounts = new Array(9).fill(0);

  answers.forEach((answer) => {
    if (answer.answer) {
      // If answer is YES
      const type = getQuestionType(answer.questionNumber);
      if (type > 0) {
        typeCounts[type - 1]++; // Subtract 1 because array is 0-based
      }
    }
  });

  return typeCounts;
};

export const getEnneagramType = (results: number[]): number => {
  let maxCount = -1;
  let maxType = 0;

  results.forEach((count, index) => {
    if (count > maxCount) {
      maxCount = count;
      maxType = index + 1;
    }
  });

  return maxType;
};

export const getProgress = (currentQuestion: number): number => {
  return (currentQuestion / 180) * 100;
};
