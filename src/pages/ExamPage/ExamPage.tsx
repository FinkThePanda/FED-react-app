import { useParams, Link } from "react-router-dom";
import { useExam } from "../../hooks/useExam"; // Importer vores nye hook
import { formatTime } from "../../utils/time"; // Importer vores nye util
import { ExamPhase } from "../../types/enums";
import Button from "../../components/ui/Button/Button";
import styles from "./ExamPage.module.css";

const ExamPage = () => {
  const { examId } = useParams<{ examId: string }>();
  // Kald vores hook for at få al state og alle funktioner
  const { state, actions } = useExam(examId);

  // Destructure state og actions for nemmere brug
  const {
    isLoading,
    error,
    exam,
    currentStudentIndex,
    phase,
    drawnQuestion,
    timer,
    notes,
    grade,
    timeUsed,
  } = state;
  const {
    setNotes,
    setGrade,
    handleDrawQuestion,
    handleStartExamination,
    handleSaveAndNext,
    handleSkipStudent,
    handleFinishExam,
  } = actions;

  if (isLoading) return <p>Henter data...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!exam || !exam.students[currentStudentIndex])
    return <p>Eksamen eller studerende ikke fundet.</p>;

  const currentStudent = exam.students[currentStudentIndex];
  const grades = ["-3", "00", "02", "4", "7", "10", "12"];

  return (
    <div className={styles.examPage}>
      <header className={styles.examHeader}>
        <h1>{exam.courseName}</h1>
        <h2>
          {new Date(exam.date).toLocaleDateString("da-DK")} - {exam.startTime}
        </h2>
        <Link to="/" className={styles.backLink}>
          &larr; Tilbage til Dashboard
        </Link>
      </header>

      {phase === ExamPhase.Finished ? (
        <div className={styles.finishedContainer}>
          <h2>Eksamen er afsluttet og arkiveret!</h2>
          <p>Du bliver sendt tilbage til dashboardet...</p>
        </div>
      ) : phase === ExamPhase.AllStudentsGraded ? (
        <div className={styles.finishedContainer}>
          <h2>Alle studerende er blevet eksamineret.</h2>
          <p>Du kan nu afslutte og arkivere eksamenen.</p>
          <Button onClick={handleFinishExam} variant="primary">
            Afslut og Arkivér Eksamen
          </Button>
        </div>
      ) : (
        <div className={styles.studentContainer}>
          <div className={styles.studentInfo}>
            <h3>Eksaminand: {currentStudent.name}</h3>
            <p>Studienr: {currentStudent.studentNo}</p>
            <p>
              Studerende {currentStudentIndex + 1} af {exam.students.length}
            </p>
            {currentStudentIndex < exam.students.length - 1 && (
              <button onClick={handleSkipStudent} className={styles.skipButton}>
                Spring til næste &rarr;
              </button>
            )}
          </div>

          <div className={styles.examControls}>
            {phase === ExamPhase.WaitingForStudent && (
              <Button onClick={handleDrawQuestion}>Træk Spørgsmål</Button>
            )}

            {phase === ExamPhase.QuestionDrawn && (
              <>
                <p>
                  Trukket spørgsmål: <strong>{drawnQuestion}</strong>
                </p>
                <Button onClick={handleStartExamination}>
                  Start Eksamination
                </Button>
              </>
            )}

            {(phase === ExamPhase.Examining || phase === ExamPhase.Grading) && (
              <>
                <div
                  className={styles.timerDisplay}
                  style={{
                    color:
                      phase === ExamPhase.Grading && timer < 60
                        ? "red"
                        : "black",
                  }}
                >
                  {formatTime(timer)}
                </div>
                <textarea
                  className={styles.notesArea}
                  placeholder="Indtast noter her..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className={styles.gradingSection}>
                  {phase === ExamPhase.Grading && (
                    <p>Faktisk eksamenstid: {formatTime(timeUsed)}</p>
                  )}
                  <label htmlFor="grade">Vælg Karakter:</label>
                  <select
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  >
                    <option value="" disabled>
                      Vælg...
                    </option>
                    {grades.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  <Button onClick={handleSaveAndNext} disabled={grade === ""}>
                    Gem og Næste Studerende
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
