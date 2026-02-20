"use client";
import styles from "../app/page.module.css";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";

export default function AddButton({ path, title }) {
  const [uuid, setUuid] = useState("");

  useEffect(() => {
    setUuid(uuidv4());
  }, []);

  return (
    <div>
      <a
        href={path ? path : `/user/${uuid || "loading"}`}
        className={styles.buttonclass}
      >
        {title ? title : "RANDOM USER"}
      </a>
    </div>
  );
}
