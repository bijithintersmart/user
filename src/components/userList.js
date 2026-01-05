import Image from "next/image";
import styles from "../app/page.module.css";
import Link from "next/link";

export default async function UserList(params) {
  const data = await fetch("https://randomuser.me/api/?results=50");
  const userList = await data.json();

  return (
    <ul className={styles.userList}>
      {userList.results.map((post) => (
        <li key={post.login.uuid} className={styles.userListItem}>
          <Link
            href={`/${post.login.uuid}`}
            style={{ textDecoration: "none", width: "100%" }}
          >
            <div className={styles.userItem}>
              <Image
                src={post.picture.large}
                alt={`${post.name.first} ${post.name.last}`}
                width={56}
                height={56}
                className={styles.avatar}
              />

              <div className={styles.userInfo}>
                <span className={styles.userName}>
                  {post.name.title}. {post.name.first} {post.name.last}
                </span>
                <span className={styles.userEmail}>{post.email}</span>
              </div>

              <Image
                src="/phone.svg"
                alt="Phone icon"
                width={20}
                height={20}
                className={styles.phoneIcon}
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
