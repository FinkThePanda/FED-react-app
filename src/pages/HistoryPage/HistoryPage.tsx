// src/pages/HistoryPage/HistoryPage.tsx
import { useHistoryPage } from "../../hooks/useHistoryPage";

// Importer UI komponenter
import Card from "../../components/ui/Card/Card";
import List from "../../components/ui/List/List";
import FilterControls from "../../components/ui/FilterControls/FilterControls";
import Modal from "../../components/ui/Modal/Modal";
import ExamResultModal from "../../components/ExamResultModal/ExamResultModal";

import styles from "./HistoryPage.module.css";

const HistoryPage = () => {
  // Kald hook'en for at få al state og alle actions
  const { state, actions } = useHistoryPage();
  const {
    isLoading,
    error,
    filters,
    displayCount,
    viewingResultsFor,
    uniqueCourses,
    uniqueTerms,
    processedExams,
  } = state;
  const {
    setFilters,
    setDisplayCount,
    setViewingResultsFor,
    handleCardClick,
    calculateAverageGrade,
  } = actions;

  if (isLoading) return <p>Henter historik...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.historyPage}>
      <h1>Eksamenshistorik</h1>

      <FilterControls
        filters={filters}
        setFilters={setFilters}
        uniqueCourses={uniqueCourses}
        uniqueTerms={uniqueTerms}
      />

      <div className={styles.displayCountControl}>
        <label htmlFor="displayCount">Vis antal:</label>
        <input
          type="number"
          id="displayCount"
          value={displayCount}
          min="1"
          onChange={(e) =>
            setDisplayCount(Math.max(1, parseInt(e.target.value, 10) || 1))
          }
          className={styles.displayCountInput}
        />
      </div>

      <List
        items={processedExams}
        emptyListMessage="Ingen eksamener matcher dine filterkriterier."
        renderItem={(exam) => (
          <Card key={exam.id} onClick={() => handleCardClick(exam)}>
            <div className={styles.cardContent}>
              <h3 className={styles.courseName}>{exam.courseName}</h3>
              <p className={styles.details}>
                <strong>Termin:</strong> {exam.examtermin} |{" "}
                <strong>Dato:</strong>{" "}
                {new Date(exam.date).toLocaleDateString("da-DK")}
              </p>
            </div>
            <div className={styles.summary}>
              <span>
                Gns. Karakter: <strong>{calculateAverageGrade(exam)}</strong>
              </span>
              <span>
                Studerende: <strong>{exam.students.length}</strong>
              </span>
            </div>
          </Card>
        )}
      />

      {viewingResultsFor && (
        <Modal
          isOpen={!!viewingResultsFor}
          onClose={() => setViewingResultsFor(null)}
          title={`Resultater for: ${viewingResultsFor.courseName}`}
        >
          <ExamResultModal exam={viewingResultsFor} />
        </Modal>
      )}
    </div>
  );
};

export default HistoryPage;
