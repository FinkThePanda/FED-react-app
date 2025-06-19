// src/hooks/useHistoryPage.ts
import { useState, useEffect, useMemo } from "react";
import * as api from "../services/api";
import type { Exam } from "../types/types";
import type { FilterOptions } from "../components/ui/FilterControls/FilterControls";

/**
 * Custom Hook til at håndtere al logik og state for HistoryPage.
 * Den indkapsler datahentning, filtrering, sortering og modal-håndtering.
 */
export const useHistoryPage = () => {
  // --- STATE MANAGEMENT ---
  // Rå, ufiltreret liste af alle afsluttede eksamener fra API'et.
  const [allExams, setAllExams] = useState<Exam[]>([]);
  // Styrer visning af loading-spinner eller besked.
  const [isLoading, setIsLoading] = useState(true);
  // Holder eventuelle fejlbeskeder.
  const [error, setError] = useState<string | null>(null);

  // States til filter- og sorteringsmuligheder.
  const [filters, setFilters] = useState<FilterOptions>({
    course: "",
    term: "",
    sortOrder: "desc",
  });
  // State til at styre, hvor mange resultater der vises.
  const [displayCount, setDisplayCount] = useState(10);
  // State til at styre, hvilken eksamens resultater der vises i en modal.
  const [viewingResultsFor, setViewingResultsFor] = useState<Exam | null>(null);

  // --- DATA FETCHING ---
  // useEffect-hook til at hente data, når komponenten mounter første gang.
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const fetchedExams = await api.getExams();
        // Filtrer listen, så den kun indeholder eksamener, der er markeret som 'finished'
        // eller hvor mindst én studerende har fået en karakter.
        const completedExams = fetchedExams.filter(
          (exam) =>
            exam.status === "finished" || exam.students.some((s) => s.grade)
        );
        setAllExams(completedExams);
      } catch (err) {
        setError("Kunne ikke hente historik.");
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, []); // Det tomme dependency-array sikrer, at effekten kun kører én gang.

  // --- MEMOIZED COMPUTATIONS ---
  // useMemo bruges til at undgå unødvendige genberegninger.

  // Beregner unikke kursusnavne og terminer til filter-dropdowns.
  // Kører kun igen, hvis 'allExams' ændrer sig.
  const { uniqueCourses, uniqueTerms } = useMemo(() => {
    const courseSet = new Set<string>();
    const termSet = new Set<string>();
    allExams.forEach((exam) => {
      courseSet.add(exam.courseName);
      termSet.add(exam.examtermin);
    });
    return {
      uniqueCourses: Array.from(courseSet),
      uniqueTerms: Array.from(termSet),
    };
  }, [allExams]);

  // Anvender de aktuelle filtre og sortering på eksamenslisten.
  // Kører kun igen, hvis data, filtre eller antal ændrer sig.
  const processedExams = useMemo(() => {
    let filtered = allExams.filter(
      (exam) =>
        (filters.course ? exam.courseName === filters.course : true) &&
        (filters.term ? exam.examtermin === filters.term : true)
    );

    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filtered.slice(0, displayCount);
  }, [allExams, filters, displayCount]);

  // --- HELPER FUNCTIONS ---
  // En ren funktion til at beregne gennemsnitskarakter for en given eksamen.
  const calculateAverageGrade = (exam: Exam): string => {
    const gradedStudents = exam.students.filter(
      (s) => s.grade && !isNaN(parseInt(s.grade, 10))
    );
    if (gradedStudents.length === 0) return "N/A";
    const total = gradedStudents.reduce(
      (sum, s) => sum + parseInt(s.grade!, 10),
      0
    );
    const average = total / gradedStudents.length;
    return average.toFixed(2);
  };

  // Funktion til at håndtere klik på et kort.
  const handleCardClick = (exam: Exam) => {
    setViewingResultsFor(exam);
  };

  // --- RETURN VALUE ---
  // Returnerer et objekt med state og actions, som UI-komponenten kan bruge.
  return {
    state: {
      isLoading,
      error,
      filters,
      displayCount,
      viewingResultsFor,
      uniqueCourses,
      uniqueTerms,
      processedExams,
    },
    actions: {
      setFilters,
      setDisplayCount,
      setViewingResultsFor,
      handleCardClick,
      calculateAverageGrade,
    },
  };
};
