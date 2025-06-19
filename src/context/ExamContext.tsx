import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import * as api from "../services/api";
import type { Exam } from "../types/types";

// 1. Definer State og Action Typer
interface State {
  exams: Exam[];
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Exam[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "ADD_EXAM"; payload: Exam }
  | { type: "UPDATE_EXAM"; payload: Exam }
  | { type: "DELETE_EXAM"; payload: string };

// 2. Opret Reducer
const examReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, exams: action.payload };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "ADD_EXAM":
      return { ...state, exams: [...state.exams, action.payload] };
    case "UPDATE_EXAM":
      return {
        ...state,
        exams: state.exams.map((ex) =>
          ex.id === action.payload.id ? action.payload : ex
        ),
      };
    case "DELETE_EXAM":
      return {
        ...state,
        exams: state.exams.filter((ex) => ex.id !== action.payload),
      };
    default:
      return state;
  }
};

// 3. Opret Context
interface ExamContextType extends State {
  createExam: (
    examData: Omit<Exam, "id" | "students" | "status">
  ) => Promise<void>;
  updateExam: (examData: Exam) => Promise<void>;
  deleteExam: (examId: string) => Promise<void>;
  updateStudentsInExam: (updatedExam: Exam) => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

// 4. Opret Provider
const initialState: State = {
  exams: [],
  isLoading: true,
  error: null,
};

export const ExamProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(examReducer, initialState);

  useEffect(() => {
    const loadExams = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const fetchedExams = await api.getExams();
        const upcomingExams = fetchedExams.filter(
          (exam) => exam.status !== "finished"
        );
        dispatch({ type: "FETCH_SUCCESS", payload: upcomingExams });
      } catch {
        dispatch({
          type: "FETCH_ERROR",
          payload: "Kunne ikke hente eksamener.",
        });
      }
    };
    loadExams();
  }, []);

  const createExam = useCallback(
    async (examData: Omit<Exam, "id" | "students" | "status">) => {
      try {
        const newExam = await api.createExam(examData);
        dispatch({ type: "ADD_EXAM", payload: newExam });
      } catch {
        dispatch({
          type: "FETCH_ERROR",
          payload: "Kunne ikke oprette eksamen.",
        });
      }
    },
    []
  );

  const updateExam = useCallback(async (examData: Exam) => {
    try {
      const updatedExam = await api.updateExam(examData);
      dispatch({ type: "UPDATE_EXAM", payload: updatedExam });
    } catch {
      dispatch({
        type: "FETCH_ERROR",
        payload: "Kunne ikke opdatere eksamen.",
      });
    }
  }, []);

  const deleteExam = useCallback(async (examId: string) => {
    try {
      await api.deleteExam(examId);
      dispatch({ type: "DELETE_EXAM", payload: examId });
    } catch {
      dispatch({ type: "FETCH_ERROR", payload: "Kunne ikke slette eksamen." });
    }
  }, []);

  const updateStudentsInExam = useCallback((updatedExam: Exam) => {
    dispatch({ type: "UPDATE_EXAM", payload: updatedExam });
  }, []);

  return (
    <ExamContext.Provider
      value={{
        ...state,
        createExam,
        updateExam,
        deleteExam,
        updateStudentsInExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

// 5. Opret Custom Hook
export const useExams = () => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error("useExams must be used within an ExamProvider");
  }
  return context;
};
