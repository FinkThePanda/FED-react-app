import type { Exam } from "../../types/types";
import ExamCard from "../ExamCard/ExamCard";
import styles from "./ExamList.module.css";

interface ExamListProps {
  exams: Exam[];
  onManageStudentsClick: (exam: Exam) => void;
  onCardClick: (exam: Exam) => void;
  onEditClick: (exam: Exam) => void;
  onDeleteClick: (examId: string) => void;
}

const ExamList = ({
  exams,
  onManageStudentsClick,
  onCardClick,
  onEditClick,
  onDeleteClick,
}: ExamListProps) => {
  return (
    <div className={styles.examList}>
      {exams.length > 0 ? (
        exams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onManageStudentsClick={onManageStudentsClick}
            onCardClick={onCardClick}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        ))
      ) : (
        <p>Der er ingen kommende eksamener.</p>
      )}
    </div>
  );
};

export default ExamList;
