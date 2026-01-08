import styles from "../app/page.module.css";
import { v4 as uuidv4 } from "uuid";

export default function AddUserButton({ path, title }) {
  const uuid = uuidv4();
  return (
    <div>
      <a href={path ? path : `/${uuid}`} className={styles.buttonclass}>
        {title ? title : "PICK ONE"}
      </a>
    </div>
  );
}
