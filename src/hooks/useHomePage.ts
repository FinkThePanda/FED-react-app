// src/hooks/useHomePage.ts
import { useState, useEffect } from "react";
import * as api from "../services/api";
import type { Exam, Student } from "../types/types";

export const useHomePage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States til modaler
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [viewingStudentsFor, setViewingStudentsFor] = useState<Exam | null>(
    null
  );

  useEffect(() => {
    const loadExams = async () => {
      try {
        setIsLoading(true);
        const fetchedExams = await api.getExams();
        const upcomingExams = fetchedExams.filter(
          (exam) => exam.status !== "finished"
        );
        setExams(upcomingExams);
      } catch (err) {
        setError("Kunne ikke hente eksamener. Prøv igen senere.");
      } finally {
        setIsLoading(false);
      }
    };
    loadExams();
  }, []);

  const handleOpenAddStudentModal = (examId: string) => {
    setSelectedExamId(examId);
    setIsAddStudentModalOpen(true);
  };

  const handleCloseAddStudentModal = () => {
    setSelectedExamId(null);
    setIsAddStudentModalOpen(false);
  };

  const handleStudentAdded = (newStudent: Student) => {
    setExams((prevExams) =>
      prevExams.map((exam) =>
        exam.id === newStudent.examId
          ? { ...exam, students: [...exam.students, newStudent] }
          : exam
      )
    );
    handleCloseAddStudentModal();
  };

  const handleExamCreated = (newExam: Exam) => {
    setExams((prevExams) => [...prevExams, newExam]);
    setIsCreateModalOpen(false);
  };

  const handleCardClick = (exam: Exam) => {
    setViewingStudentsFor(exam);
  };

  return {
    state: {
      exams,
      isLoading,
      error,
      isCreateModalOpen,
      isAddStudentModalOpen,
      selectedExamId,
      viewingStudentsFor,
    },
    actions: {
      setIsCreateModalOpen,
      setIsAddStudentModalOpen,
      setViewingStudentsFor,
      handleOpenAddStudentModal,
      handleCloseAddStudentModal,
      handleStudentAdded,
      handleExamCreated,
      handleCardClick,
    },
  };
};
