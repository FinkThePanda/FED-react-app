// src/components/FilterControls/FilterControls.tsx

import React from "react";
import styles from "./FilterControls.module.css";

// TypeScript interface for de props, komponenten forventer
export interface FilterOptions {
  course: string;
  term: string;
  sortOrder: "asc" | "desc";
}

interface FilterControlsProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  uniqueCourses: string[];
  uniqueTerms: string[];
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  setFilters,
  uniqueCourses,
  uniqueTerms,
}) => {
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortToggle = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGroup}>
        <label htmlFor="course">
          <strong>Kursus</strong>
        </label>
        <select
          id="course"
          name="course"
          value={filters.course}
          onChange={handleFilterChange}
        >
          <option value="">Alle</option>
          {uniqueCourses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="term">
          <strong>Termin</strong>
        </label>
        <select
          id="term"
          name="term"
          value={filters.term}
          onChange={handleFilterChange}
        >
          <option value="">Alle</option>
          {uniqueTerms.map((term) => (
            <option key={term} value={term}>
              {term}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label>
          <strong>Sorter efter dato</strong>
        </label>
        <button onClick={handleSortToggle} className={styles.sortButton}>
          {filters.sortOrder === "desc" ? "Nyeste først ▼" : "Ældste først ▲"}
        </button>
      </div>
    </div>
  );
};

export default FilterControls;
