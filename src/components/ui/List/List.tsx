import React from "react";
import styles from "./List.module.css";

/*
Genanvendelig List som bruges til at vise information i en liste
i et grid
*/

// T er en generisk type. Det kan være Exam, Student, eller hvad som helst.
// Vi kræver at T har en id, som kan være string eller number
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyListMessage?: string;
  className?: string;
}

const List = <T extends { id: string | number }>({
  items,
  renderItem,
  emptyListMessage = "Der er ingen elementer at vise.",
  className = "",
}: ListProps<T>) => {
  const listClasses = `${styles.list} ${className}`;

  return (
    <div className={listClasses}>
      {items.length > 0 ? (
        items.map((item) => renderItem(item))
      ) : (
        <p className={styles.emptyMessage}>{emptyListMessage}</p>
      )}
    </div>
  );
};

export default List;
