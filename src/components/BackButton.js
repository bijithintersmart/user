"use client";
import Link from "next/link";
import styles from "./BackButton.module.css";

export default function BackButton() {
  return (
    <div className={styles.backButtonContainer}>
      <Link href="/" className={styles.backButton}>
        ← Back to Home
      </Link>
    </div>
  );
}
