import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p>&copy; {currentYear} Eksamens-App. Alle rettigheder forbeholdes.</p>
    </footer>
  );
};

export default Footer;
