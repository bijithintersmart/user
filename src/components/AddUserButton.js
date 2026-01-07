"use client";

import Link from "next/link";
import styles from "../app/page.module.css";
import { v4 as uuidv4 } from "uuid";

export default function AddUserButton() {
  const handleClick = () => {
    console.log("clicked");
  };
  const uuid = uuidv4();

  return (
    <a href={`/${uuid}`}>
      <button className={styles.buttonclass} onClick={handleClick}>
        PICK ONE
      </button>
    </a>
  );
}
