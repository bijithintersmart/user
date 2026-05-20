"use client";
import styles from "../app/page.module.css";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function AddButton({ path, title }) {
  const router = useRouter();

  const handleClick = () => {
    if (path) {
      router.push(path);
    } else {
      router.push(`/user/${uuidv4()}`);
    }
  };

  return (
    <div>
      <button onClick={handleClick} className={styles.buttonclass}>
        {title ? title : "RANDOM USER"}
      </button>
    </div>
  );
}
