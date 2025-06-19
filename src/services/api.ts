// src/services/api.ts
import type { Exam, Student } from "../types/types";

// NYT: URL'en bestemmes nu af en miljøvariabel.
// Hvis VITE_API_URL ikke er sat (f.eks. under lokal udvikling),
// falder den tilbage til at bruge localhost:3000.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Datatyper til oprettelse af nye objekter, hvor ID'et endnu ikke eksisterer.
type NewExamData = Omit<Exam, "id" | "students" | "status">;

type StudentUpdateData = Pick<
  Student,
  "id" | "questionNo" | "actualExamDuration" | "notes" | "grade"
>;

/**
 * Henter alle eksamener og inkluderer de tilknyttede studerende.
 * @returns Et promise, der resolver til et array af Exam-objekter.
 */
export const getExams = async (): Promise<Exam[]> => {
  // _embed=students fortæller json-server, at den skal inkludere alle studerende,
  // der har et 'examId', som matcher eksamenens 'id'.
  const response = await fetch(`${BASE_URL}/exams?_embed=students`);
  if (!response.ok) {
    throw new Error("Kunne ikke hente eksamener fra serveren.");
  }
  return response.json();
};

/**
 * Henter en specifik eksamen baseret på dens ID.
 * @param id - ID'et for den eksamen, der skal hentes.
 * @returns Et promise, der resolver til et Exam-objekt.
 */
export const getExamById = async (id: string): Promise<Exam> => {
  const response = await fetch(`${BASE_URL}/exams/${id}?_embed=students`);
  if (!response.ok) {
    throw new Error(`Eksamen med id ${id} blev ikke fundet.`);
  }
  return response.json();
};

/**
 * Opretter en ny eksamen i databasen.
 * @param examData - Data for den nye eksamen.
 * @returns Et promise, der resolver til det nyoprettede Exam-objekt.
 */
export const createExam = async (examData: NewExamData): Promise<Exam> => {
  // Sætter default status til 'upcoming' ved oprettelse
  const dataToSave = { ...examData, status: "upcoming" };
  const response = await fetch(`${BASE_URL}/exams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToSave),
  });
  if (!response.ok) {
    throw new Error("Kunne ikke oprette eksamen.");
  }
  const newExam: Exam = await response.json();
  newExam.students = [];
  return newExam;
};

/**
 * Opdaterer en eksisterende eksamen.
 * @param exam - Hele eksamensobjektet, der skal opdateres.
 * @returns Et promise, der resolver til det opdaterede Exam-objekt.
 */
export const updateExam = async (exam: Exam): Promise<Exam> => {
  const response = await fetch(`${BASE_URL}/exams/${exam.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(exam),
  });
  if (!response.ok) {
    throw new Error("Kunne ikke opdatere eksamen.");
  }
  return response.json();
};

/**
 * Sletter en eksamen og alle tilknyttede studerende.
 * @param examId - ID'et for den eksamen, der skal slettes.
 */
export const deleteExam = async (examId: string): Promise<void> => {
  // 1. Hent alle studerende for den pågældende eksamen
  const studentsResponse = await fetch(`${BASE_URL}/students?examId=${examId}`);
  if (!studentsResponse.ok) {
    throw new Error("Kunne ikke hente studerende for eksamen.");
  }
  const students: Student[] = await studentsResponse.json();

  // 2. Slet hver studerende
  const deleteStudentPromises = students.map((student) =>
    fetch(`${BASE_URL}/students/${student.id}`, { method: "DELETE" })
  );

  await Promise.all(deleteStudentPromises);

  // 3. Slet selve eksamenen
  const deleteExamResponse = await fetch(`${BASE_URL}/exams/${examId}`, {
    method: "DELETE",
  });

  if (!deleteExamResponse.ok) {
    throw new Error("Kunne ikke slette eksamen.");
  }
};

/**
 * Tilføjer en ny studerende til databasen.
 * @param studentData - Data for den nye studerende.
 * @returns Et promise, der resolver til det nyoprettede Student-objekt.
 */
export const addStudent = async (
  studentData: Omit<Student, "id">
): Promise<Student> => {
  const response = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });
  if (!response.ok) throw new Error("Kunne ikke tilføje studerende.");
  return response.json();
};

/**
 * Sletter en studerende fra databasen.
 * @param studentId - ID'et for den studerende, der skal slettes.
 */
export const deleteStudent = async (studentId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/students/${studentId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Kunne ikke slette studerende.");
  }
};

/**
 * NYT: Opdaterer rækkefølgen for en liste af studerende.
 * Sender en PATCH request for hver studerende for at opdatere deres 'order'-felt.
 * @param students - En liste af studerende med den nye, korrekte rækkefølge.
 */
export const updateStudentOrder = async (
  students: Pick<Student, "id" | "order">[]
): Promise<void> => {
  // Opretter en liste af promises, et for hver studerende der skal opdateres.
  const updatePromises = students.map((student) =>
    fetch(`${BASE_URL}/students/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: student.order }),
    })
  );

  // Venter på at alle opdateringer er gennemført.
  const responses = await Promise.all(updatePromises);

  // Tjekker om nogen af kaldene fejlede.
  responses.forEach((res) => {
    if (!res.ok) throw new Error("Kunne ikke opdatere studenterrækkefølgen.");
  });
};

/**
 * Opdaterer en studerendes data efter en afsluttet eksamen.
 * @param studentData - Data der skal opdateres for den studerende.
 * @returns Et promise, der resolver til det opdaterede Student-objekt.
 */
export const updateStudent = async (
  studentData: StudentUpdateData
): Promise<Student> => {
  const { id, ...dataToUpdate } = studentData;
  const response = await fetch(`${BASE_URL}/students/${id}`, {
    method: "PATCH", // PATCH opdaterer kun de angivne felter.
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToUpdate),
  });
  if (!response.ok) {
    throw new Error("Kunne ikke opdatere studerendes data.");
  }
  return response.json();
};

/**
 * NYT: Opdaterer en eksamens status til 'finished'.
 * @param examId - ID'et på den eksamen, der skal afsluttes.
 * @returns Et promise, der resolver til det opdaterede Exam-objekt.
 */
export const finishExam = async (examId: string): Promise<Exam> => {
  const response = await fetch(`${BASE_URL}/exams/${examId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "finished" }),
  });
  if (!response.ok) {
    throw new Error("Kunne ikke afslutte eksamen.");
  }
  return response.json();
};
