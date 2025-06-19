// src/components/ExamCard/ExamCard.tsx

import { Link } from "react-router-dom";
import type { Exam } from "../../types/types";
import Button from "../ui/Button/Button";
import styles from "./ExamCard.module.css";

interface ExamCardProps {
  exam: Exam;
  onAddStudentClick: (examId: string) => void;
  onCardClick: (exam: Exam) => void; // Ny prop for at åbne studenter-modal
}

const ExamCard = ({ exam, onAddStudentClick, onCardClick }: ExamCardProps) => {
  // Stopper event propagation, så klik på knapper ikke udløser onCardClick
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    // Hele kortet har nu en onClick-handler
    <div className={styles.examCard} onClick={() => onCardClick(exam)}>
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
      <div className={styles.cardActions} onClick={handleActionClick}>
        <Link to={`/exam/${exam.id}`}>
          <Button variant="primary" disabled={exam.students.length === 0}>
            Start Eksamen
          </Button>
        </Link>
        <Button variant="secondary" onClick={() => onAddStudentClick(exam.id)}>
          Tilføj Studerende
        </Button>
      </div>
    </div>
  );
};

export default ExamCard;
