import type { Exam } from "../../types/types";
import styles from "./ExamResultModal.module.css";

interface ExamResultModalProps {
  exam: Exam;
}

const ExamResultModal = ({ exam }: ExamResultModalProps) => {
  const gradedStudents = exam.students.filter((s) => s.grade);

  return (
    <div className={styles.resultContainer}>
      {gradedStudents.length > 0 ? (
        <table className={styles.resultTable}>
          <thead>
            <tr>
              <th>Navn</th>
              <th>Studienr.</th>
              <th>Spørgsmål</th>
              <th>Karakter</th>
            </tr>
          </thead>
          <tbody>
            {gradedStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.studentNo}</td>
                <td>{student.questionNo ?? "N/A"}</td>
                <td>
                  <strong>{student.grade}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Der er ingen bedømte studerende for denne eksamen.</p>
      )}
    </div>
  );
};

export default ExamResultModal;
