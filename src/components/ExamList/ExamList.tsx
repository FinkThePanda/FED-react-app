// src/components/ExamList/ExamList.tsx

import type { Exam } from "../../types/types";
import ExamCard from "../ExamCard/ExamCard";
import styles from "./ExamList.module.css";

interface ExamListProps {
  exams: Exam[];
  onAddStudentClick: (examId: string) => void;
  onCardClick: (exam: Exam) => void; // Ny prop
}

const ExamList = ({ exams, onAddStudentClick, onCardClick }: ExamListProps) => {
  return (
    <div className={styles.examList}>
      {exams.length > 0 ? (
        exams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onAddStudentClick={onAddStudentClick}
            onCardClick={onCardClick} // Sendes videre her
          />
        ))
      ) : (
        <p>Der er ingen kommende eksamener.</p>
      )}
    </div>
  );
};

export default ExamList;
