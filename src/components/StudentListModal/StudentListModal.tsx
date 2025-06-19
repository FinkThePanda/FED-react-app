// src/components/StudentListModal/StudentListModal.tsx

import type { Student } from "../../types/types";
import Button from "../ui/Button/Button";
import styles from "./StudentListModal.module.css";

interface StudentListModalProps {
  students: Student[];
  onDeleteStudent: (studentId: string) => void;
}

const StudentListModal = ({
  students,
  onDeleteStudent,
}: StudentListModalProps) => {
  return (
    <div className={styles.studentListContainer}>
      {students.length > 0 ? (
        <ul className={styles.studentList}>
          {students.map((student) => (
            <li key={student.id} className={styles.studentItem}>
              <div className={styles.studentInfo}>
                <span className={styles.studentName}>{student.name}</span>
                <span className={styles.studentNo}>
                  Studienr: {student.studentNo}
                </span>
              </div>
              <Button
                variant="danger"
                onClick={() => onDeleteStudent(student.id)}
              >
                Delete
              </Button>
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
