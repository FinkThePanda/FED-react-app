// src/components/Layout/Header/Header.tsx

import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          Eksamens-App
        </NavLink>
        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            end // 'end' prop sikrer, at denne kun er aktiv for den præcise sti "/"
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Historik
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
