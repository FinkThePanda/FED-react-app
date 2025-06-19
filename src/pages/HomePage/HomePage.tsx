import { useReducer, useCallback } from "react";
import type { Exam } from "../../types/types";
import { useExams } from "../../context/ExamContext";
import * as api from "../../services/api";

// Importer generiske UI-komponenter
import List from "../../components/ui/List/List";
import Button from "../../components/ui/Button/Button";
import Modal from "../../components/ui/Modal/Modal";

// Importer side-specifikke komponenter
import CreateExamForm from "../../components/Forms/CreateExamForm/CreateExamForm";
import EditExamForm from "../../components/Forms/EditExamForm/EditExamForm";
import ManageStudentsModal from "../../components/ManageStudentsModal/ManageStudentsModal";
import StudentListModal from "../../components/StudentListModal/StudentListModal";
import ExamCard from "../../components/ExamCard/ExamCard";

// Importer side-specifik styling
import styles from "./HomePage.module.css";

// 1. State and Actions for the local UI reducer
interface HomePageState {
  isCreateModalOpen: boolean;
  editingExam: Exam | null;
  deletingExamId: string | null;
  managingStudentsFor: Exam | null;
  viewingStudentsFor: Exam | null;
}

type Action =
  | { type: "OPEN_CREATE_MODAL" }
  | { type: "OPEN_EDIT_MODAL"; payload: Exam }
  | { type: "OPEN_DELETE_MODAL"; payload: string }
  | { type: "OPEN_MANAGE_STUDENTS_MODAL"; payload: Exam }
  | { type: "OPEN_VIEW_STUDENTS_MODAL"; payload: Exam }
  | { type: "UPDATE_VIEWING_STUDENTS"; payload: Exam } // For student deletion
  | { type: "CLOSE_MODALS" };

const initialState: HomePageState = {
  isCreateModalOpen: false,
  editingExam: null,
  deletingExamId: null,
  managingStudentsFor: null,
  viewingStudentsFor: null,
};

const homePageReducer = (
  state: HomePageState,
  action: Action
): HomePageState => {
  switch (action.type) {
    case "OPEN_CREATE_MODAL":
      return { ...initialState, isCreateModalOpen: true };
    case "OPEN_EDIT_MODAL":
      return { ...initialState, editingExam: action.payload };
    case "OPEN_DELETE_MODAL":
      return { ...initialState, deletingExamId: action.payload };
    case "OPEN_MANAGE_STUDENTS_MODAL":
      return { ...initialState, managingStudentsFor: action.payload };
    case "OPEN_VIEW_STUDENTS_MODAL":
      return { ...initialState, viewingStudentsFor: action.payload };
    case "UPDATE_VIEWING_STUDENTS":
      return { ...state, viewingStudentsFor: action.payload };
    case "CLOSE_MODALS":
      return { ...initialState };
    default:
      return state;
  }
};

