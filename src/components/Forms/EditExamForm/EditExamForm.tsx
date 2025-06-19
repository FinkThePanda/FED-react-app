import React, { useState, useEffect } from "react";
import type { Exam } from "../../../types/types";
import styles from "./EditExamForm.module.css";

interface EditExamFormProps {
  exam: Exam;
  onUpdateExam: (updatedExam: Exam) => void;
  onClose: () => void;
}

const EditExamForm: React.FC<EditExamFormProps> = ({
  exam,
  onUpdateExam,
  onClose,
}) => {
  const [courseName, setCourseName] = useState(exam.courseName);
  const [examtermin, setExamtermin] = useState(exam.examtermin);
  const [date, setDate] = useState(exam.date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedExam = { ...exam, courseName, examtermin, date };
    onUpdateExam(updatedExam);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="courseName">Course Name</label>
        <input
          id="courseName"
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="examtermin">Exam Termin</label>
        <input
          id="examtermin"
          type="text"
          value={examtermin}
          onChange={(e) => setExamtermin(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="date">Exam Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className={styles.formActions}>
        <button type="submit">Update Exam</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditExamForm;
