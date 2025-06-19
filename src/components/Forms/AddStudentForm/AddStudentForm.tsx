import React, { useState } from "react";
import type { Student } from "../../../types/types";
import * as api from "../../../services/api";
import Button from "../../ui/Button/Button";
import styles from "./AddStudentForm.module.css"; // Genbruger stilarter

interface AddStudentFormProps {
  examId: string;
  onStudentAdded: (newStudent: Student) => void;
  onCancel: () => void;
}

const AddStudentForm = ({
  examId,
  onStudentAdded,
  onCancel,
}: AddStudentFormProps) => {
  const [formData, setFormData] = useState({ studentNo: "", name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentNo || !formData.name) {
      setError("Alle felter skal udfyldes.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const newStudentData = { ...formData, examId, order: 0 };
      const createdStudent = await api.addStudent(newStudentData);
      onStudentAdded(createdStudent);
    } catch (err) {
      setError("Kunne ikke tilføje studerende. Prøv igen.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className={styles.formGroup}>
        <label htmlFor="studentNo">Studienummer</label>
        <input
          type="text"
          id="studentNo"
          name="studentNo"
          value={formData.studentNo}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="name">Fulde Navn</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div
        className={styles.formActions}
        style={{ justifyContent: "space-between" }}
      >
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuller
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Tilføjer..." : "Tilføj Studerende"}
        </Button>
      </div>
    </form>
  );
};

export default AddStudentForm;
