import styles from "@/app/page.module.css";

export default function AlertDialog({ open, message, onClose }) {
  if (!open) return null;

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialogBox}>
        <h3>Validation Error</h3>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
