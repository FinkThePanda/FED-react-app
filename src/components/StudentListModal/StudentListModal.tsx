// src/components/StudentListModal/StudentListModal.tsx

import type { Student } from "../../types/types";
import styles from "./StudentListModal.module.css";

interface StudentListModalProps {
  students: Student[];
}

const StudentListModal = ({ students }: StudentListModalProps) => {
  return (
    <div className={styles.studentListContainer}>
      {students.length > 0 ? (
        <ul className={styles.studentList}>
          {students.map((student) => (
            <li key={student.id} className={styles.studentItem}>
              <span className={styles.studentName}>{student.name}</span>
              <span className={styles.studentNo}>
                Studienr: {student.studentNo}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Der er endnu ingen studerende tilmeldt denne eksamen.</p>
      )}
    </div>
  );
};

export default StudentListModal;
