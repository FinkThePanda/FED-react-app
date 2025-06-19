// src/pages/HomePage/HomePage.tsx
import { useState, useEffect } from "react";
import type { Exam } from "../../types/types";
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

const HomePage = () => {
  // States
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States til at styre modaler
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [deletingExamId, setDeletingExamId] = useState<string | null>(null);
  const [managingStudentsFor, setManagingStudentsFor] = useState<Exam | null>(
    null
  );
  const [viewingStudentsFor, setViewingStudentsFor] = useState<Exam | null>(
    null
  );

  // Hent data ved start
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

  const handleExamUpdated = async (updatedExam: Exam) => {
    try {
      const returnedExam = await api.updateExam(updatedExam);
      setExams((prev) =>
        prev.map((ex) => (ex.id === returnedExam.id ? returnedExam : ex))
      );
      setEditingExam(null);
    } catch (error) {
      setError("Failed to update exam. Please try again later.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingExamId) return;
    try {
      await api.deleteExam(deletingExamId);
      setExams((prev) => prev.filter((ex) => ex.id !== deletingExamId));
      setDeletingExamId(null);
    } catch (error) {
      setError("Failed to delete exam. Please try again later.");
    }
  };

  // Funktion til at opdatere exams-state, når studerende er blevet ændret
  const handleStudentsUpdate = (updatedExam: Exam) => {
    setExams((prev) =>
      prev.map((ex) => (ex.id === updatedExam.id ? updatedExam : ex))
    );
  };

  const handleExamCreated = (newExam: Exam) => {
    setExams((prevExams) => [...prevExams, newExam]);
    setIsCreateModalOpen(false);
  };

  const handleCardClick = (exam: Exam) => {
    setViewingStudentsFor(exam);
  };

  const handleEditClick = (exam: Exam) => {
    setEditingExam(exam);
  };

  const handleDeleteClick = (examId: string) => {
    setDeletingExamId(examId);
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!viewingStudentsFor) return;

    try {
      await api.deleteStudent(studentId);

      const updatedStudents = viewingStudentsFor.students.filter(
        (s) => s.id !== studentId
      );

      const updatedExam = { ...viewingStudentsFor, students: updatedStudents };

      setViewingStudentsFor(updatedExam);
      setExams((prevExams) =>
        prevExams.map((exam) =>
          exam.id === updatedExam.id ? updatedExam : exam
        )
      );
    } catch (err) {
      setError("Failed to delete student. Please try again later.");
    }
  };

  if (isLoading) return <p>Henter eksamener...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Opret Ny Eksamen
        </Button>
      </header>

      {/* --- Modaler --- */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Opret Ny Eksamen"
      >
        <CreateExamForm onExamCreated={handleExamCreated} />
      </Modal>

      {editingExam && (
        <Modal
          isOpen={!!editingExam}
          onClose={() => setEditingExam(null)}
          title={`Edit Exam: ${editingExam.courseName}`}
        >
          <EditExamForm
            exam={editingExam}
            onUpdateExam={handleExamUpdated}
            onClose={() => setEditingExam(null)}
          />
        </Modal>
      )}

      {deletingExamId && (
        <Modal
          isOpen={!!deletingExamId}
          onClose={() => setDeletingExamId(null)}
          title="Confirm Deletion"
        >
          <div>
            <p>Are you sure you want to delete this exam?</p>
            <Button onClick={handleConfirmDelete} variant="danger">
              Delete
            </Button>
            <Button onClick={() => setDeletingExamId(null)} variant="secondary">
              Cancel
            </Button>
          </div>
        </Modal>
      )}

      {managingStudentsFor && (
        <Modal
          isOpen={!!managingStudentsFor}
          onClose={() => setManagingStudentsFor(null)}
          title={`Administrer Studerende for: ${managingStudentsFor.courseName}`}
        >
          <ManageStudentsModal
            exam={managingStudentsFor}
            onClose={() => setManagingStudentsFor(null)}
            onStudentsUpdate={handleStudentsUpdate}
          />
        </Modal>
      )}

      {viewingStudentsFor && (
        <Modal
          isOpen={!!viewingStudentsFor}
          onClose={() => setViewingStudentsFor(null)}
          title={`Studerende på: ${viewingStudentsFor.courseName}`}
        >
          <StudentListModal
            students={viewingStudentsFor.students}
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
              onCardClick={handleCardClick}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
              onManageStudentsClick={setManagingStudentsFor}
            />
          )}
        />
      </section>
    </div>
  );
};

export default HomePage;