const HomePage = () => {
  // 2. Get global state and actions from Context
  const {
    exams,
    isLoading,
    error,
    createExam,
    updateExam,
    deleteExam,
    updateStudentsInExam,
  } = useExams();

  // 3. Manage local UI state with a reducer
  const [uiState, dispatch] = useReducer(homePageReducer, initialState);

  // 4. Define Handlers with useCallback
  const handleCreateExam = useCallback(
    async (examData: Omit<Exam, "id" | "students" | "status">) => {
      await createExam(examData);
      dispatch({ type: "CLOSE_MODALS" });
    },
    [createExam]
  );

  const handleUpdateExam = useCallback(
    async (examData: Exam) => {
      await updateExam(examData);
      dispatch({ type: "CLOSE_MODALS" });
    },
    [updateExam]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!uiState.deletingExamId) return;
    await deleteExam(uiState.deletingExamId);
    dispatch({ type: "CLOSE_MODALS" });
  }, [deleteExam, uiState.deletingExamId]);

  const handleDeleteStudent = useCallback(
    async (studentId: string) => {
      if (!uiState.viewingStudentsFor) return;
      try {
        await api.deleteStudent(studentId);
        const updatedStudents = uiState.viewingStudentsFor.students.filter(
          (s) => s.id !== studentId
        );
        const updatedExam = {
          ...uiState.viewingStudentsFor,
          students: updatedStudents,
        };
        updateStudentsInExam(updatedExam);
        dispatch({ type: "UPDATE_VIEWING_STUDENTS", payload: updatedExam });
      } catch {
        // Error handling can be improved by adding a local error state or enhancing the context
        console.error("Failed to delete student");
      }
    },
    [uiState.viewingStudentsFor, updateStudentsInExam]
  );

  // --- Render Logic ---
  if (isLoading) return <p>Henter eksamener...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <Button onClick={() => dispatch({ type: "OPEN_CREATE_MODAL" })}>
          Opret Ny Eksamen
        </Button>
      </header>

      {/* --- Modals --- */}
      <Modal
        isOpen={uiState.isCreateModalOpen}
        onClose={() => dispatch({ type: "CLOSE_MODALS" })}
        title="Opret Ny Eksamen"
      >
        <CreateExamForm onExamCreated={handleCreateExam} />
      </Modal>

      {uiState.editingExam && (
        <Modal
          isOpen={!!uiState.editingExam}
          onClose={() => dispatch({ type: "CLOSE_MODALS" })}
          title={`Edit Exam: ${uiState.editingExam.courseName}`}
        >
          <EditExamForm
            exam={uiState.editingExam}
            onUpdateExam={handleUpdateExam}
            onClose={() => dispatch({ type: "CLOSE_MODALS" })}
          />
        </Modal>
      )}

      {uiState.deletingExamId && (
        <Modal
          isOpen={!!uiState.deletingExamId}
          onClose={() => dispatch({ type: "CLOSE_MODALS" })}
          title="Confirm Deletion"
        >
          <div>
            <p>Are you sure you want to delete this exam?</p>
            <Button onClick={handleConfirmDelete} variant="danger">
              Delete
            </Button>
            <Button
              onClick={() => dispatch({ type: "CLOSE_MODALS" })}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}

      {uiState.managingStudentsFor && (
        <Modal
          isOpen={!!uiState.managingStudentsFor}
          onClose={() => dispatch({ type: "CLOSE_MODALS" })}
          title={`Administrer Studerende for: ${uiState.managingStudentsFor.courseName}`}
        >
          <ManageStudentsModal
            exam={uiState.managingStudentsFor}
            onClose={() => dispatch({ type: "CLOSE_MODALS" })}
            onStudentsUpdate={updateStudentsInExam}
          />
        </Modal>
      )}

      {uiState.viewingStudentsFor && (
        <Modal
          isOpen={!!uiState.viewingStudentsFor}
          onClose={() => dispatch({ type: "CLOSE_MODALS" })}
          title={`Studerende på: ${uiState.viewingStudentsFor.courseName}`}
        >
          <StudentListModal
            students={uiState.viewingStudentsFor.students}
            onDeleteStudent={handleDeleteStudent}
          />
        </Modal>
      )}

      <section className={styles.examSection}>
        <h2>Kommende Eksamener</h2>
        <List
          items={exams}
          renderItem={(exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onCardClick={(ex) =>
                dispatch({ type: "OPEN_VIEW_STUDENTS_MODAL", payload: ex })
              }
              onEditClick={(ex) =>
                dispatch({ type: "OPEN_EDIT_MODAL", payload: ex })
              }
              onDeleteClick={(id) =>
                dispatch({ type: "OPEN_DELETE_MODAL", payload: id })
              }
              onManageStudentsClick={(ex) =>
                dispatch({ type: "OPEN_MANAGE_STUDENTS_MODAL", payload: ex })
              }
            />
          )}
        />
      </section>
    </div>
  );
};

export default HomePage;
