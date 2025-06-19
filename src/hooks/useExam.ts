// src/hooks/useExam.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../services/api";
import type { Exam } from "../types/types";
import { ExamPhase } from "../types/enums"; // Vi opretter denne om lidt

export const useExam = (examId: string | undefined) => {
  const navigate = useNavigate();

  // Alle states er nu samlet her
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [phase, setPhase] = useState<ExamPhase>(ExamPhase.WaitingForStudent);
  const [drawnQuestion, setDrawnQuestion] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeUsed, setTimeUsed] = useState(0);
  const [notes, setNotes] = useState("");
  const [grade, setGrade] = useState<string>("");

  // Hent eksamensdata og find næste studerende
  useEffect(() => {
    if (!examId) return;
    const loadExam = async () => {
      try {
        setIsLoading(true);
        const fetchedExam = await api.getExamById(examId);
        setExam(fetchedExam);
        setTimer(fetchedExam.examDurationMinutes * 60);

        const nextStudentIndex = fetchedExam.students.findIndex(
          (student) => !student.grade
        );

        if (nextStudentIndex === -1 && fetchedExam.students.length > 0) {
          setPhase(ExamPhase.AllStudentsGraded);
        } else {
          setCurrentStudentIndex(nextStudentIndex > -1 ? nextStudentIndex : 0);
        }
      } catch {
        setError("Kunne ikke finde eksamen.");
      } finally {
        setIsLoading(false);
      }
    };
    loadExam();
  }, [examId]);

  // Timer logik
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playNotificationSound();
      setPhase(ExamPhase.Grading);
      setTimeUsed(exam!.examDurationMinutes * 60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timer, exam]);

  const playNotificationSound = () => {
    const audioCtx = new (window.AudioContext ||
      (window as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext)();
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    setTimeout(() => oscillator.stop(), 500);
  };

  const handleDrawQuestion = () => {
    if (!exam) return;
    const question = Math.floor(Math.random() * exam.numberOfQuestions) + 1;
    setDrawnQuestion(question);
    setPhase(ExamPhase.QuestionDrawn);
  };

  const handleStartExamination = () => {
    setIsTimerRunning(true);
    setPhase(ExamPhase.Examining);
  };

  const resetForNextStudent = () => {
    if (!exam) return;
    setDrawnQuestion(null);
    setNotes("");
    setGrade("");
    setTimer(exam.examDurationMinutes * 60);
    setPhase(ExamPhase.WaitingForStudent);
    setTimeUsed(0);
  };

  const handleSaveAndNext = async () => {
    if (!exam || !drawnQuestion || grade === "") return;

    let finalTimeUsed = timeUsed;
    if (isTimerRunning) {
      setIsTimerRunning(false);
      const totalDuration = exam.examDurationMinutes * 60;
      finalTimeUsed = totalDuration - timer;
      setTimeUsed(finalTimeUsed);
    }

    const currentStudent = exam.students[currentStudentIndex];
    try {
      await api.updateStudent({
        id: currentStudent.id,
        questionNo: drawnQuestion,
        actualExamDuration: Math.round(finalTimeUsed / 60),
        notes: notes,
        grade: grade,
      });

      const updatedStudents = [...exam.students];
      updatedStudents[currentStudentIndex].grade = grade;
      const newExamState = { ...exam, students: updatedStudents };
      setExam(newExamState);

      const nextStudentIndex = newExamState.students.findIndex(
        (student) => !student.grade
      );

      if (nextStudentIndex !== -1) {
        setCurrentStudentIndex(nextStudentIndex);
        resetForNextStudent();
      } else {
        setPhase(ExamPhase.AllStudentsGraded);
      }
    } catch {
      setError("Kunne ikke gemme data. Prøv igen.");
    }
  };

  const handleSkipStudent = () => {
    if (!exam || currentStudentIndex >= exam.students.length - 1) return;
    setCurrentStudentIndex((prev) => prev + 1);
    resetForNextStudent();
  };

  const handleFinishExam = async () => {
    if (!examId) return;
    try {
      await api.finishExam(examId);
      setPhase(ExamPhase.Finished);
      setTimeout(() => navigate("/"), 2000);
    } catch {
      setError("Fejl ved arkivering af eksamen.");
    }
  };

  // Vi returnerer state og actions (funktioner) i et pænt objekt
  return {
    state: {
      isLoading,
      error,
      exam,
      currentStudentIndex,
      phase,
      drawnQuestion,
      timer,
      notes,
      grade,
      timeUsed,
    },
    actions: {
      setNotes,
      setGrade,
      handleDrawQuestion,
      handleStartExamination,
      handleSaveAndNext,
      handleSkipStudent,
      handleFinishExam,
    },
  };
};
