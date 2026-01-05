import Image from "next/image";
import styles from "./page.module.css";
import UserList from "../components/userList";

export default async function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Random User Directory</h1>
          <p>
            This page displays a list of randomly generated users along with
            their basic details. You can click on any user to view more
            information. The user list is refreshed on every page reload, so the
            results may differ each time.
          </p>
        </div>
        <UserList />
      </main>
    </div>
  );
}
