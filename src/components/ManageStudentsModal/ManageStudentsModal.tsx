import { useState, useEffect } from "react";
import type { Exam, Student } from "../../types/types";
import * as api from "../../services/api";
import AddStudentForm from "../Forms/AddStudentForm/AddStudentForm";
import Button from "../ui/Button/Button";
import styles from "./ManageStudentsModal.module.css";

interface ManageStudentsModalProps {
  exam: Exam;
  onClose: () => void;
  onStudentsUpdate: (updatedExam: Exam) => void;
}

const ManageStudentsModal = ({
  exam,
  onClose,
  onStudentsUpdate,
}: ManageStudentsModalProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Sorter studerende baseret på deres 'order'-felt, når komponenten indlæses
    const sortedStudents = [...exam.students].sort((a, b) => a.order - b.order);
    setStudents(sortedStudents);
  }, [exam.students]);

  const handleStudentAdded = (newStudent: Student) => {
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    // Opdater den overordnede state med det samme
    onStudentsUpdate({ ...exam, students: updatedStudents });
  };

  const moveStudent = (index: number, direction: "up" | "down") => {
    const newStudents = [...students];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Byt plads på de to elementer
    [newStudents[index], newStudents[targetIndex]] = [
      newStudents[targetIndex],
      newStudents[index],
    ];

    setStudents(newStudents);
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      // Opret et array med kun id og den nye 'order' (index)
      const studentsToUpdate = students.map((student, index) => ({
        id: student.id,
        order: index,
      }));

      await api.updateStudentOrder(studentsToUpdate);

      // Opdater den overordnede state med den gemte rækkefølge
      const savedStudents = students.map((s, i) => ({ ...s, order: i }));
      onStudentsUpdate({ ...exam, students: savedStudents });

      onClose(); // Luk modalen efter succesfuld gemning
    } catch (error) {
      console.error("Failed to save student order", error);
      // Her kunne man vise en fejlbesked
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sektion til at tilføje nye studerende */}
      <div className={styles.addFormSection}>
        <h4>Tilføj ny studerende</h4>
        <AddStudentForm
          examId={exam.id}
          onStudentAdded={handleStudentAdded}
          onCancel={onClose}
        />
      </div>

      {/* Sektion til at omarrangere studerende */}
      <div className={styles.reorderSection}>
        <h4>Eksamensrækkefølge</h4>
        <div className={styles.studentList}>
          {students.map((student, index) => (
            <div key={student.id} className={styles.studentItem}>
              <span>
                {index + 1}. {student.name}
              </span>
              <div className={styles.buttons}>
                <button
                  onClick={() => moveStudent(index, "up")}
                  disabled={index === 0}
                >
                  ▲
                </button>
                <button
                  onClick={() => moveStudent(index, "down")}
                  disabled={index === students.length - 1}
                >
                  ▼
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.saveAction}>
          <Button onClick={handleSaveOrder} disabled={isSaving}>
            {isSaving ? "Gemmer..." : "Gem Rækkefølge"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageStudentsModal;
