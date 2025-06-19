export interface Student {
  id: string;
  examId: string;
  studentNo: string;
  name: string;
  order: number; // NYT: Til at styre rækkefølgen
  questionNo?: number;
  actualExamDuration?: number;
  notes?: string;
  grade?: string;
}

export interface Exam {
  id: string;
  examtermin: string;
  courseName: string;
  date: string;
  numberOfQuestions: number;
  examDurationMinutes: number;
  startTime: string;
  students: Student[];
  status?: "upcoming" | "finished";
}
