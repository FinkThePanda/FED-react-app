import { useState, useMemo, useCallback } from "react";
import { useExams } from "../context/ExamContext"; // Import context hook
import type { Exam } from "../types/types";
import type { FilterOptions } from "../components/ui/FilterControls/FilterControls";

/**
 * Custom Hook to handle all logic and state for HistoryPage.
 * It encapsulates data filtering, sorting, and modal handling, using global exam state.
 */
export const useHistoryPage = () => {
  // --- GLOBAL STATE ---
  // Get exams, loading status, and errors from the global context.
  const { exams, isLoading, error } = useExams();

  // --- LOCAL UI STATE ---
  // States for filtering and sorting options.
  const [filters, setFilters] = useState<FilterOptions>({
    course: "",
    term: "",
    sortOrder: "desc",
  });
  // State to control how many results are displayed.
  const [displayCount, setDisplayCount] = useState(10);
  // State to control which exam's results are shown in a modal.
  const [viewingResultsFor, setViewingResultsFor] = useState<Exam | null>(null);

  // --- MEMOIZED COMPUTATIONS ---
  // useMemo is used to avoid unnecessary recalculations.

  // Filter the global list of exams to only include those marked as 'finished'
  // or where at least one student has received a grade.
  const completedExams = useMemo(() => {
    return exams.filter(
      (exam) => exam.status === "finished" || exam.students.some((s) => s.grade)
    );
  }, [exams]);

  // Calculate unique course names and terms for filter dropdowns.
  // Runs only when 'completedExams' changes.
  const { uniqueCourses, uniqueTerms } = useMemo(() => {
    const courseSet = new Set<string>();
    const termSet = new Set<string>();
    completedExams.forEach((exam) => {
      courseSet.add(exam.courseName);
      termSet.add(exam.examtermin);
    });
    return {
      uniqueCourses: Array.from(courseSet),
      uniqueTerms: Array.from(termSet),
    };
  }, [completedExams]);

  // Apply the current filters and sorting to the exam list.
  // Runs only if data, filters, or display count change.
  const processedExams = useMemo(() => {
    const filtered = completedExams.filter(
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
  }, [completedExams, filters, displayCount]);

  // --- ACTIONS & HELPERS ---
  // Wrap action functions in useCallback to prevent re-creation on re-renders.

  const handleCardClick = useCallback((exam: Exam) => {
    setViewingResultsFor(exam);
  }, []);

  // A pure function to calculate the average grade for a given exam.
  const calculateAverageGrade = useCallback((exam: Exam): string => {
    const gradedStudents = exam.students.filter(
      (s) => s.grade && !isNaN(parseInt(s.grade, 10))
    );
    if (gradedStudents.length === 0) return "N/A";
    const total = gradedStudents.reduce(
      (sum, s) => sum + parseInt(s.grade!, 10),
      0
    );
    const average = total / gradedStudents.length;
    return average.toFixed(2); // Return average with 2 decimal places.
  }, []);

  // --- RETURN VALUE ---
  // Expose state and actions for the component to use.
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
