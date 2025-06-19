// src/pages/HomePage/HomePage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Exam, Student } from "../../types/types";
import * as api from "../../services/api";

// Importer generiske UI-komponenter
import Card from "../../components/ui/Card/Card";
import List from "../../components/ui/List/List";
import Button from "../../components/ui/Button/Button";
import Modal from "../../components/ui/Modal/Modal";

// Importer side-specifikke komponenter
import CreateExamForm from "../../components/Forms/CreateExamForm/CreateExamForm";
import ManageStudentsModal from "../../components/ManageStudentsModal/ManageStudentsModal";
import StudentListModal from "../../components/StudentListModal/StudentListModal";

// Importer side-specifik styling
import styles from "./HomePage.module.css";

const HomePage = () => {
  // States
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States til at styre modaler
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
          <StudentListModal students={viewingStudentsFor.students} />
        </Modal>
      )}

      <h2 className={styles.subHeader}>Kommende Eksamener</h2>

      <List
        items={exams}
        emptyListMessage="Der er ingen kommende eksamener."
        renderItem={(exam) => (
          <Card key={exam.id} onClick={() => handleCardClick(exam)}>
            <div className={styles.cardContent}>
              <h3>{exam.courseName}</h3>
              <p>
                <strong>Dato:</strong>{" "}
                {new Date(exam.date).toLocaleDateString("da-DK")}
              </p>
              <p>
                <strong>Tilmeldte studerende:</strong> {exam.students.length}
              </p>
            </div>
            <div
              className={styles.cardActions}
              onClick={(e) => e.stopPropagation()}
            >
              <Link to={`/exam/${exam.id}`}>
                <Button variant="primary" disabled={exam.students.length === 0}>
                  Start Eksamen
                </Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => setManagingStudentsFor(exam)}
              >
                Administrer Studerende
              </Button>
            </div>
          </Card>
        )}
      />
    </div>
  );
};

export default HomePage;
