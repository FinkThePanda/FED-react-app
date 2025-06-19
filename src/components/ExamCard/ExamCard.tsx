import { Link } from "react-router-dom";
import type { Exam } from "../../types/types";
import Button from "../ui/Button/Button";
import styles from "./ExamCard.module.css";

interface ExamCardProps {
  exam: Exam;
  onManageStudentsClick: (exam: Exam) => void;
  onCardClick: (exam: Exam) => void;
  onEditClick: (exam: Exam) => void;
  onDeleteClick: (examId: string) => void;
}

const ExamCard = ({
  exam,
  onManageStudentsClick,
  onCardClick,
  onEditClick,
  onDeleteClick,
}: ExamCardProps) => {
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.examCard} onClick={() => onCardClick(exam)}>
      <div className={styles.cardTop}>
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
        <div onClick={handleActionClick}>
          <Button variant="secondary" onClick={() => onEditClick(exam)}>
            Edit
          </Button>
        </div>
      </div>

      <div className={styles.cardActions} onClick={handleActionClick}>
        <div className={styles.topActions}>
          <Link to={`/exam/${exam.id}`}>
            <Button variant="primary" disabled={exam.students.length === 0}>
              Start Eksamen
            </Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => onManageStudentsClick(exam)}
          >
            Administrer Studerende
          </Button>
        </div>
        <Button
          variant="danger"
          onClick={() => onDeleteClick(exam.id)}
          className={styles.deleteButton}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ExamCard;
