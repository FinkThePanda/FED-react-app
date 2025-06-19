import React, { useState } from "react";
import type { Exam } from "../../../types/types";
import * as api from "../../../services/api";
import Button from "../../ui/Button/Button";
import styles from "./CreateExamForm.module.css";

interface CreateExamFormProps {
  onExamCreated: (newExam: Exam) => void;
}

const CreateExamForm = ({ onExamCreated }: CreateExamFormProps) => {
  const [formData, setFormData] = useState({
    examtermin: "",
    courseName: "",
    date: "",
    numberOfQuestions: 10,
    examDurationMinutes: 20,
    startTime: "09:00",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Omit<Exam, 'id' | 'students'> matcher det, vores API-funktion forventer
      const newExam = await api.createExam(formData);
      onExamCreated(newExam);
    } catch (error) {
      console.error("Failed to create exam", error);
      // Her kunne man vise en fejlmeddelelse til brugeren
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="courseName">Kursusnavn</label>
        <input
          type="text"
          id="courseName"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="examtermin">Eksamenstermin</label>
        <input
          type="text"
          id="examtermin"
          name="examtermin"
          placeholder="f.eks. sommer 25"
          value={formData.examtermin}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="date">Dato</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="startTime">Starttidspunkt</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="numberOfQuestions">Antal spørgsmål</label>
          <input
            type="number"
            id="numberOfQuestions"
            name="numberOfQuestions"
            min="1"
            value={formData.numberOfQuestions}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="examDurationMinutes">Eksamenstid (minutter)</label>
          <input
            type="number"
            id="examDurationMinutes"
            name="examDurationMinutes"
            min="1"
            value={formData.examDurationMinutes}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className={styles.formActions}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Opretter..." : "Opret Eksamen"}
        </Button>
      </div>
    </form>
  );
};

export default CreateExamForm;
