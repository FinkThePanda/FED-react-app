export const ExamPhase = {
  WaitingForStudent: "WaitingForStudent",
  QuestionDrawn: "QuestionDrawn",
  Examining: "Examining",
  Grading: "Grading",
  AllStudentsGraded: "AllStudentsGraded",
  Finished: "Finished",
} as const;

export type ExamPhase = (typeof ExamPhase)[keyof typeof ExamPhase];
